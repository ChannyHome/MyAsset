from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, date, datetime, timedelta
from decimal import Decimal
from typing import Literal

from sqlalchemy import and_, or_, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.asset import Asset
from app.models.holding import Holding
from app.models.latest_quote import LatestQuote
from app.models.liability import Liability
from app.models.portfolio import Portfolio
from app.models.snapshot import (
    SnapshotHoldingRow,
    SnapshotLiabilityRow,
    SnapshotPortfolioRow,
    SnapshotSet,
)
from app.models.valuation_snapshot import (
    ValuationSnapshot,
    ValuationSnapshotHoldingRow,
    ValuationSnapshotLiabilityRow,
    ValuationSnapshotPortfolioRow,
)
from app.schemas.analytics import (
    AnalyticsQuickInsightDeltaItemOut,
    AnalyticsQuickInsightDriverGroupOut,
    AnalyticsQuickInsightOut,
    AnalyticsQuickInsightPortfolioChangesOut,
    AnalyticsQuickInsightRankedGroupOut,
    AnalyticsQuickInsightSummaryAlertOut,
    AnalyticsQuickInsightWarningItemOut,
    AnalyticsQuickInsightWarningsOut,
)
from app.schemas.snapshot import SnapshotCsvPreviewOut
from app.services.analytics_summary import calculate_summary_values
from app.services.app_settings import get_fx_stale_minutes
from app.services.currency import FxCache, convert_amount

QuickInsightPeriod = Literal["1D", "7D", "30D"]

_PERIOD_DAYS: dict[QuickInsightPeriod, int] = {
    "1D": 1,
    "7D": 7,
    "30D": 30,
}


@dataclass
class HoldingMetric:
    key: str
    portfolio_id: int | None
    portfolio_name: str
    asset_id: int | None
    asset_name: str
    symbol: str | None
    asset_class: str
    evaluated: Decimal
    cost_basis: Decimal
    profit: Decimal
    return_pct: Decimal | None
    quote_source: str | None
    quote_as_of: datetime | None


@dataclass
class LiabilityMetric:
    key: str
    portfolio_id: int | None
    portfolio_name: str
    liability_id: int | None
    liability_name: str
    liability_type: str
    balance: Decimal


@dataclass
class PortfolioMetric:
    key: str
    portfolio_id: int | None
    portfolio_name: str
    portfolio_type: str | None
    current_value: Decimal
    current_net: Decimal


@dataclass
class SummaryMetric:
    gross_assets_total: Decimal
    liabilities_total: Decimal
    net_assets_total: Decimal
    as_of: datetime


def _holding_effective_cost_basis(holding: Holding) -> tuple[Decimal, str]:
    invested = Decimal(holding.invested_amount) if holding.invested_amount is not None else None
    fallback_cost = Decimal(holding.quantity) * Decimal(holding.avg_price)
    if invested is not None:
        if invested > 0:
            return invested, holding.invested_amount_currency
        if invested == 0 and fallback_cost > 0:
            return fallback_cost, holding.avg_price_currency
        return invested, holding.invested_amount_currency
    return fallback_cost, holding.avg_price_currency


def _normalize_display_currency(display_currency: str | None) -> str:
    return "USD" if str(display_currency or "").upper() == "USD" else "KRW"


def _normalize_period(period: str | None) -> QuickInsightPeriod:
    value = str(period or "1D").upper()
    if value not in _PERIOD_DAYS:
        return "1D"
    return value  # type: ignore[return-value]


def _find_baseline_snapshot(
    db: Session,
    *,
    scope_type: str,
    scope_id: int,
    target_currency: str,
    baseline_date: date,
) -> ValuationSnapshot | None:
    target_stmt = (
        select(ValuationSnapshot)
        .where(
            ValuationSnapshot.scope_type == scope_type,
            ValuationSnapshot.scope_id == scope_id,
            ValuationSnapshot.display_currency == target_currency,
            ValuationSnapshot.snapshot_date <= baseline_date,
        )
        .order_by(ValuationSnapshot.snapshot_date.desc(), ValuationSnapshot.id.desc())
        .limit(1)
    )
    target_row = db.scalar(target_stmt)
    if target_row is not None:
        return target_row

    fallback_currency = "USD" if target_currency == "KRW" else "KRW"
    fallback_stmt = (
        select(ValuationSnapshot)
        .where(
            ValuationSnapshot.scope_type == scope_type,
            ValuationSnapshot.scope_id == scope_id,
            ValuationSnapshot.display_currency == fallback_currency,
            ValuationSnapshot.snapshot_date <= baseline_date,
        )
        .order_by(ValuationSnapshot.snapshot_date.desc(), ValuationSnapshot.id.desc())
        .limit(1)
    )
    return db.scalar(fallback_stmt)


def _convert_snapshot_amount(
    db: Session,
    *,
    amount: Decimal,
    from_currency: str,
    to_currency: str,
    cache: FxCache,
) -> Decimal:
    return convert_amount(
        db=db,
        amount=Decimal(amount),
        from_currency=from_currency,
        to_currency=to_currency,
        cache=cache,
        strict=settings.fx_strict_mode,
    )


def _status_for_pair(current_exists: bool, baseline_exists: bool) -> str | None:
    if current_exists and not baseline_exists:
        return "NEW"
    if not current_exists and baseline_exists:
        return "REMOVED"
    return None


def _resolve_display_class(
    *,
    asset_class: str | None,
    symbol: str | None,
    label: str | None,
    entity_type: Literal["HOLDING", "LIABILITY", "PORTFOLIO"] | None = None,
) -> str | None:
    if entity_type == "LIABILITY":
        return "LIABILITY"
    symbol_text = (symbol or "").upper().strip()
    label_text = (label or "").upper().strip()
    asset_class_text = (asset_class or "").upper().strip() or None
    if symbol_text.startswith("CASH_AUTO_") or "AUTO CASH BALANCE" in label_text:
        return "CASH"
    return asset_class_text


def _display_reason(display_class: str | None) -> str:
    normalized = (display_class or "").upper()
    if normalized == "REAL_ESTATE":
        return "Real Estate revaluation"
    if normalized in {"CASH", "DEPOSIT_SAVING"}:
        return "cash movement"
    if normalized == "LIABILITY":
        return "liability change"
    if normalized == "CRYPTO":
        return "crypto price move"
    if normalized == "STOCK":
        return "equity price move"
    if normalized == "BOND":
        return "bond valuation move"
    return "valuation move"


def _material_change_threshold(baseline_gross: Decimal) -> Decimal:
    gross_threshold = abs(Decimal(baseline_gross)) * Decimal("0.0025")
    return max(Decimal("1"), gross_threshold)


def _format_decimal_text(value: Decimal) -> str:
    quantized = Decimal(value).quantize(Decimal("1"))
    return format(int(quantized), ",")


def _make_delta_item(
    *,
    entity_type: Literal["HOLDING", "LIABILITY", "PORTFOLIO"],
    key: str,
    label: str,
    portfolio_name: str | None,
    delta_amount: Decimal | None = None,
    delta_return_pct: Decimal | None = None,
    current_value: Decimal | None = None,
    baseline_value: Decimal | None = None,
    status: str | None = None,
    asset_class: str | None = None,
    display_class: str | None = None,
) -> AnalyticsQuickInsightDeltaItemOut:
    return AnalyticsQuickInsightDeltaItemOut(
        entity_type=entity_type,
        key=key,
        label=label,
        portfolio_name=portfolio_name,
        delta_amount=delta_amount,
        delta_return_pct=delta_return_pct,
        current_value=current_value,
        baseline_value=baseline_value,
        status=status,
        asset_class=asset_class,
        display_class=display_class,
    )


def _top_n_positive(items: list[AnalyticsQuickInsightDeltaItemOut], n: int) -> list[AnalyticsQuickInsightDeltaItemOut]:
    filtered = [
        item
        for item in items
        if item.delta_amount is not None and Decimal(item.delta_amount) > 0
    ]
    filtered.sort(key=lambda item: Decimal(item.delta_amount or 0), reverse=True)
    return filtered[:n]


def _top_n_negative(items: list[AnalyticsQuickInsightDeltaItemOut], n: int) -> list[AnalyticsQuickInsightDeltaItemOut]:
    filtered = [
        item
        for item in items
        if item.delta_amount is not None and Decimal(item.delta_amount) < 0
    ]
    filtered.sort(key=lambda item: Decimal(item.delta_amount or 0))
    return filtered[:n]


def _top_n_return_positive(
    items: list[AnalyticsQuickInsightDeltaItemOut], n: int
) -> list[AnalyticsQuickInsightDeltaItemOut]:
    filtered = [
        item
        for item in items
        if item.delta_return_pct is not None and Decimal(item.delta_return_pct) > 0
    ]
    filtered.sort(key=lambda item: Decimal(item.delta_return_pct or 0), reverse=True)
    return filtered[:n]


def _top_n_return_negative(
    items: list[AnalyticsQuickInsightDeltaItemOut], n: int
) -> list[AnalyticsQuickInsightDeltaItemOut]:
    filtered = [
        item
        for item in items
        if item.delta_return_pct is not None and Decimal(item.delta_return_pct) < 0
    ]
    filtered.sort(key=lambda item: Decimal(item.delta_return_pct or 0))
    return filtered[:n]


def _top_n_by_abs(items: list[AnalyticsQuickInsightDeltaItemOut], n: int) -> list[AnalyticsQuickInsightDeltaItemOut]:
    filtered = [item for item in items if item.delta_amount is not None]
    filtered.sort(key=lambda item: abs(Decimal(item.delta_amount or 0)), reverse=True)
    return filtered[:n]


def _build_summary_comment(
    *,
    period: QuickInsightPeriod,
    gross_delta: Decimal,
    net_delta: Decimal,
    liabilities_delta: Decimal,
    baseline_gross: Decimal | None,
    gross_loser: AnalyticsQuickInsightDeltaItemOut | None,
    gross_gainer: AnalyticsQuickInsightDeltaItemOut | None,
    net_drag: AnalyticsQuickInsightDeltaItemOut | None,
    net_boost: AnalyticsQuickInsightDeltaItemOut | None,
) -> tuple[str, Literal["positive", "negative", "neutral"]]:
    threshold = _material_change_threshold(baseline_gross or Decimal("0"))
    if abs(gross_delta) < threshold and abs(net_delta) < threshold and abs(liabilities_delta) < threshold:
        return f"No material change over {period}.", "neutral"

    if net_delta < 0:
        if liabilities_delta > 0 and net_drag is not None and net_drag.entity_type == "LIABILITY":
            return (
                f"Alert: Net {period} down by {_format_decimal_text(liabilities_delta)},"
                f" mainly due to increased liabilities in {net_drag.label}.",
                "negative",
            )
        if gross_loser is not None:
            driver_reason = _display_reason(gross_loser.display_class)
            return (
                f"Alert: Gross {period} down by {_format_decimal_text(abs(gross_delta))},"
                f" mainly driven by {gross_loser.label} ({driver_reason}).",
                "negative",
            )
        return f"Alert: Net {period} moved lower versus baseline.", "negative"

    if net_delta > 0:
        if gross_gainer is not None:
            driver_reason = _display_reason(gross_gainer.display_class)
            return (
                f"Comment: Net {period} up by {_format_decimal_text(net_delta)},"
                f" led by {gross_gainer.label} ({driver_reason}).",
                "positive",
            )
        if net_boost is not None:
            driver_reason = _display_reason(net_boost.display_class)
            return (
                f"Comment: Net {period} up by {_format_decimal_text(net_delta)},"
                f" helped by {net_boost.label} ({driver_reason}).",
                "positive",
            )
        return f"Comment: Net {period} moved higher versus baseline.", "positive"

    if gross_delta < 0 and gross_loser is not None:
        driver_reason = _display_reason(gross_loser.display_class)
        return (
            f"Alert: Gross {period} is lower, mainly due to {gross_loser.label} ({driver_reason}).",
            "negative",
        )
    if gross_delta > 0 and gross_gainer is not None:
        driver_reason = _display_reason(gross_gainer.display_class)
        return (
            f"Comment: Gross {period} is higher, led by {gross_gainer.label} ({driver_reason}).",
            "positive",
        )
    return f"No net change over {period}, but components moved internally.", "neutral"


def _holding_key(portfolio_id: int | None, asset_id: int | None, asset_name: str) -> str:
    return f"holding:{portfolio_id if portfolio_id is not None else 'none'}:{asset_id if asset_id is not None else asset_name}"


def _liability_key(portfolio_id: int | None, liability_id: int | None, liability_name: str) -> str:
    return f"liability:{portfolio_id if portfolio_id is not None else 'none'}:{liability_id if liability_id is not None else liability_name}"


def _portfolio_key(portfolio_id: int | None, portfolio_name: str) -> str:
    return f"portfolio:{portfolio_id if portfolio_id is not None else portfolio_name}"


def _make_warning_item(
    *,
    key: str,
    label: str,
    portfolio_name: str | None,
    symbol: str | None,
    asset_class: str | None,
    display_class: str | None,
    quote_source: str | None,
    quote_as_of: datetime | None,
) -> AnalyticsQuickInsightWarningItemOut:
    return AnalyticsQuickInsightWarningItemOut(
        key=key,
        label=label,
        portfolio_name=portfolio_name,
        symbol=symbol,
        asset_class=asset_class,
        display_class=display_class,
        quote_source=quote_source,
        quote_as_of=quote_as_of,
    )


def _load_current_holding_metrics(
    db: Session,
    *,
    scope_user_ids: list[int],
    display_currency: str,
    cache: FxCache,
) -> tuple[
    dict[str, HoldingMetric],
    int,
    int,
    int,
    list[AnalyticsQuickInsightWarningItemOut],
    list[AnalyticsQuickInsightWarningItemOut],
]:
    stmt = (
        select(Holding, Asset, Portfolio, LatestQuote)
        .join(Asset, Asset.id == Holding.asset_id)
        .outerjoin(Portfolio, Holding.portfolio_id == Portfolio.id)
        .outerjoin(LatestQuote, LatestQuote.asset_id == Holding.asset_id)
        .where(
            Holding.owner_user_id.in_(scope_user_ids),
            Holding.is_hidden.is_(False),
            or_(Holding.portfolio_id.is_(None), Portfolio.is_hidden.is_(False)),
            or_(Holding.portfolio_id.is_(None), Portfolio.is_included.is_(True)),
        )
    )
    rows = db.execute(stmt).all()
    stale_minutes, _stale_source = get_fx_stale_minutes(db)
    stale_cutoff = datetime.now(UTC).replace(tzinfo=None) - timedelta(minutes=stale_minutes)
    metrics: dict[str, HoldingMetric] = {}
    stale_quote_count = 0
    manual_quote_count = 0
    missing_quote_count = 0
    manual_quote_items: list[AnalyticsQuickInsightWarningItemOut] = []
    missing_quote_items: list[AnalyticsQuickInsightWarningItemOut] = []

    for holding, asset, portfolio, quote in rows:
        effective_cost_basis, cost_currency = _holding_effective_cost_basis(holding)
        unit_price = quote.price if quote is not None else holding.avg_price
        unit_currency = quote.currency if quote is not None and quote.currency else holding.avg_price_currency
        evaluated = convert_amount(
            db=db,
            amount=Decimal(holding.quantity) * Decimal(unit_price),
            from_currency=unit_currency,
            to_currency=display_currency,
            cache=cache,
            strict=settings.fx_strict_mode,
        )
        cost_basis = convert_amount(
            db=db,
            amount=effective_cost_basis,
            from_currency=cost_currency,
            to_currency=display_currency,
            cache=cache,
            strict=settings.fx_strict_mode,
        )
        profit = evaluated - cost_basis
        return_pct = None if cost_basis == 0 else (profit / cost_basis) * Decimal("100")
        key = _holding_key(holding.portfolio_id, asset.id, asset.name)
        label = f"{asset.name} ({asset.symbol})" if asset.symbol else asset.name
        portfolio_name = portfolio.name if portfolio is not None else "Unassigned"
        metrics[key] = HoldingMetric(
            key=key,
            portfolio_id=holding.portfolio_id,
            portfolio_name=portfolio_name,
            asset_id=asset.id,
            asset_name=label,
            symbol=asset.symbol,
            asset_class=asset.asset_class,
            evaluated=evaluated,
            cost_basis=cost_basis,
            profit=profit,
            return_pct=return_pct,
            quote_source=quote.source if quote is not None else None,
            quote_as_of=quote.as_of if quote is not None else None,
        )
        display_class = _resolve_display_class(
            asset_class=asset.asset_class,
            symbol=asset.symbol,
            label=label,
            entity_type="HOLDING",
        )
        if display_class == "CASH":
            continue
        if quote is None:
            missing_quote_count += 1
            missing_quote_items.append(
                _make_warning_item(
                    key=key,
                    label=label,
                    portfolio_name=portfolio_name,
                    symbol=asset.symbol,
                    asset_class=asset.asset_class,
                    display_class=display_class,
                    quote_source=None,
                    quote_as_of=None,
                )
            )
            continue
        if quote.as_of < stale_cutoff:
            stale_quote_count += 1
        if (quote.source or "").upper() == "MANUAL":
            manual_quote_count += 1
            manual_quote_items.append(
                _make_warning_item(
                    key=key,
                    label=label,
                    portfolio_name=portfolio_name,
                    symbol=asset.symbol,
                    asset_class=asset.asset_class,
                    display_class=display_class,
                    quote_source=quote.source,
                    quote_as_of=quote.as_of,
                )
            )

    return (
        metrics,
        stale_quote_count,
        manual_quote_count,
        missing_quote_count,
        manual_quote_items,
        missing_quote_items,
    )


def _load_current_liability_metrics(
    db: Session,
    *,
    scope_user_ids: list[int],
    display_currency: str,
    cache: FxCache,
) -> dict[str, LiabilityMetric]:
    stmt = (
        select(Liability, Portfolio)
        .outerjoin(Portfolio, Liability.portfolio_id == Portfolio.id)
        .where(
            Liability.owner_user_id.in_(scope_user_ids),
            Liability.is_hidden.is_(False),
            Liability.is_included.is_(True),
            or_(Liability.portfolio_id.is_(None), Portfolio.is_hidden.is_(False)),
            or_(Liability.portfolio_id.is_(None), Portfolio.is_included.is_(True)),
        )
    )
    rows = db.execute(stmt).all()
    metrics: dict[str, LiabilityMetric] = {}
    for liability, portfolio in rows:
        balance = convert_amount(
            db=db,
            amount=Decimal(liability.outstanding_balance),
            from_currency=liability.currency,
            to_currency=display_currency,
            cache=cache,
            strict=settings.fx_strict_mode,
        )
        key = _liability_key(liability.portfolio_id, liability.id, liability.name)
        metrics[key] = LiabilityMetric(
            key=key,
            portfolio_id=liability.portfolio_id,
            portfolio_name=portfolio.name if portfolio is not None else "Unassigned",
            liability_id=liability.id,
            liability_name=liability.name,
            liability_type=liability.liability_type,
            balance=balance,
        )
    return metrics


def _load_current_portfolio_metrics(
    db: Session,
    *,
    scope_user_ids: list[int],
    display_currency: str,
    cache: FxCache,
) -> dict[str, PortfolioMetric]:
    portfolios = list(
        db.scalars(
            select(Portfolio).where(
                Portfolio.owner_user_id.in_(scope_user_ids),
                Portfolio.is_hidden.is_(False),
                Portfolio.is_included.is_(True),
            )
        ).all()
    )
    if not portfolios:
        return {}

    portfolio_ids = [portfolio.id for portfolio in portfolios]
    holdings = list(
        db.scalars(
            select(Holding).where(
                Holding.owner_user_id.in_(scope_user_ids),
                Holding.portfolio_id.in_(portfolio_ids),
                Holding.is_hidden.is_(False),
            )
        ).all()
    )
    liabilities = list(
        db.scalars(
            select(Liability).where(
                Liability.owner_user_id.in_(scope_user_ids),
                Liability.portfolio_id.in_(portfolio_ids),
                Liability.is_hidden.is_(False),
                Liability.is_included.is_(True),
            )
        ).all()
    )
    quote_map = {
        quote.asset_id: quote
        for quote in db.scalars(select(LatestQuote).where(LatestQuote.asset_id.in_({holding.asset_id for holding in holdings}))).all()
    }
    holdings_by_portfolio: dict[int, list[Holding]] = {portfolio.id: [] for portfolio in portfolios}
    for holding in holdings:
        if holding.portfolio_id is not None:
            holdings_by_portfolio.setdefault(holding.portfolio_id, []).append(holding)
    liabilities_by_portfolio: dict[int, list[Liability]] = {portfolio.id: [] for portfolio in portfolios}
    for liability in liabilities:
        if liability.portfolio_id is not None:
            liabilities_by_portfolio.setdefault(liability.portfolio_id, []).append(liability)

    metrics: dict[str, PortfolioMetric] = {}
    for portfolio in portfolios:
        gross_total = Decimal("0")
        for holding in holdings_by_portfolio.get(portfolio.id, []):
            quote = quote_map.get(holding.asset_id)
            unit_price = quote.price if quote is not None else holding.avg_price
            unit_currency = quote.currency if quote is not None and quote.currency else holding.avg_price_currency
            gross_total += convert_amount(
                db=db,
                amount=Decimal(holding.quantity) * Decimal(unit_price),
                from_currency=unit_currency,
                to_currency=display_currency,
                cache=cache,
                strict=settings.fx_strict_mode,
            )
        liabilities_total = Decimal("0")
        for liability in liabilities_by_portfolio.get(portfolio.id, []):
            liabilities_total += convert_amount(
                db=db,
                amount=Decimal(liability.outstanding_balance),
                from_currency=liability.currency,
                to_currency=display_currency,
                cache=cache,
                strict=settings.fx_strict_mode,
            )
        key = _portfolio_key(portfolio.id, portfolio.name)
        metrics[key] = PortfolioMetric(
            key=key,
            portfolio_id=portfolio.id,
            portfolio_name=portfolio.name,
            portfolio_type=portfolio.type,
            current_value=gross_total,
            current_net=gross_total - liabilities_total,
        )
    return metrics


def _load_baseline_holding_metrics(
    db: Session,
    *,
    snapshot: ValuationSnapshot,
    display_currency: str,
    cache: FxCache,
) -> dict[str, HoldingMetric]:
    rows = db.scalars(
        select(ValuationSnapshotHoldingRow).where(ValuationSnapshotHoldingRow.valuation_snapshot_id == snapshot.id)
    ).all()
    metrics: dict[str, HoldingMetric] = {}
    for row in rows:
        evaluated = _convert_snapshot_amount(
            db,
            amount=Decimal(row.evaluated_amount),
            from_currency=snapshot.display_currency,
            to_currency=display_currency,
            cache=cache,
        )
        cost_basis = _convert_snapshot_amount(
            db,
            amount=Decimal(row.cost_basis_total),
            from_currency=snapshot.display_currency,
            to_currency=display_currency,
            cache=cache,
        )
        profit = _convert_snapshot_amount(
            db,
            amount=Decimal(row.profit_total),
            from_currency=snapshot.display_currency,
            to_currency=display_currency,
            cache=cache,
        )
        key = _holding_key(row.portfolio_id, row.asset_id, row.asset_name)
        label = f"{row.asset_name} ({row.symbol})" if row.symbol else row.asset_name
        metrics[key] = HoldingMetric(
            key=key,
            portfolio_id=row.portfolio_id,
            portfolio_name=row.portfolio_name,
            asset_id=row.asset_id,
            asset_name=label,
            symbol=row.symbol,
            asset_class=row.asset_class,
            evaluated=evaluated,
            cost_basis=cost_basis,
            profit=profit,
            return_pct=Decimal(row.return_pct) if row.return_pct is not None else None,
            quote_source=row.quote_source,
            quote_as_of=row.quote_as_of,
        )
    return metrics


def _load_baseline_liability_metrics(
    db: Session,
    *,
    snapshot: ValuationSnapshot,
    display_currency: str,
    cache: FxCache,
) -> dict[str, LiabilityMetric]:
    rows = db.scalars(
        select(ValuationSnapshotLiabilityRow).where(ValuationSnapshotLiabilityRow.valuation_snapshot_id == snapshot.id)
    ).all()
    metrics: dict[str, LiabilityMetric] = {}
    for row in rows:
        balance = _convert_snapshot_amount(
            db,
            amount=Decimal(row.balance_total),
            from_currency=snapshot.display_currency,
            to_currency=display_currency,
            cache=cache,
        )
        key = _liability_key(row.portfolio_id, row.liability_id, row.liability_name)
        metrics[key] = LiabilityMetric(
            key=key,
            portfolio_id=row.portfolio_id,
            portfolio_name=row.portfolio_name,
            liability_id=row.liability_id,
            liability_name=row.liability_name,
            liability_type=row.liability_type,
            balance=balance,
        )
    return metrics


def _load_baseline_portfolio_metrics(
    db: Session,
    *,
    snapshot: ValuationSnapshot,
    display_currency: str,
    cache: FxCache,
) -> dict[str, PortfolioMetric]:
    rows = db.scalars(
        select(ValuationSnapshotPortfolioRow).where(ValuationSnapshotPortfolioRow.valuation_snapshot_id == snapshot.id)
    ).all()
    metrics: dict[str, PortfolioMetric] = {}
    for row in rows:
        current_value = _convert_snapshot_amount(
            db,
            amount=Decimal(row.gross_assets_total),
            from_currency=snapshot.display_currency,
            to_currency=display_currency,
            cache=cache,
        )
        current_net = _convert_snapshot_amount(
            db,
            amount=Decimal(row.net_assets_total),
            from_currency=snapshot.display_currency,
            to_currency=display_currency,
            cache=cache,
        )
        key = _portfolio_key(row.portfolio_id, row.portfolio_name)
        metrics[key] = PortfolioMetric(
            key=key,
            portfolio_id=row.portfolio_id,
            portfolio_name=row.portfolio_name,
            portfolio_type=row.portfolio_type,
            current_value=current_value,
            current_net=current_net,
        )
    return metrics


def _value_for_currency(krw_value: Decimal, usd_value: Decimal, display_currency: str) -> Decimal:
    return Decimal(usd_value if display_currency == "USD" else krw_value)


def _summary_from_snapshot_set(snapshot: SnapshotSet, display_currency: str) -> SummaryMetric:
    return SummaryMetric(
        gross_assets_total=_value_for_currency(snapshot.gross_assets_krw, snapshot.gross_assets_usd, display_currency),
        liabilities_total=_value_for_currency(snapshot.liabilities_krw, snapshot.liabilities_usd, display_currency),
        net_assets_total=_value_for_currency(snapshot.net_assets_krw, snapshot.net_assets_usd, display_currency),
        as_of=snapshot.as_of,
    )


def _summary_from_snapshot_preview(preview: SnapshotCsvPreviewOut, display_currency: str) -> SummaryMetric:
    summary = preview.summary
    return SummaryMetric(
        gross_assets_total=Decimal(summary.gross_assets_usd if display_currency == "USD" else summary.gross_assets_krw),
        liabilities_total=Decimal(summary.liabilities_usd if display_currency == "USD" else summary.liabilities_krw),
        net_assets_total=Decimal(summary.net_assets_usd if display_currency == "USD" else summary.net_assets_krw),
        as_of=summary.as_of,
    )


def _find_snapshot_set_baseline(
    db: Session,
    *,
    owner_user_id: int,
    reference_as_of: datetime,
    period: QuickInsightPeriod,
) -> SnapshotSet | None:
    baseline_as_of = reference_as_of - timedelta(days=_PERIOD_DAYS[period])
    stmt = (
        select(SnapshotSet)
        .where(
            SnapshotSet.owner_user_id == owner_user_id,
            SnapshotSet.as_of <= baseline_as_of,
        )
        .order_by(SnapshotSet.as_of.desc(), SnapshotSet.id.desc())
        .limit(1)
    )
    return db.scalar(stmt)


def _load_snapshot_holding_metrics(
    db: Session,
    *,
    snapshot: SnapshotSet,
    display_currency: str,
    reference_as_of: datetime | None = None,
) -> tuple[
    dict[str, HoldingMetric],
    int,
    int,
    int,
    list[AnalyticsQuickInsightWarningItemOut],
    list[AnalyticsQuickInsightWarningItemOut],
]:
    rows = db.scalars(select(SnapshotHoldingRow).where(SnapshotHoldingRow.snapshot_id == snapshot.id)).all()
    stale_minutes, _stale_source = get_fx_stale_minutes(db)
    stale_reference = reference_as_of or snapshot.as_of
    stale_cutoff = stale_reference - timedelta(minutes=stale_minutes)
    metrics: dict[str, HoldingMetric] = {}
    stale_quote_count = 0
    manual_quote_count = 0
    missing_quote_count = 0
    manual_quote_items: list[AnalyticsQuickInsightWarningItemOut] = []
    missing_quote_items: list[AnalyticsQuickInsightWarningItemOut] = []

    for row in rows:
        key = _holding_key(row.portfolio_id, row.asset_id, row.asset_name)
        label = f"{row.asset_name} ({row.symbol})" if row.symbol else row.asset_name
        evaluated = _value_for_currency(row.evaluated_krw, row.evaluated_usd, display_currency)
        cost_basis = _value_for_currency(row.cost_basis_krw, row.cost_basis_usd, display_currency)
        profit = _value_for_currency(row.profit_krw, row.profit_usd, display_currency)
        display_class = _resolve_display_class(
            asset_class=row.asset_class,
            symbol=row.symbol,
            label=label,
            entity_type="HOLDING",
        )
        metrics[key] = HoldingMetric(
            key=key,
            portfolio_id=row.portfolio_id,
            portfolio_name=row.portfolio_name,
            asset_id=row.asset_id,
            asset_name=label,
            symbol=row.symbol,
            asset_class=row.asset_class,
            evaluated=evaluated,
            cost_basis=cost_basis,
            profit=profit,
            return_pct=Decimal(row.return_pct) if row.return_pct is not None else None,
            quote_source=row.quote_source,
            quote_as_of=row.quote_as_of,
        )
        if display_class == "CASH":
            continue
        if not row.quote_source:
            missing_quote_count += 1
            missing_quote_items.append(
                _make_warning_item(
                    key=key,
                    label=label,
                    portfolio_name=row.portfolio_name,
                    symbol=row.symbol,
                    asset_class=row.asset_class,
                    display_class=display_class,
                    quote_source=None,
                    quote_as_of=None,
                )
            )
            continue
        if row.quote_as_of is not None and row.quote_as_of < stale_cutoff:
            stale_quote_count += 1
        if (row.quote_source or "").upper() == "MANUAL":
            manual_quote_count += 1
            manual_quote_items.append(
                _make_warning_item(
                    key=key,
                    label=label,
                    portfolio_name=row.portfolio_name,
                    symbol=row.symbol,
                    asset_class=row.asset_class,
                    display_class=display_class,
                    quote_source=row.quote_source,
                    quote_as_of=row.quote_as_of,
                )
            )

    return (
        metrics,
        stale_quote_count,
        manual_quote_count,
        missing_quote_count,
        manual_quote_items,
        missing_quote_items,
    )


def _load_snapshot_liability_metrics(
    db: Session,
    *,
    snapshot: SnapshotSet,
    display_currency: str,
) -> dict[str, LiabilityMetric]:
    rows = db.scalars(select(SnapshotLiabilityRow).where(SnapshotLiabilityRow.snapshot_id == snapshot.id)).all()
    metrics: dict[str, LiabilityMetric] = {}
    for row in rows:
        balance = _value_for_currency(row.balance_krw, row.balance_usd, display_currency)
        key = _liability_key(row.portfolio_id, row.liability_id, row.liability_name)
        metrics[key] = LiabilityMetric(
            key=key,
            portfolio_id=row.portfolio_id,
            portfolio_name=row.portfolio_name,
            liability_id=row.liability_id,
            liability_name=row.liability_name,
            liability_type=row.liability_type,
            balance=balance,
        )
    return metrics


def _load_snapshot_portfolio_metrics(
    db: Session,
    *,
    snapshot: SnapshotSet,
    display_currency: str,
) -> dict[str, PortfolioMetric]:
    rows = db.scalars(select(SnapshotPortfolioRow).where(SnapshotPortfolioRow.snapshot_id == snapshot.id)).all()
    metrics: dict[str, PortfolioMetric] = {}
    for row in rows:
        current_value = _value_for_currency(row.gross_assets_krw, row.gross_assets_usd, display_currency)
        current_net = _value_for_currency(row.net_assets_krw, row.net_assets_usd, display_currency)
        key = _portfolio_key(row.portfolio_id, row.portfolio_name)
        metrics[key] = PortfolioMetric(
            key=key,
            portfolio_id=row.portfolio_id,
            portfolio_name=row.portfolio_name,
            portfolio_type=row.portfolio_type,
            current_value=current_value,
            current_net=current_net,
        )
    return metrics


def _load_preview_holding_metrics(
    db: Session,
    *,
    preview: SnapshotCsvPreviewOut,
    display_currency: str,
) -> tuple[
    dict[str, HoldingMetric],
    int,
    int,
    int,
    list[AnalyticsQuickInsightWarningItemOut],
    list[AnalyticsQuickInsightWarningItemOut],
]:
    stale_minutes, _stale_source = get_fx_stale_minutes(db)
    stale_cutoff = preview.summary.as_of - timedelta(minutes=stale_minutes)
    metrics: dict[str, HoldingMetric] = {}
    stale_quote_count = 0
    manual_quote_count = 0
    missing_quote_count = 0
    manual_quote_items: list[AnalyticsQuickInsightWarningItemOut] = []
    missing_quote_items: list[AnalyticsQuickInsightWarningItemOut] = []

    for row in preview.holding_rows:
        key = _holding_key(row.portfolio_id, row.asset_id, row.asset_name)
        label = f"{row.asset_name} ({row.symbol})" if row.symbol else row.asset_name
        display_class = _resolve_display_class(
            asset_class=row.asset_class,
            symbol=row.symbol,
            label=label,
            entity_type="HOLDING",
        )
        metrics[key] = HoldingMetric(
            key=key,
            portfolio_id=row.portfolio_id,
            portfolio_name=row.portfolio_name,
            asset_id=row.asset_id,
            asset_name=label,
            symbol=row.symbol,
            asset_class=row.asset_class,
            evaluated=Decimal(row.evaluated),
            cost_basis=Decimal(row.cost_basis),
            profit=Decimal(row.profit),
            return_pct=Decimal(row.return_pct) if row.return_pct is not None else None,
            quote_source=row.quote_source,
            quote_as_of=row.quote_as_of,
        )
        if display_class == "CASH":
            continue
        if not row.quote_source:
            missing_quote_count += 1
            missing_quote_items.append(
                _make_warning_item(
                    key=key,
                    label=label,
                    portfolio_name=row.portfolio_name,
                    symbol=row.symbol,
                    asset_class=row.asset_class,
                    display_class=display_class,
                    quote_source=None,
                    quote_as_of=None,
                )
            )
            continue
        if row.quote_as_of is not None and row.quote_as_of < stale_cutoff:
            stale_quote_count += 1
        if (row.quote_source or "").upper() == "MANUAL":
            manual_quote_count += 1
            manual_quote_items.append(
                _make_warning_item(
                    key=key,
                    label=label,
                    portfolio_name=row.portfolio_name,
                    symbol=row.symbol,
                    asset_class=row.asset_class,
                    display_class=display_class,
                    quote_source=row.quote_source,
                    quote_as_of=row.quote_as_of,
                )
            )

    return (
        metrics,
        stale_quote_count,
        manual_quote_count,
        missing_quote_count,
        manual_quote_items,
        missing_quote_items,
    )


def _load_preview_liability_metrics(
    preview: SnapshotCsvPreviewOut,
    *,
    display_currency: str,
) -> dict[str, LiabilityMetric]:
    metrics: dict[str, LiabilityMetric] = {}
    for row in preview.liability_rows:
        key = _liability_key(row.portfolio_id, row.liability_id, row.liability_name)
        metrics[key] = LiabilityMetric(
            key=key,
            portfolio_id=row.portfolio_id,
            portfolio_name=row.portfolio_name,
            liability_id=row.liability_id,
            liability_name=row.liability_name,
            liability_type=row.liability_type,
            balance=Decimal(row.balance),
        )
    return metrics


def _load_preview_portfolio_metrics(
    preview: SnapshotCsvPreviewOut,
    *,
    display_currency: str,
) -> dict[str, PortfolioMetric]:
    metrics: dict[str, PortfolioMetric] = {}
    for row in preview.portfolio_rows:
        key = _portfolio_key(row.portfolio_id, row.portfolio_name)
        metrics[key] = PortfolioMetric(
            key=key,
            portfolio_id=row.portfolio_id,
            portfolio_name=row.portfolio_name,
            portfolio_type=row.portfolio_type,
            current_value=Decimal(row.current),
            current_net=Decimal(row.net_assets),
        )
    return metrics


def _build_quick_insight_response(
    *,
    current_summary: SummaryMetric,
    baseline_label: str | None,
    has_baseline: bool,
    normalized_period: QuickInsightPeriod,
    current_holdings: dict[str, HoldingMetric],
    current_liabilities: dict[str, LiabilityMetric],
    current_portfolios: dict[str, PortfolioMetric],
    baseline_holdings: dict[str, HoldingMetric] | None,
    baseline_liabilities: dict[str, LiabilityMetric] | None,
    baseline_portfolios: dict[str, PortfolioMetric] | None,
    baseline_gross: Decimal | None,
    baseline_liabilities_total: Decimal | None,
    baseline_net: Decimal | None,
    stale_quote_count: int,
    manual_quote_count: int,
    missing_quote_count: int,
    manual_quote_items: list[AnalyticsQuickInsightWarningItemOut],
    missing_quote_items: list[AnalyticsQuickInsightWarningItemOut],
) -> AnalyticsQuickInsightOut:
    if not has_baseline or baseline_holdings is None or baseline_liabilities is None or baseline_portfolios is None or baseline_gross is None or baseline_liabilities_total is None or baseline_net is None:
        return AnalyticsQuickInsightOut(
            period=normalized_period,
            baseline_snapshot_date=None,
            current_as_of=current_summary.as_of,
            has_baseline=False,
            summary_alert=AnalyticsQuickInsightSummaryAlertOut(
                gross_delta=None,
                net_delta=None,
                liabilities_delta=None,
                severity="neutral",
                comment=f"No baseline snapshot data for {normalized_period}.",
            ),
            gross_drivers=AnalyticsQuickInsightDriverGroupOut(top_gainers=[], top_losers=[]),
            net_drivers=AnalyticsQuickInsightDriverGroupOut(top_gainers=[], top_losers=[]),
            profit_movers=AnalyticsQuickInsightRankedGroupOut(top_gainers=[], top_losers=[]),
            return_movers=AnalyticsQuickInsightRankedGroupOut(top_gainers=[], top_losers=[]),
            portfolio_changes=AnalyticsQuickInsightPortfolioChangesOut(
                top_current_value_changes=[],
                top_net_value_changes=[],
            ),
            warnings=AnalyticsQuickInsightWarningsOut(
                missing_snapshot=True,
                stale_quote_count=stale_quote_count,
                manual_quote_count=manual_quote_count,
                missing_quote_count=missing_quote_count,
                manual_quotes=manual_quote_items,
                missing_quotes=missing_quote_items,
            ),
        )

    gross_driver_items: list[AnalyticsQuickInsightDeltaItemOut] = []
    net_driver_items: list[AnalyticsQuickInsightDeltaItemOut] = []
    profit_delta_items: list[AnalyticsQuickInsightDeltaItemOut] = []
    return_delta_items: list[AnalyticsQuickInsightDeltaItemOut] = []
    portfolio_current_value_items: list[AnalyticsQuickInsightDeltaItemOut] = []
    portfolio_net_value_items: list[AnalyticsQuickInsightDeltaItemOut] = []

    holding_keys = sorted(set(current_holdings) | set(baseline_holdings))
    for key in holding_keys:
        current = current_holdings.get(key)
        baseline = baseline_holdings.get(key)
        current_exists = current is not None
        baseline_exists = baseline is not None
        label = current.asset_name if current is not None else baseline.asset_name
        portfolio_name = current.portfolio_name if current is not None else baseline.portfolio_name
        status = _status_for_pair(current_exists, baseline_exists)
        current_evaluated = current.evaluated if current is not None else Decimal("0")
        baseline_evaluated = baseline.evaluated if baseline is not None else Decimal("0")
        current_profit = current.profit if current is not None else Decimal("0")
        baseline_profit = baseline.profit if baseline is not None else Decimal("0")
        current_return = current.return_pct if current is not None else None
        baseline_return = baseline.return_pct if baseline is not None else None
        asset_class = current.asset_class if current is not None else baseline.asset_class
        display_class = _resolve_display_class(
            asset_class=asset_class,
            symbol=current.symbol if current is not None else baseline.symbol,
            label=label,
            entity_type="HOLDING",
        )
        gross_driver_items.append(
            _make_delta_item(
                entity_type="HOLDING",
                key=key,
                label=label,
                portfolio_name=portfolio_name,
                delta_amount=current_evaluated - baseline_evaluated,
                current_value=current_evaluated,
                baseline_value=baseline_evaluated,
                status=status,
                asset_class=asset_class,
                display_class=display_class,
            )
        )
        net_driver_items.append(
            _make_delta_item(
                entity_type="HOLDING",
                key=key,
                label=label,
                portfolio_name=portfolio_name,
                delta_amount=current_evaluated - baseline_evaluated,
                current_value=current_evaluated,
                baseline_value=baseline_evaluated,
                status=status,
                asset_class=asset_class,
                display_class=display_class,
            )
        )
        profit_delta_items.append(
            _make_delta_item(
                entity_type="HOLDING",
                key=key,
                label=label,
                portfolio_name=portfolio_name,
                delta_amount=current_profit - baseline_profit,
                current_value=current_profit,
                baseline_value=baseline_profit,
                status=status,
                asset_class=asset_class,
                display_class=display_class,
            )
        )
        return_delta = None
        if current_return is not None or baseline_return is not None:
            return_delta = Decimal(current_return or 0) - Decimal(baseline_return or 0)
        return_delta_items.append(
            _make_delta_item(
                entity_type="HOLDING",
                key=key,
                label=label,
                portfolio_name=portfolio_name,
                delta_return_pct=return_delta,
                current_value=current_evaluated,
                baseline_value=baseline_evaluated,
                status=status,
                asset_class=asset_class,
                display_class=display_class,
            )
        )

    liability_keys = sorted(set(current_liabilities) | set(baseline_liabilities))
    for key in liability_keys:
        current = current_liabilities.get(key)
        baseline = baseline_liabilities.get(key)
        current_exists = current is not None
        baseline_exists = baseline is not None
        label = current.liability_name if current is not None else baseline.liability_name
        portfolio_name = current.portfolio_name if current is not None else baseline.portfolio_name
        status = _status_for_pair(current_exists, baseline_exists)
        current_balance = current.balance if current is not None else Decimal("0")
        baseline_balance = baseline.balance if baseline is not None else Decimal("0")
        net_driver_items.append(
            _make_delta_item(
                entity_type="LIABILITY",
                key=key,
                label=label,
                portfolio_name=portfolio_name,
                delta_amount=(baseline_balance - current_balance),
                current_value=current_balance,
                baseline_value=baseline_balance,
                status=status,
                asset_class="LIABILITY",
                display_class="LIABILITY",
            )
        )

    portfolio_keys = sorted(set(current_portfolios) | set(baseline_portfolios))
    for key in portfolio_keys:
        current = current_portfolios.get(key)
        baseline = baseline_portfolios.get(key)
        current_exists = current is not None
        baseline_exists = baseline is not None
        label = current.portfolio_name if current is not None else baseline.portfolio_name
        status = _status_for_pair(current_exists, baseline_exists)
        current_value = current.current_value if current is not None else Decimal("0")
        baseline_value = baseline.current_value if baseline is not None else Decimal("0")
        current_net = current.current_net if current is not None else Decimal("0")
        baseline_net_value = baseline.current_net if baseline is not None else Decimal("0")
        portfolio_current_value_items.append(
            _make_delta_item(
                entity_type="PORTFOLIO",
                key=key,
                label=label,
                portfolio_name=label,
                delta_amount=current_value - baseline_value,
                current_value=current_value,
                baseline_value=baseline_value,
                status=status,
            )
        )
        portfolio_net_value_items.append(
            _make_delta_item(
                entity_type="PORTFOLIO",
                key=key,
                label=label,
                portfolio_name=label,
                delta_amount=current_net - baseline_net_value,
                current_value=current_net,
                baseline_value=baseline_net_value,
                status=status,
            )
        )

    gross_gainers = _top_n_positive(gross_driver_items, 3)
    gross_losers = _top_n_negative(gross_driver_items, 3)
    net_gainers = _top_n_positive(net_driver_items, 3)
    net_losers = _top_n_negative(net_driver_items, 3)
    profit_gainers = _top_n_positive(profit_delta_items, 3)
    profit_losers = _top_n_negative(profit_delta_items, 3)
    return_gainers = _top_n_return_positive(return_delta_items, 3)
    return_losers = _top_n_return_negative(return_delta_items, 3)

    gross_delta = current_summary.gross_assets_total - baseline_gross
    net_delta = current_summary.net_assets_total - baseline_net
    liabilities_delta = current_summary.liabilities_total - baseline_liabilities_total
    summary_comment, severity = _build_summary_comment(
        period=normalized_period,
        gross_delta=gross_delta,
        net_delta=net_delta,
        liabilities_delta=liabilities_delta,
        baseline_gross=baseline_gross,
        gross_loser=gross_losers[0] if gross_losers else None,
        gross_gainer=gross_gainers[0] if gross_gainers else None,
        net_drag=net_losers[0] if net_losers else None,
        net_boost=net_gainers[0] if net_gainers else None,
    )

    return AnalyticsQuickInsightOut(
        period=normalized_period,
        baseline_snapshot_date=baseline_label,
        current_as_of=current_summary.as_of,
        has_baseline=True,
        summary_alert=AnalyticsQuickInsightSummaryAlertOut(
            gross_delta=gross_delta,
            net_delta=net_delta,
            liabilities_delta=liabilities_delta,
            severity=severity,
            comment=summary_comment,
        ),
        gross_drivers=AnalyticsQuickInsightDriverGroupOut(top_gainers=gross_gainers, top_losers=gross_losers),
        net_drivers=AnalyticsQuickInsightDriverGroupOut(top_gainers=net_gainers, top_losers=net_losers),
        profit_movers=AnalyticsQuickInsightRankedGroupOut(top_gainers=profit_gainers, top_losers=profit_losers),
        return_movers=AnalyticsQuickInsightRankedGroupOut(top_gainers=return_gainers, top_losers=return_losers),
        portfolio_changes=AnalyticsQuickInsightPortfolioChangesOut(
            top_current_value_changes=_top_n_by_abs(portfolio_current_value_items, 3),
            top_net_value_changes=_top_n_by_abs(portfolio_net_value_items, 3),
        ),
        warnings=AnalyticsQuickInsightWarningsOut(
            missing_snapshot=False,
            stale_quote_count=stale_quote_count,
            manual_quote_count=manual_quote_count,
            missing_quote_count=missing_quote_count,
            manual_quotes=manual_quote_items,
            missing_quotes=missing_quote_items,
        ),
    )


def get_quick_insight(
    db: Session,
    *,
    scope_type: str,
    scope_id: int,
    scope_user_ids: list[int],
    display_currency: str,
    period: str | None,
) -> AnalyticsQuickInsightOut:
    normalized_currency = _normalize_display_currency(display_currency)
    normalized_period = _normalize_period(period)
    cache: FxCache = {}
    current_summary = calculate_summary_values(
        db=db,
        scope_user_ids=scope_user_ids,
        include_hidden=False,
        include_excluded_portfolios=False,
        include_excluded_liabilities=False,
        display_currency=normalized_currency,
        fx_strict_mode=settings.fx_strict_mode,
    )
    current_holdings, stale_quote_count, manual_quote_count, missing_quote_count, manual_quote_items, missing_quote_items = _load_current_holding_metrics(
        db,
        scope_user_ids=scope_user_ids,
        display_currency=normalized_currency,
        cache=cache,
    )
    current_liabilities = _load_current_liability_metrics(
        db,
        scope_user_ids=scope_user_ids,
        display_currency=normalized_currency,
        cache=cache,
    )
    current_portfolios = _load_current_portfolio_metrics(
        db,
        scope_user_ids=scope_user_ids,
        display_currency=normalized_currency,
        cache=cache,
    )

    baseline_date = datetime.now(UTC).date() - timedelta(days=_PERIOD_DAYS[normalized_period])
    baseline_snapshot = _find_baseline_snapshot(
        db,
        scope_type=scope_type,
        scope_id=scope_id,
        target_currency=normalized_currency,
        baseline_date=baseline_date,
    )
    has_baseline = baseline_snapshot is not None
    baseline_holdings = None
    baseline_liabilities = None
    baseline_portfolios = None
    baseline_gross = None
    baseline_liabilities_total = None
    baseline_net = None
    baseline_label = None
    if baseline_snapshot is not None:
        baseline_holdings = _load_baseline_holding_metrics(
            db,
            snapshot=baseline_snapshot,
            display_currency=normalized_currency,
            cache=cache,
        )
        baseline_liabilities = _load_baseline_liability_metrics(
            db,
            snapshot=baseline_snapshot,
            display_currency=normalized_currency,
            cache=cache,
        )
        baseline_portfolios = _load_baseline_portfolio_metrics(
            db,
            snapshot=baseline_snapshot,
            display_currency=normalized_currency,
            cache=cache,
        )
        baseline_gross = _convert_snapshot_amount(
            db,
            amount=Decimal(baseline_snapshot.assets_total),
            from_currency=baseline_snapshot.display_currency,
            to_currency=normalized_currency,
            cache=cache,
        )
        baseline_liabilities_total = _convert_snapshot_amount(
            db,
            amount=Decimal(baseline_snapshot.liabilities_total),
            from_currency=baseline_snapshot.display_currency,
            to_currency=normalized_currency,
            cache=cache,
        )
        baseline_net = _convert_snapshot_amount(
            db,
            amount=Decimal(baseline_snapshot.net_worth_total),
            from_currency=baseline_snapshot.display_currency,
            to_currency=normalized_currency,
            cache=cache,
        )
        baseline_label = baseline_snapshot.snapshot_date.isoformat()

    return _build_quick_insight_response(
        current_summary=SummaryMetric(
            gross_assets_total=current_summary.gross_assets_total,
            liabilities_total=current_summary.liabilities_total,
            net_assets_total=current_summary.net_assets_total,
            as_of=current_summary.as_of,
        ),
        baseline_label=baseline_label,
        has_baseline=has_baseline,
        normalized_period=normalized_period,
        current_holdings=current_holdings,
        current_liabilities=current_liabilities,
        current_portfolios=current_portfolios,
        baseline_holdings=baseline_holdings,
        baseline_liabilities=baseline_liabilities,
        baseline_portfolios=baseline_portfolios,
        baseline_gross=baseline_gross,
        baseline_liabilities_total=baseline_liabilities_total,
        baseline_net=baseline_net,
        stale_quote_count=stale_quote_count,
        manual_quote_count=manual_quote_count,
        missing_quote_count=missing_quote_count,
        manual_quote_items=manual_quote_items,
        missing_quote_items=missing_quote_items,
    )


def get_snapshot_quick_insight(
    db: Session,
    *,
    snapshot: SnapshotSet,
    display_currency: str,
    period: str | None,
) -> AnalyticsQuickInsightOut:
    normalized_currency = _normalize_display_currency(display_currency)
    normalized_period = _normalize_period(period)
    current_summary = _summary_from_snapshot_set(snapshot, normalized_currency)
    (
        current_holdings,
        stale_quote_count,
        manual_quote_count,
        missing_quote_count,
        manual_quote_items,
        missing_quote_items,
    ) = _load_snapshot_holding_metrics(
        db,
        snapshot=snapshot,
        display_currency=normalized_currency,
    )
    current_liabilities = _load_snapshot_liability_metrics(
        db,
        snapshot=snapshot,
        display_currency=normalized_currency,
    )
    current_portfolios = _load_snapshot_portfolio_metrics(
        db,
        snapshot=snapshot,
        display_currency=normalized_currency,
    )
    baseline_snapshot = _find_snapshot_set_baseline(
        db,
        owner_user_id=snapshot.owner_user_id,
        reference_as_of=snapshot.as_of,
        period=normalized_period,
    )
    has_baseline = baseline_snapshot is not None
    baseline_holdings = None
    baseline_liabilities = None
    baseline_portfolios = None
    baseline_summary = None
    baseline_label = None
    if baseline_snapshot is not None:
        baseline_summary = _summary_from_snapshot_set(baseline_snapshot, normalized_currency)
        baseline_holdings, _, _, _, _, _ = _load_snapshot_holding_metrics(
            db,
            snapshot=baseline_snapshot,
            display_currency=normalized_currency,
            reference_as_of=baseline_snapshot.as_of,
        )
        baseline_liabilities = _load_snapshot_liability_metrics(
            db,
            snapshot=baseline_snapshot,
            display_currency=normalized_currency,
        )
        baseline_portfolios = _load_snapshot_portfolio_metrics(
            db,
            snapshot=baseline_snapshot,
            display_currency=normalized_currency,
        )
        baseline_label = baseline_snapshot.as_of.isoformat()

    return _build_quick_insight_response(
        current_summary=current_summary,
        baseline_label=baseline_label,
        has_baseline=has_baseline,
        normalized_period=normalized_period,
        current_holdings=current_holdings,
        current_liabilities=current_liabilities,
        current_portfolios=current_portfolios,
        baseline_holdings=baseline_holdings,
        baseline_liabilities=baseline_liabilities,
        baseline_portfolios=baseline_portfolios,
        baseline_gross=baseline_summary.gross_assets_total if baseline_summary is not None else None,
        baseline_liabilities_total=baseline_summary.liabilities_total if baseline_summary is not None else None,
        baseline_net=baseline_summary.net_assets_total if baseline_summary is not None else None,
        stale_quote_count=stale_quote_count,
        manual_quote_count=manual_quote_count,
        missing_quote_count=missing_quote_count,
        manual_quote_items=manual_quote_items,
        missing_quote_items=missing_quote_items,
    )


def get_preview_quick_insight(
    db: Session,
    *,
    owner_user_id: int,
    preview: SnapshotCsvPreviewOut,
    display_currency: str,
    period: str | None,
) -> AnalyticsQuickInsightOut:
    normalized_currency = _normalize_display_currency(display_currency)
    normalized_period = _normalize_period(period)
    current_summary = _summary_from_snapshot_preview(preview, normalized_currency)
    (
        current_holdings,
        stale_quote_count,
        manual_quote_count,
        missing_quote_count,
        manual_quote_items,
        missing_quote_items,
    ) = _load_preview_holding_metrics(
        db,
        preview=preview,
        display_currency=normalized_currency,
    )
    current_liabilities = _load_preview_liability_metrics(preview, display_currency=normalized_currency)
    current_portfolios = _load_preview_portfolio_metrics(preview, display_currency=normalized_currency)
    baseline_snapshot = _find_snapshot_set_baseline(
        db,
        owner_user_id=owner_user_id,
        reference_as_of=preview.summary.as_of,
        period=normalized_period,
    )
    has_baseline = baseline_snapshot is not None
    baseline_holdings = None
    baseline_liabilities = None
    baseline_portfolios = None
    baseline_summary = None
    baseline_label = None
    if baseline_snapshot is not None:
        baseline_summary = _summary_from_snapshot_set(baseline_snapshot, normalized_currency)
        baseline_holdings, _, _, _, _, _ = _load_snapshot_holding_metrics(
            db,
            snapshot=baseline_snapshot,
            display_currency=normalized_currency,
            reference_as_of=baseline_snapshot.as_of,
        )
        baseline_liabilities = _load_snapshot_liability_metrics(
            db,
            snapshot=baseline_snapshot,
            display_currency=normalized_currency,
        )
        baseline_portfolios = _load_snapshot_portfolio_metrics(
            db,
            snapshot=baseline_snapshot,
            display_currency=normalized_currency,
        )
        baseline_label = baseline_snapshot.as_of.isoformat()

    return _build_quick_insight_response(
        current_summary=current_summary,
        baseline_label=baseline_label,
        has_baseline=has_baseline,
        normalized_period=normalized_period,
        current_holdings=current_holdings,
        current_liabilities=current_liabilities,
        current_portfolios=current_portfolios,
        baseline_holdings=baseline_holdings,
        baseline_liabilities=baseline_liabilities,
        baseline_portfolios=baseline_portfolios,
        baseline_gross=baseline_summary.gross_assets_total if baseline_summary is not None else None,
        baseline_liabilities_total=baseline_summary.liabilities_total if baseline_summary is not None else None,
        baseline_net=baseline_summary.net_assets_total if baseline_summary is not None else None,
        stale_quote_count=stale_quote_count,
        manual_quote_count=manual_quote_count,
        missing_quote_count=missing_quote_count,
        manual_quote_items=manual_quote_items,
        missing_quote_items=missing_quote_items,
    )
