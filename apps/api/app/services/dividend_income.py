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


def _payment_months(events: list[AssetDividendEvent], setting: AssetDividendSetting | None) -> list[int]:
    months = {
        int(event.payment_date.month)
        for event in events
        if event.payment_date is not None and 1 <= int(event.payment_date.month) <= 12
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
                Asset.asset_class == "STOCK",
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
                Asset.asset_class == "STOCK",
                Holding.quantity > 0,
                Holding.is_hidden.is_(False),
            )
            .group_by(Asset.id)
            .order_by(Asset.name.asc(), Asset.id.asc())
        ).all()
    )
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
            result = fetch_dividends_for_asset(
                db,
                asset=asset,
                year=target_year,
                tax_rate_pct=setting.tax_rate_pct if setting and setting.tax_rate_pct is not None else None,
            )
        except DividendProviderError as exc:
            summary.failed_count += 1
            summary.errors.append(f"{_display_asset_name(asset)}: {exc.message}")
            if on_progress is not None:
                on_progress(summary.processed_assets, summary.total_assets, summary)
            continue

        if not result.items:
            summary.skipped_count += 1
        for event in result.items:
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
                ValuationSnapshotHoldingRow.asset_class == "STOCK",
                ValuationSnapshotHoldingRow.quantity > 0,
            )
        ).all()
    )
    if not holding_rows:
        return None

    asset_ids = [int(row.asset_id) for row in holding_rows if row.asset_id is not None]
    assets = {int(asset.id): asset for asset in db.scalars(select(Asset).where(Asset.id.in_(asset_ids or [-1]))).all()}
    settings_by_asset = {
        int(row.asset_id): row
        for row in db.scalars(select(AssetDividendSetting).where(AssetDividendSetting.asset_id.in_(asset_ids or [-1]))).all()
    }
    events_by_asset: dict[int, list[AssetDividendEvent]] = {}
    for event in db.scalars(select(AssetDividendEvent).where(AssetDividendEvent.asset_id.in_(asset_ids or [-1]))).all():
        if _event_matches_year(event, target_year):
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
        gross_per_share = Decimal("0")
        tax_per_share = Decimal("0")
        for event in events:
            event_gross = Decimal(event.dividend_per_share_gross or 0)
            rate = setting.tax_rate_pct if setting and setting.tax_rate_pct is not None else event.tax_rate_pct
            event_tax = (event_gross * Decimal(rate or 0) / Decimal("100")).quantize(Decimal("0.00000001"))
            gross_per_share += event_gross
            tax_per_share += event_tax
            dividend_currency = (event.dividend_currency or dividend_currency).upper()
        if not events and setting is not None and setting.manual_annual_dividend_per_share is not None:
            gross_per_share = Decimal(setting.manual_annual_dividend_per_share)
            rate = Decimal(setting.tax_rate_pct or 0)
            tax_per_share = (gross_per_share * rate / Decimal("100")).quantize(Decimal("0.00000001"))

        gross_native = quantity * gross_per_share
        tax_native = quantity * tax_per_share
        net_native = gross_native - tax_native
        gross_display = convert_amount(db, gross_native, dividend_currency, target_currency, fx_cache)
        tax_display = convert_amount(db, tax_native, dividend_currency, target_currency, fx_cache)
        net_display = convert_amount(db, net_native, dividend_currency, target_currency, fx_cache)
        receipt = receipt_sums.get((hrow.portfolio_id, hrow.asset_id), {"gross": Decimal("0"), "tax": Decimal("0"), "net": Decimal("0")})
        current_value = Decimal(hrow.evaluated_amount or 0)
        yield_pct = (net_display / current_value * Decimal("100")) if current_value > 0 else None
        months = _payment_months(events, setting)
        status = "EVENTS" if events else "MANUAL" if gross_per_share > 0 else "NO_EVENTS"

        db.add(
            DividendSnapshotAssetRow(
                dividend_snapshot_id=snapshot.id,
                portfolio_id=hrow.portfolio_id,
                portfolio_name=hrow.portfolio_name,
                asset_id=hrow.asset_id,
                asset_name=hrow.asset_name,
                symbol=hrow.symbol,
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
                dividend_yield_pct=yield_pct,
                tax_rate_pct=setting.tax_rate_pct if setting and setting.tax_rate_pct is not None else (events[0].tax_rate_pct if events else None),
                payment_months_json=months,
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
            },
        )
        p["current_value"] = Decimal(p["current_value"]) + current_value
        p["gross"] = Decimal(p["gross"]) + gross_display
        p["tax"] = Decimal(p["tax"]) + tax_display
        p["net"] = Decimal(p["net"]) + net_display
        p["rgross"] = Decimal(p["rgross"]) + receipt["gross"]
        p["rtax"] = Decimal(p["rtax"]) + receipt["tax"]
        p["rnet"] = Decimal(p["rnet"]) + receipt["net"]

    portfolios = {int(row.id): row for row in db.scalars(select(Portfolio).where(Portfolio.id.in_([pid for pid in portfolio_totals if pid] or [-1]))).all()}
    for item in portfolio_totals.values():
        portfolio = portfolios.get(int(item["portfolio_id"] or 0))
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
                Asset.asset_class == "STOCK",
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
