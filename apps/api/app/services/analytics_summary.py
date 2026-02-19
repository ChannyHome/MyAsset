from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime
from decimal import Decimal

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.holding import Holding
from app.models.latest_quote import LatestQuote
from app.models.liability import Liability
from app.models.portfolio import Portfolio
from app.services.currency import FxCache, convert_amount


@dataclass
class SummaryValues:
    gross_assets_total: Decimal
    liabilities_total: Decimal
    net_assets_total: Decimal
    invested_principal_total: Decimal
    withdrawn_total: Decimal
    net_contribution_total: Decimal
    principal_profit_total: Decimal
    principal_return_pct: Decimal | None
    principal_minus_debt_total: Decimal
    net_assets_profit_total: Decimal
    net_assets_return_pct: Decimal | None
    as_of: datetime


def _latest_quote_map(db: Session, asset_ids: list[int]) -> dict[int, LatestQuote]:
    if not asset_ids:
        return {}
    rows = db.scalars(select(LatestQuote).where(LatestQuote.asset_id.in_(asset_ids))).all()
    return {item.asset_id: item for item in rows}


def calculate_summary_values(
    db: Session,
    scope_user_ids: list[int],
    include_hidden: bool,
    include_excluded_portfolios: bool,
    include_excluded_liabilities: bool,
    display_currency: str = "KRW",
    fx_strict_mode: bool = False,
) -> SummaryValues:
    target_currency = (display_currency or "KRW").upper()
    fx_cache: FxCache = {}

    holdings_stmt = (
        select(Holding)
        .outerjoin(Portfolio, Holding.portfolio_id == Portfolio.id)
        .where(Holding.owner_user_id.in_(scope_user_ids))
    )
    if not include_hidden:
        holdings_stmt = holdings_stmt.where(Holding.is_hidden.is_(False))
        holdings_stmt = holdings_stmt.where(or_(Holding.portfolio_id.is_(None), Portfolio.is_hidden.is_(False)))
    if not include_excluded_portfolios:
        holdings_stmt = holdings_stmt.where(or_(Holding.portfolio_id.is_(None), Portfolio.is_included.is_(True)))

    holdings = list(db.scalars(holdings_stmt).all())
    quote_map = _latest_quote_map(db, sorted({item.asset_id for item in holdings}))

    gross_assets_total = Decimal("0")
    latest_quote_as_of = None
    for holding in holdings:
        quote = quote_map.get(holding.asset_id)
        if quote is None:
            unit_price = holding.avg_price
            valuation_currency = holding.avg_price_currency
        else:
            unit_price = quote.price
            valuation_currency = quote.currency or holding.avg_price_currency
            if latest_quote_as_of is None or quote.as_of > latest_quote_as_of:
                latest_quote_as_of = quote.as_of

        holding_value = holding.quantity * unit_price
        gross_assets_total += convert_amount(
            db=db,
            amount=holding_value,
            from_currency=valuation_currency,
            to_currency=target_currency,
            cache=fx_cache,
            strict=fx_strict_mode,
        )

    liabilities_stmt = (
        select(Liability)
        .outerjoin(Portfolio, Liability.portfolio_id == Portfolio.id)
        .where(Liability.owner_user_id.in_(scope_user_ids))
    )
    if not include_hidden:
        liabilities_stmt = liabilities_stmt.where(Liability.is_hidden.is_(False))
        liabilities_stmt = liabilities_stmt.where(or_(Liability.portfolio_id.is_(None), Portfolio.is_hidden.is_(False)))
    if not include_excluded_portfolios:
        liabilities_stmt = liabilities_stmt.where(or_(Liability.portfolio_id.is_(None), Portfolio.is_included.is_(True)))
    if not include_excluded_liabilities:
        liabilities_stmt = liabilities_stmt.where(Liability.is_included.is_(True))

    liabilities = list(db.scalars(liabilities_stmt).all())
    liabilities_total = Decimal("0")
    for item in liabilities:
        liabilities_total += convert_amount(
            db=db,
            amount=item.outstanding_balance,
            from_currency=item.currency,
            to_currency=target_currency,
            cache=fx_cache,
            strict=fx_strict_mode,
        )

    portfolios_stmt = select(Portfolio).where(Portfolio.owner_user_id.in_(scope_user_ids))
    if not include_hidden:
        portfolios_stmt = portfolios_stmt.where(Portfolio.is_hidden.is_(False))
    if not include_excluded_portfolios:
        portfolios_stmt = portfolios_stmt.where(Portfolio.is_included.is_(True))

    portfolios = list(db.scalars(portfolios_stmt).all())
    invested_principal_total = Decimal("0")
    withdrawn_total = Decimal("0")
    for item in portfolios:
        invested_principal_total += convert_amount(
            db=db,
            amount=item.cumulative_deposit_amount,
            from_currency=item.base_currency,
            to_currency=target_currency,
            cache=fx_cache,
            strict=fx_strict_mode,
        )
        withdrawn_total += convert_amount(
            db=db,
            amount=item.cumulative_withdrawal_amount,
            from_currency=item.base_currency,
            to_currency=target_currency,
            cache=fx_cache,
            strict=fx_strict_mode,
        )

    net_assets_total = gross_assets_total - liabilities_total

    principal_profit_total = gross_assets_total + withdrawn_total - invested_principal_total
    principal_return_pct = None
    if invested_principal_total != 0:
        principal_return_pct = (principal_profit_total / invested_principal_total) * Decimal("100")

    net_contribution_total = invested_principal_total - withdrawn_total
    principal_minus_debt_total = invested_principal_total - liabilities_total
    net_assets_profit_total = net_assets_total - principal_minus_debt_total
    net_assets_return_pct = None
    if principal_minus_debt_total != 0:
        net_assets_return_pct = (net_assets_profit_total / principal_minus_debt_total) * Decimal("100")

    as_of = latest_quote_as_of or datetime.now(UTC).replace(tzinfo=None)

    return SummaryValues(
        gross_assets_total=gross_assets_total,
        liabilities_total=liabilities_total,
        net_assets_total=net_assets_total,
        invested_principal_total=invested_principal_total,
        withdrawn_total=withdrawn_total,
        net_contribution_total=net_contribution_total,
        principal_profit_total=principal_profit_total,
        principal_return_pct=principal_return_pct,
        principal_minus_debt_total=principal_minus_debt_total,
        net_assets_profit_total=net_assets_profit_total,
        net_assets_return_pct=net_assets_return_pct,
        as_of=as_of,
    )
