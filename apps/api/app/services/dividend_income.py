from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, date, datetime
from decimal import Decimal
from typing import Callable
from zoneinfo import ZoneInfo

from sqlalchemy import delete, func, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.asset import Asset
from app.models.dividend import (
    AssetDividendEvent,
    AssetDividendSetting,
    AssetProviderIdentifier,
    DividendReceipt,
    DividendSnapshot,
    DividendSnapshotAssetRow,
    DividendSnapshotPortfolioRow,
)
from app.models.holding import Holding
from app.models.portfolio import Portfolio
from app.models.transaction import Transaction
from app.models.valuation_snapshot import ValuationSnapshot, ValuationSnapshotHoldingRow
from app.services.currency import convert_amount
from app.services.dividend_provider import DividendProviderError, fetch_dividends_for_asset
from app.services.trade_ledger import TradeSyncError, normalize_trade_payload, sync_single_trade_scope


@dataclass
class DividendUpdateSummary:
    total_assets: int = 0
    processed_assets: int = 0
    updated_count: int = 0
    skipped_count: int = 0
    failed_count: int = 0
    errors: list[str] = field(default_factory=list)


@dataclass
class DividendSnapshotCollectResult:
    snapshot_date: date
    display_currency: str
    dividend_year: int
    user_scopes_collected: int
    upserted_rows: int


def _now_utc() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


def _default_snapshot_date() -> date:
    timezone_name = (settings.valuation_snapshot_timezone or "Asia/Seoul").strip() or "Asia/Seoul"
    try:
        timezone = ZoneInfo(timezone_name)
    except Exception:
        timezone = ZoneInfo("Asia/Seoul")
    return datetime.now(timezone).date()


def _to_decimal(value: object, default: Decimal = Decimal("0")) -> Decimal:
    if value is None:
        return default
    if isinstance(value, Decimal):
        return value
    try:
        return Decimal(str(value))
    except Exception:
        return default


def _event_matches_year(event: AssetDividendEvent, year: int) -> bool:
    if event.fiscal_year == year:
        return True
    for candidate in (
        event.payment_date,
        event.ex_dividend_date,
        event.record_date,
        event.dividend_base_date,
        event.declaration_date,
    ):
        if candidate is not None and candidate.year == year:
            return True
    return False


def _event_reference_date(event: AssetDividendEvent) -> date | None:
    return event.payment_date or event.ex_dividend_date or event.record_date or event.dividend_base_date or event.declaration_date


def _is_dividend_candidate_asset(asset: Asset | None) -> bool:
    if asset is None:
        return False
    if asset.asset_class in {"CRYPTO", "REAL_ESTATE", "DEPOSIT_SAVING"}:
        return False
    if asset.asset_class == "STOCK":
        return True
    text = f"{asset.name or ''} {asset.symbol or ''} {(asset.meta_json or {}).get('asset_type', '')}".upper()
    etf_markers = ("ETF", "KODEX", "TIGER", "ACE", "KBSTAR", "KOSEF", "SOL ", "RISE", "ARIRANG", "PLUS")
    return bool(asset.symbol) or any(marker in text for marker in etf_markers)


def _income_kind(asset: Asset) -> str:
    text = f"{asset.name or ''} {asset.symbol or ''} {(asset.meta_json or {}).get('asset_type', '')}".upper()
    distribution_markers = ("ETF", "KODEX", "TIGER", "ACE", "KBSTAR", "KOSEF", "SOL ", "RISE", "ARIRANG", "PLUS", "VOO", "SCHD", "SPY")
    if asset.asset_class in {"BOND", "ETC"} or any(marker in text for marker in distribution_markers):
        return "DISTRIBUTION"
    return "DIVIDEND"


def _tax_profile_for_portfolio(portfolio: Portfolio | None, dividend_currency: str) -> tuple[str, Decimal]:
    if portfolio is not None and portfolio.dividend_tax_profile:
        profile = portfolio.dividend_tax_profile.upper()
        if portfolio.dividend_tax_rate_pct is not None:
            return profile, Decimal(portfolio.dividend_tax_rate_pct)
    name = (portfolio.name if portfolio is not None else "").upper()
    category = (portfolio.category if portfolio is not None and portfolio.category else "").upper()
    if any(token in name for token in ("연금", "IRP", "퇴직")):
        return "PENSION", Decimal("0")
    if "ISA" in name:
        return "ISA", Decimal("0")
    if (dividend_currency or "").upper() == "USD" or category == "US_STOCK":
        return "GENERAL_US", Decimal("15")
    return "GENERAL_KR", Decimal("15.4")


def _average_event_amount(events: list[AssetDividendEvent]) -> Decimal | None:
    amounts = [Decimal(event.dividend_per_share_gross or 0) for event in events if Decimal(event.dividend_per_share_gross or 0) > 0]
    if not amounts:
        return None
    return sum(amounts, Decimal("0")) / Decimal(len(amounts))


def _forecast_dividend_per_share(
    *,
    events: list[AssetDividendEvent],
    setting: AssetDividendSetting | None,
    target_year: int,
) -> dict[str, object]:
    current_events = sorted(
        [event for event in events if _event_matches_year(event, target_year)],
        key=lambda event: _event_reference_date(event) or date.min,
    )
    prior_events = sorted(
        [event for event in events if _event_matches_year(event, target_year - 1)],
        key=lambda event: _event_reference_date(event) or date.min,
    )
    confirmed_gross = sum((Decimal(event.dividend_per_share_gross or 0) for event in current_events), Decimal("0"))
    confirmed_months = {(_event_reference_date(event) or date.min).month for event in current_events if _event_reference_date(event)}
    configured_months = set(_payment_months(current_events + prior_events, setting))
    if not configured_months and current_events:
        configured_months = set(confirmed_months)

    estimated_gross = Decimal("0")
    estimated_count = 0
    method = "NO_DATA"
    confidence = "NONE"
    missing_reason = None

    if current_events and configured_months and configured_months.issubset(confirmed_months):
        method = "CONFIRMED_FULL_YEAR"
        confidence = "HIGH"
    elif current_events:
        missing_months = sorted(configured_months - confirmed_months)
        prior_by_month: dict[int, list[AssetDividendEvent]] = {}
        for event in prior_events:
            ref = _event_reference_date(event)
            if ref:
                prior_by_month.setdefault(ref.month, []).append(event)
        fallback_avg = _average_event_amount(prior_events) or _average_event_amount(current_events)
        for month in missing_months:
            month_avg = _average_event_amount(prior_by_month.get(month, []))
            estimate = month_avg if month_avg is not None else fallback_avg
            if estimate is not None:
                estimated_gross += estimate
                estimated_count += 1
        if estimated_count:
            method = "PARTIAL_FORECAST"
            confidence = "MEDIUM" if prior_events else "LOW"
        else:
            method = "CONFIRMED_PARTIAL"
            confidence = "MEDIUM"
            missing_reason = "NO_REMAINING_PERIOD_ESTIMATE"
    elif prior_events:
        estimated_gross = sum((Decimal(event.dividend_per_share_gross or 0) for event in prior_events), Decimal("0"))
        estimated_count = len(prior_events)
        method = "FORECAST_FROM_LAST_YEAR"
        confidence = "MEDIUM"
    elif setting is not None and setting.manual_annual_dividend_per_share is not None:
        estimated_gross = Decimal(setting.manual_annual_dividend_per_share)
        estimated_count = len(setting.payment_months_json or []) or 1
        method = "MANUAL_ESTIMATE"
        confidence = "LOW"
    else:
        missing_reason = "MANUAL_ESTIMATE_NEEDED"

    return {
        "confirmed_gross": confirmed_gross,
        "estimated_gross": estimated_gross,
        "expected_gross": confirmed_gross + estimated_gross,
        "confirmed_event_count": len(current_events),
        "estimated_event_count": estimated_count,
        "method": method,
        "confidence": confidence,
        "missing_reason": missing_reason,
        "current_events": current_events,
        "all_relevant_events": current_events + prior_events,
    }


def _payment_months(events: list[AssetDividendEvent], setting: AssetDividendSetting | None) -> list[int]:
    months = {
        int(ref.month)
        for event in events
        if (ref := _event_reference_date(event)) is not None and 1 <= int(ref.month) <= 12
    }
    if not months and setting is not None and isinstance(setting.payment_months_json, list):
        for item in setting.payment_months_json:
            try:
                month = int(item)
            except (TypeError, ValueError):
                continue
            if 1 <= month <= 12:
                months.add(month)
    return sorted(months)


def _display_asset_name(asset: Asset) -> str:
    if asset.symbol:
        return f"{asset.name} ({asset.symbol})"
    return asset.name


def count_supported_dividend_assets(db: Session) -> int:
    return int(
        db.scalar(
            select(func.count(func.distinct(Asset.id)))
            .select_from(Holding)
            .join(Asset, Asset.id == Holding.asset_id)
            .where(
                Asset.asset_class.in_(["STOCK", "BOND", "ETC"]),
                Holding.quantity > 0,
                Holding.is_hidden.is_(False),
            )
        )
        or 0
    )


def refresh_dividends_for_supported_assets(
    db: Session,
    *,
    year: int | None = None,
    on_progress: Callable[[int, int, DividendUpdateSummary], None] | None = None,
) -> DividendUpdateSummary:
    target_year = int(year or _default_snapshot_date().year)
    assets = list(
        db.scalars(
            select(Asset)
            .join(Holding, Holding.asset_id == Asset.id)
            .where(
                Asset.asset_class.in_(["STOCK", "BOND", "ETC"]),
                Holding.quantity > 0,
                Holding.is_hidden.is_(False),
            )
            .group_by(Asset.id)
            .order_by(Asset.name.asc(), Asset.id.asc())
        ).all()
    )
    assets = [asset for asset in assets if _is_dividend_candidate_asset(asset)]
    summary = DividendUpdateSummary(total_assets=len(assets))
    settings_by_asset = {
        int(row.asset_id): row
        for row in db.scalars(select(AssetDividendSetting).where(AssetDividendSetting.asset_id.in_([a.id for a in assets] or [-1]))).all()
    }

    for asset in assets:
        summary.processed_assets += 1
        setting = settings_by_asset.get(int(asset.id))
        if setting is not None and not bool(setting.is_enabled):
            summary.skipped_count += 1
            if on_progress is not None:
                on_progress(summary.processed_assets, summary.total_assets, summary)
            continue

        try:
            results = [
                fetch_dividends_for_asset(
                    db,
                    asset=asset,
                    year=year_to_fetch,
                    tax_rate_pct=setting.tax_rate_pct if setting and setting.tax_rate_pct is not None else None,
                )
                for year_to_fetch in (target_year, target_year - 1)
            ]
        except DividendProviderError as exc:
            summary.failed_count += 1
            summary.errors.append(f"{_display_asset_name(asset)}: {exc.message}")
            if on_progress is not None:
                on_progress(summary.processed_assets, summary.total_assets, summary)
            continue

        items = [event for result in results for event in result.items]
        if not items:
            summary.skipped_count += 1
        for event in items:
            row = db.scalar(
                select(AssetDividendEvent).where(
                    AssetDividendEvent.asset_id == asset.id,
                    AssetDividendEvent.provider == event.provider,
                    AssetDividendEvent.provider_event_id == event.provider_event_id,
                )
            )
            if row is None:
                row = AssetDividendEvent(
                    asset_id=asset.id,
                    provider=event.provider,
                    provider_event_id=event.provider_event_id,
                    market=event.market,
                )
                db.add(row)
            row.symbol = event.symbol or asset.symbol
            row.isin_code = event.isin_code
            row.crno = event.crno
            row.asset_name = event.asset_name or asset.name
            row.dividend_type = event.dividend_type
            row.declaration_date = event.declaration_date
            row.ex_dividend_date = event.ex_dividend_date
            row.record_date = event.record_date
            row.payment_date = event.payment_date
            row.dividend_base_date = event.dividend_base_date
            row.fiscal_year = event.fiscal_year or target_year
            row.dividend_currency = event.dividend_currency
            row.dividend_per_share_gross = event.dividend_per_share_gross
            row.tax_rate_pct = event.tax_rate_pct
            row.withholding_tax_amount_per_share = event.withholding_tax_amount_per_share
            row.dividend_per_share_net_estimated = event.dividend_per_share_net_estimated
            row.status = "ESTIMATED"
            row.raw_json = event.raw
            summary.updated_count += 1
        db.commit()
        if on_progress is not None:
            on_progress(summary.processed_assets, summary.total_assets, summary)

    return summary


def _latest_user_valuation_snapshot(db: Session, *, owner_user_id: int, display_currency: str) -> ValuationSnapshot | None:
    return db.scalar(
        select(ValuationSnapshot)
        .where(
            ValuationSnapshot.scope_type == "USER",
            ValuationSnapshot.scope_id == owner_user_id,
            ValuationSnapshot.display_currency == display_currency,
        )
        .order_by(
            ValuationSnapshot.snapshot_date.desc(),
            ValuationSnapshot.as_of.desc(),
            ValuationSnapshot.id.desc(),
        )
    )


def _receipt_sums_by_asset(
    db: Session,
    *,
    owner_user_id: int,
    year: int,
    display_currency: str,
) -> dict[tuple[int | None, int | None], dict[str, Decimal]]:
    rows = list(
        db.scalars(
            select(DividendReceipt).where(
                DividendReceipt.owner_user_id == owner_user_id,
                DividendReceipt.status != "VOID",
                DividendReceipt.received_date >= date(year, 1, 1),
                DividendReceipt.received_date <= date(year, 12, 31),
            )
        ).all()
    )
    result: dict[tuple[int | None, int | None], dict[str, Decimal]] = {}
    fx_cache = {}
    for receipt in rows:
        key = (receipt.portfolio_id, receipt.asset_id)
        bucket = result.setdefault(key, {"gross": Decimal("0"), "tax": Decimal("0"), "net": Decimal("0")})
        bucket["gross"] += convert_amount(db, Decimal(receipt.gross_amount), receipt.currency, display_currency, fx_cache)
        bucket["tax"] += convert_amount(db, Decimal(receipt.withholding_tax), receipt.currency, display_currency, fx_cache)
        bucket["net"] += convert_amount(db, Decimal(receipt.net_amount), receipt.currency, display_currency, fx_cache)
    return result


def collect_dividend_snapshot_for_user(
    db: Session,
    *,
    owner_user_id: int,
    display_currency: str = "KRW",
    dividend_year: int | None = None,
    snapshot_date: date | None = None,
) -> DividendSnapshot | None:
    target_currency = (display_currency or "KRW").upper()
    target_year = int(dividend_year or _default_snapshot_date().year)
    target_date = snapshot_date or _default_snapshot_date()
    valuation_snapshot = _latest_user_valuation_snapshot(db, owner_user_id=owner_user_id, display_currency=target_currency)
    if valuation_snapshot is None:
        return None

    holding_rows = list(
        db.scalars(
            select(ValuationSnapshotHoldingRow).where(
                ValuationSnapshotHoldingRow.valuation_snapshot_id == valuation_snapshot.id,
                ValuationSnapshotHoldingRow.asset_class.in_(["STOCK", "BOND", "ETC"]),
                ValuationSnapshotHoldingRow.quantity > 0,
            )
        ).all()
    )
    asset_ids = [int(row.asset_id) for row in holding_rows if row.asset_id is not None]
    assets = {int(asset.id): asset for asset in db.scalars(select(Asset).where(Asset.id.in_(asset_ids or [-1]))).all()}
    holding_rows = [row for row in holding_rows if _is_dividend_candidate_asset(assets.get(int(row.asset_id or 0)))]
    if not holding_rows:
        return None
    asset_ids = [int(row.asset_id) for row in holding_rows if row.asset_id is not None]
    settings_by_asset = {
        int(row.asset_id): row
        for row in db.scalars(select(AssetDividendSetting).where(AssetDividendSetting.asset_id.in_(asset_ids or [-1]))).all()
    }
    events_by_asset: dict[int, list[AssetDividendEvent]] = {}
    for event in db.scalars(select(AssetDividendEvent).where(AssetDividendEvent.asset_id.in_(asset_ids or [-1]))).all():
        if _event_matches_year(event, target_year) or _event_matches_year(event, target_year - 1):
            events_by_asset.setdefault(int(event.asset_id), []).append(event)

    receipt_sums = _receipt_sums_by_asset(
        db,
        owner_user_id=owner_user_id,
        year=target_year,
        display_currency=target_currency,
    )

    snapshot = db.scalar(
        select(DividendSnapshot).where(
            DividendSnapshot.scope_type == "USER",
            DividendSnapshot.scope_id == owner_user_id,
            DividendSnapshot.display_currency == target_currency,
            DividendSnapshot.dividend_year == target_year,
            DividendSnapshot.snapshot_date == target_date,
        )
    )
    if snapshot is None:
        snapshot = DividendSnapshot(
            owner_user_id=owner_user_id,
            scope_type="USER",
            scope_id=owner_user_id,
            display_currency=target_currency,
            dividend_year=target_year,
            snapshot_date=target_date,
            as_of=valuation_snapshot.as_of,
        )
        db.add(snapshot)
        db.flush()

    db.execute(delete(DividendSnapshotAssetRow).where(DividendSnapshotAssetRow.dividend_snapshot_id == snapshot.id))
    db.execute(delete(DividendSnapshotPortfolioRow).where(DividendSnapshotPortfolioRow.dividend_snapshot_id == snapshot.id))

    totals = {"gross": Decimal("0"), "tax": Decimal("0"), "net": Decimal("0"), "rgross": Decimal("0"), "rtax": Decimal("0"), "rnet": Decimal("0")}
    portfolio_totals: dict[int | None, dict[str, object]] = {}
    fx_cache = {}
    portfolios_by_id = {
        int(row.id): row
        for row in db.scalars(select(Portfolio).where(Portfolio.id.in_([row.portfolio_id for row in holding_rows if row.portfolio_id] or [-1]))).all()
    }

    for hrow in holding_rows:
        asset = assets.get(int(hrow.asset_id or 0))
        if asset is None:
            continue
        setting = settings_by_asset.get(int(asset.id))
        if setting is not None and not bool(setting.is_enabled):
            continue
        events = events_by_asset.get(int(asset.id), [])
        quantity = Decimal(hrow.quantity or 0)
        dividend_currency = (setting.dividend_currency if setting and setting.dividend_currency else asset.currency or "KRW").upper()
        forecast = _forecast_dividend_per_share(events=events, setting=setting, target_year=target_year)
        relevant_events = list(forecast["all_relevant_events"])
        for event in relevant_events:
            dividend_currency = (event.dividend_currency or dividend_currency).upper()
        portfolio = portfolios_by_id.get(int(hrow.portfolio_id or 0))
        tax_profile, profile_rate = _tax_profile_for_portfolio(portfolio, dividend_currency)
        rate = Decimal(setting.tax_rate_pct) if setting and setting.tax_rate_pct is not None else profile_rate
        confirmed_per_share = Decimal(forecast["confirmed_gross"])
        estimated_per_share = Decimal(forecast["estimated_gross"])
        gross_per_share = Decimal(forecast["expected_gross"])
        confirmed_tax_per_share = (confirmed_per_share * rate / Decimal("100")).quantize(Decimal("0.00000001"))
        estimated_tax_per_share = (estimated_per_share * rate / Decimal("100")).quantize(Decimal("0.00000001"))
        tax_per_share = confirmed_tax_per_share + estimated_tax_per_share

        gross_native = quantity * gross_per_share
        tax_native = quantity * tax_per_share
        net_native = gross_native - tax_native
        confirmed_gross_native = quantity * confirmed_per_share
        confirmed_tax_native = quantity * confirmed_tax_per_share
        confirmed_net_native = confirmed_gross_native - confirmed_tax_native
        estimated_gross_native = quantity * estimated_per_share
        estimated_tax_native = quantity * estimated_tax_per_share
        estimated_net_native = estimated_gross_native - estimated_tax_native
        gross_display = convert_amount(db, gross_native, dividend_currency, target_currency, fx_cache)
        tax_display = convert_amount(db, tax_native, dividend_currency, target_currency, fx_cache)
        net_display = convert_amount(db, net_native, dividend_currency, target_currency, fx_cache)
        confirmed_gross_display = convert_amount(db, confirmed_gross_native, dividend_currency, target_currency, fx_cache)
        confirmed_tax_display = convert_amount(db, confirmed_tax_native, dividend_currency, target_currency, fx_cache)
        confirmed_net_display = convert_amount(db, confirmed_net_native, dividend_currency, target_currency, fx_cache)
        estimated_gross_display = convert_amount(db, estimated_gross_native, dividend_currency, target_currency, fx_cache)
        estimated_tax_display = convert_amount(db, estimated_tax_native, dividend_currency, target_currency, fx_cache)
        estimated_net_display = convert_amount(db, estimated_net_native, dividend_currency, target_currency, fx_cache)
        receipt = receipt_sums.get((hrow.portfolio_id, hrow.asset_id), {"gross": Decimal("0"), "tax": Decimal("0"), "net": Decimal("0")})
        current_value = Decimal(hrow.evaluated_amount or 0)
        yield_pct = (net_display / current_value * Decimal("100")) if current_value > 0 else None
        months = _payment_months(relevant_events, setting)
        status = str(forecast["method"])
        missing_reason = forecast["missing_reason"]
        if not events and gross_per_share <= 0:
            identifiers = db.scalars(select(AssetProviderIdentifier).where(AssetProviderIdentifier.asset_id == asset.id)).all()
            missing_reason = "MISSING_IDENTIFIER" if not identifiers and not asset.symbol else (missing_reason or "NO_PROVIDER_DATA")

        db.add(
            DividendSnapshotAssetRow(
                dividend_snapshot_id=snapshot.id,
                portfolio_id=hrow.portfolio_id,
                portfolio_name=hrow.portfolio_name,
                asset_id=hrow.asset_id,
                asset_name=hrow.asset_name,
                symbol=hrow.symbol,
                income_kind=_income_kind(asset),
                asset_currency=hrow.asset_currency,
                quantity=quantity,
                current_value=current_value,
                dividend_currency=dividend_currency,
                expected_annual_gross=gross_native,
                expected_annual_tax=tax_native,
                expected_annual_net=net_native,
                expected_annual_gross_display=gross_display,
                expected_annual_tax_display=tax_display,
                expected_annual_net_display=net_display,
                received_ytd_gross_display=receipt["gross"],
                received_ytd_tax_display=receipt["tax"],
                received_ytd_net_display=receipt["net"],
                confirmed_annual_gross_display=confirmed_gross_display,
                confirmed_annual_tax_display=confirmed_tax_display,
                confirmed_annual_net_display=confirmed_net_display,
                estimated_annual_gross_display=estimated_gross_display,
                estimated_annual_tax_display=estimated_tax_display,
                estimated_annual_net_display=estimated_net_display,
                dividend_yield_pct=yield_pct,
                tax_rate_pct=rate,
                tax_profile=tax_profile,
                payment_months_json=months,
                estimate_method=str(forecast["method"]),
                confidence=str(forecast["confidence"]),
                missing_reason=missing_reason,
                confirmed_event_count=int(forecast["confirmed_event_count"]),
                estimated_event_count=int(forecast["estimated_event_count"]),
                status=status,
            )
        )
        totals["gross"] += gross_display
        totals["tax"] += tax_display
        totals["net"] += net_display
        totals["rgross"] += receipt["gross"]
        totals["rtax"] += receipt["tax"]
        totals["rnet"] += receipt["net"]

        p = portfolio_totals.setdefault(
            hrow.portfolio_id,
            {
                "portfolio_id": hrow.portfolio_id,
                "portfolio_name": hrow.portfolio_name,
                "portfolio_type": None,
                "base_currency": None,
                "current_value": Decimal("0"),
                "gross": Decimal("0"),
                "tax": Decimal("0"),
                "net": Decimal("0"),
                "rgross": Decimal("0"),
                "rtax": Decimal("0"),
                "rnet": Decimal("0"),
                "confirmed_gross": Decimal("0"),
                "confirmed_tax": Decimal("0"),
                "confirmed_net": Decimal("0"),
                "estimated_gross": Decimal("0"),
                "estimated_tax": Decimal("0"),
                "estimated_net": Decimal("0"),
            },
        )
        p["current_value"] = Decimal(p["current_value"]) + current_value
        p["gross"] = Decimal(p["gross"]) + gross_display
        p["tax"] = Decimal(p["tax"]) + tax_display
        p["net"] = Decimal(p["net"]) + net_display
        p["rgross"] = Decimal(p["rgross"]) + receipt["gross"]
        p["rtax"] = Decimal(p["rtax"]) + receipt["tax"]
        p["rnet"] = Decimal(p["rnet"]) + receipt["net"]
        p["confirmed_gross"] = Decimal(p["confirmed_gross"]) + confirmed_gross_display
        p["confirmed_tax"] = Decimal(p["confirmed_tax"]) + confirmed_tax_display
        p["confirmed_net"] = Decimal(p["confirmed_net"]) + confirmed_net_display
        p["estimated_gross"] = Decimal(p["estimated_gross"]) + estimated_gross_display
        p["estimated_tax"] = Decimal(p["estimated_tax"]) + estimated_tax_display
        p["estimated_net"] = Decimal(p["estimated_net"]) + estimated_net_display

    for item in portfolio_totals.values():
        portfolio = portfolios_by_id.get(int(item["portfolio_id"] or 0))
        current_value = Decimal(item["current_value"])
        net_value = Decimal(item["net"])
        db.add(
            DividendSnapshotPortfolioRow(
                dividend_snapshot_id=snapshot.id,
                portfolio_id=item["portfolio_id"],
                portfolio_name=str(item["portfolio_name"]),
                portfolio_type=portfolio.type if portfolio is not None else None,
                base_currency=portfolio.base_currency if portfolio is not None else None,
                expected_annual_gross_display=item["gross"],
                expected_annual_tax_display=item["tax"],
                expected_annual_net_display=item["net"],
                received_ytd_gross_display=item["rgross"],
                received_ytd_tax_display=item["rtax"],
                received_ytd_net_display=item["rnet"],
                confirmed_annual_gross_display=item["confirmed_gross"],
                confirmed_annual_tax_display=item["confirmed_tax"],
                confirmed_annual_net_display=item["confirmed_net"],
                estimated_annual_gross_display=item["estimated_gross"],
                estimated_annual_tax_display=item["estimated_tax"],
                estimated_annual_net_display=item["estimated_net"],
                dividend_yield_pct=(net_value / current_value * Decimal("100")) if current_value > 0 else None,
            )
        )

    snapshot.as_of = valuation_snapshot.as_of
    snapshot.expected_annual_gross = totals["gross"]
    snapshot.expected_annual_tax = totals["tax"]
    snapshot.expected_annual_net = totals["net"]
    snapshot.received_ytd_gross = totals["rgross"]
    snapshot.received_ytd_tax = totals["rtax"]
    snapshot.received_ytd_net = totals["rnet"]
    db.commit()
    db.refresh(snapshot)
    return snapshot


def collect_dividend_snapshots_batch(
    db: Session,
    *,
    display_currency: str = "KRW",
    dividend_year: int | None = None,
    snapshot_date: date | None = None,
) -> DividendSnapshotCollectResult:
    target_currency = (display_currency or "KRW").upper()
    target_year = int(dividend_year or _default_snapshot_date().year)
    target_date = snapshot_date or _default_snapshot_date()
    user_ids = list(
        db.scalars(
            select(Holding.owner_user_id)
            .join(Asset, Asset.id == Holding.asset_id)
            .where(
                Asset.asset_class.in_(["STOCK", "BOND", "ETC"]),
                Holding.quantity > 0,
                Holding.is_hidden.is_(False),
            )
            .group_by(Holding.owner_user_id)
        ).all()
    )
    collected = 0
    for user_id in user_ids:
        snapshot = collect_dividend_snapshot_for_user(
            db,
            owner_user_id=int(user_id),
            display_currency=target_currency,
            dividend_year=target_year,
            snapshot_date=target_date,
        )
        if snapshot is not None:
            collected += 1
    return DividendSnapshotCollectResult(
        snapshot_date=target_date,
        display_currency=target_currency,
        dividend_year=target_year,
        user_scopes_collected=collected,
        upserted_rows=collected,
    )


def get_latest_dividend_snapshot(
    db: Session,
    *,
    owner_user_id: int,
    display_currency: str = "KRW",
    dividend_year: int | None = None,
) -> DividendSnapshot | None:
    target_year = int(dividend_year or _default_snapshot_date().year)
    target_currency = (display_currency or "KRW").upper()
    return db.scalar(
        select(DividendSnapshot)
        .where(
            DividendSnapshot.scope_type == "USER",
            DividendSnapshot.scope_id == owner_user_id,
            DividendSnapshot.display_currency == target_currency,
            DividendSnapshot.dividend_year == target_year,
        )
        .order_by(DividendSnapshot.snapshot_date.desc(), DividendSnapshot.as_of.desc(), DividendSnapshot.id.desc())
    )


def create_dividend_receipt_transaction(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
    asset_id: int | None,
    received_at: datetime,
    currency: str,
    net_amount: Decimal,
    memo: str | None,
) -> Transaction:
    payload = {
        "portfolio_id": portfolio_id,
        "txn_type": "DIVIDEND",
        "asset_id": asset_id,
        "liability_id": None,
        "amount": net_amount,
        "currency": currency,
        "executed_at": received_at,
        "memo": memo,
        "source_type": "MANUAL",
        "auto_apply_cash_holding": True,
        "auto_apply_portfolio_cashflow": False,
    }
    normalized = normalize_trade_payload(
        db=db,
        owner_user_id=owner_user_id,
        payload=payload,
        strict_fx=settings.fx_strict_mode,
    )
    txn = Transaction(owner_user_id=owner_user_id, **normalized)
    db.add(txn)
    db.flush()
    sync_single_trade_scope(
        db=db,
        owner_user_id=owner_user_id,
        portfolio_id=txn.portfolio_id,
        asset_id=txn.asset_id,
        liability_id=txn.liability_id,
    )
    return txn
