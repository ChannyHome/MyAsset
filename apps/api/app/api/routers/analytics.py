from datetime import UTC, datetime
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.db import get_db
from app.models.household import HouseholdMember
from app.models.holding import Holding
from app.models.latest_quote import LatestQuote
from app.models.liability import Liability
from app.models.portfolio import Portfolio
from app.schemas.analytics import AnalyticsSummaryV2Out
from app.services.user_seed import SeedUser

router = APIRouter(prefix="/analytics", tags=["analytics"])


def _resolve_scope_user_ids(
    db: Session,
    current_user: SeedUser,
    scope_type: str | None,
    scope_id: int | None,
) -> tuple[str, int, list[int]]:
    if scope_type is None:
        return "USER", current_user.id, [current_user.id]

    normalized_scope_type = scope_type.upper()
    if normalized_scope_type == "USER":
        target_user_id = scope_id or current_user.id
        if target_user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Only your own USER scope is allowed")
        return "USER", target_user_id, [target_user_id]

    if normalized_scope_type in {"HOUSEHOLD", "GROUP"}:
        if scope_id is None:
            raise HTTPException(status_code=400, detail="scope_id is required for HOUSEHOLD scope")

        is_member = db.scalar(
            select(HouseholdMember).where(
                HouseholdMember.household_id == scope_id,
                HouseholdMember.user_id == current_user.id,
            )
        )
        if is_member is None:
            raise HTTPException(status_code=403, detail="You are not a member of this household")

        member_rows = db.scalars(select(HouseholdMember.user_id).where(HouseholdMember.household_id == scope_id)).all()
        return "HOUSEHOLD", scope_id, list(member_rows)

    raise HTTPException(status_code=400, detail="scope_type must be USER or HOUSEHOLD")


def _latest_quote_map(db: Session, asset_ids: list[int]) -> dict[int, LatestQuote]:
    if not asset_ids:
        return {}
    rows = db.scalars(select(LatestQuote).where(LatestQuote.asset_id.in_(asset_ids))).all()
    return {item.asset_id: item for item in rows}


def _calculate_summary_values(
    db: Session,
    scope_user_ids: list[int],
    include_hidden: bool,
    include_excluded_portfolios: bool,
    include_excluded_liabilities: bool,
) -> tuple[
    Decimal,
    Decimal,
    Decimal,
    Decimal,
    Decimal,
    Decimal,
    Decimal | None,
    Decimal,
    Decimal,
    Decimal | None,
    datetime,
]:
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
        else:
            unit_price = quote.price
            if latest_quote_as_of is None or quote.as_of > latest_quote_as_of:
                latest_quote_as_of = quote.as_of

        gross_assets_total += holding.quantity * unit_price

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
    liabilities_total = sum((item.outstanding_balance for item in liabilities), Decimal("0"))

    portfolios_stmt = select(Portfolio).where(Portfolio.owner_user_id.in_(scope_user_ids))
    if not include_hidden:
        portfolios_stmt = portfolios_stmt.where(Portfolio.is_hidden.is_(False))
    if not include_excluded_portfolios:
        portfolios_stmt = portfolios_stmt.where(Portfolio.is_included.is_(True))

    portfolios = list(db.scalars(portfolios_stmt).all())
    invested_principal_total = sum((item.cumulative_deposit_amount for item in portfolios), Decimal("0"))
    withdrawn_total = sum((item.cumulative_withdrawal_amount for item in portfolios), Decimal("0"))

    # Canonical accounting definition:
    # gross_assets_total: assets only
    # net_assets_total: assets - liabilities
    net_assets_total = gross_assets_total - liabilities_total

    principal_profit_total = gross_assets_total + withdrawn_total - invested_principal_total
    principal_return_pct = None
    if invested_principal_total != 0:
        principal_return_pct = (principal_profit_total / invested_principal_total) * Decimal("100")

    principal_minus_debt_total = invested_principal_total - liabilities_total
    net_assets_profit_total = net_assets_total - principal_minus_debt_total
    net_assets_return_pct = None
    if principal_minus_debt_total != 0:
        net_assets_return_pct = (net_assets_profit_total / principal_minus_debt_total) * Decimal("100")

    as_of = latest_quote_as_of or datetime.now(UTC).replace(tzinfo=None)

    return (
        gross_assets_total,
        liabilities_total,
        net_assets_total,
        invested_principal_total,
        withdrawn_total,
        principal_profit_total,
        principal_return_pct,
        principal_minus_debt_total,
        net_assets_profit_total,
        net_assets_return_pct,
        as_of,
    )


@router.get("/summary", response_model=AnalyticsSummaryV2Out)
def get_summary(
    scope_type: str | None = None,
    scope_id: int | None = None,
    include_hidden: bool = False,
    include_excluded_portfolios: bool = False,
    include_excluded_liabilities: bool = False,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> AnalyticsSummaryV2Out:
    normalized_scope_type, normalized_scope_id, scope_user_ids = _resolve_scope_user_ids(
        db=db,
        current_user=current_user,
        scope_type=scope_type,
        scope_id=scope_id,
    )

    (
        gross_assets_total,
        liabilities_total,
        net_assets_total,
        invested_principal_total,
        withdrawn_total,
        principal_profit_total,
        principal_return_pct,
        principal_minus_debt_total,
        net_assets_profit_total,
        net_assets_return_pct,
        as_of,
    ) = _calculate_summary_values(
        db=db,
        scope_user_ids=scope_user_ids,
        include_hidden=include_hidden,
        include_excluded_portfolios=include_excluded_portfolios,
        include_excluded_liabilities=include_excluded_liabilities,
    )

    return AnalyticsSummaryV2Out(
        scope_type=normalized_scope_type,
        scope_id=normalized_scope_id,
        user_count=len(scope_user_ids),
        display_currency="KRW",
        gross_assets_total=gross_assets_total,
        liabilities_total=liabilities_total,
        net_assets_total=net_assets_total,
        principal_minus_debt_total=principal_minus_debt_total,
        net_assets_profit_total=net_assets_profit_total,
        net_assets_return_pct=net_assets_return_pct,
        invested_principal_total=invested_principal_total,
        withdrawn_total=withdrawn_total,
        principal_profit_total=principal_profit_total,
        principal_return_pct=principal_return_pct,
        as_of=as_of,
    )
