from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import case, func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.db import get_db
from app.models.holding import Holding
from app.models.liability import Liability
from app.models.latest_quote import LatestQuote
from app.models.portfolio import Portfolio
from app.schemas.performance import PortfolioPerformanceOut
from app.schemas.asset import SortOrder
from app.schemas.portfolio import (
    PortfolioCreate,
    PortfolioOut,
    PortfolioTablePageOut,
    PortfolioTableRowOut,
    PortfolioTableSortBy,
    PortfolioUpdate,
)
from app.services.user_seed import SeedUser

router = APIRouter(prefix="/portfolios", tags=["portfolios"])


def _latest_quote_map(db: Session, asset_ids: list[int]) -> dict[int, LatestQuote]:
    if not asset_ids:
        return {}

    rows = db.scalars(select(LatestQuote).where(LatestQuote.asset_id.in_(asset_ids))).all()
    return {row.asset_id: row for row in rows}


@router.get("", response_model=list[PortfolioOut])
def list_portfolios(
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> list[Portfolio]:
    stmt = select(Portfolio).where(Portfolio.owner_user_id == current_user.id).order_by(Portfolio.id.desc())
    return list(db.scalars(stmt).all())


@router.get("/table", response_model=PortfolioTablePageOut)
def list_portfolios_table(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=200),
    sort_by: PortfolioTableSortBy = Query(default=PortfolioTableSortBy.UPDATED_AT),
    sort_order: SortOrder = Query(default=SortOrder.DESC),
    q: str | None = Query(default=None, min_length=1, max_length=100),
    include_hidden: bool = True,
    include_excluded: bool = True,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> PortfolioTablePageOut:
    query_text = q.strip() if q else None
    holding_count_expr = (
        select(func.count())
        .select_from(Holding)
        .where(
            Holding.owner_user_id == Portfolio.owner_user_id,
            Holding.portfolio_id == Portfolio.id,
            Holding.is_hidden.is_(False),
        )
        .scalar_subquery()
    )
    gross_assets_total_expr = (
        select(func.coalesce(func.sum(Holding.quantity * func.coalesce(LatestQuote.price, Holding.avg_price)), 0))
        .select_from(Holding)
        .outerjoin(LatestQuote, LatestQuote.asset_id == Holding.asset_id)
        .where(
            Holding.owner_user_id == Portfolio.owner_user_id,
            Holding.portfolio_id == Portfolio.id,
            Holding.is_hidden.is_(False),
        )
        .scalar_subquery()
    )
    liability_count_expr = (
        select(func.count())
        .select_from(Liability)
        .where(
            Liability.owner_user_id == Portfolio.owner_user_id,
            Liability.portfolio_id == Portfolio.id,
            Liability.is_hidden.is_(False),
            Liability.is_included.is_(True),
        )
        .scalar_subquery()
    )
    liabilities_total_expr = (
        select(func.coalesce(func.sum(Liability.outstanding_balance), 0))
        .select_from(Liability)
        .where(
            Liability.owner_user_id == Portfolio.owner_user_id,
            Liability.portfolio_id == Portfolio.id,
            Liability.is_hidden.is_(False),
            Liability.is_included.is_(True),
        )
        .scalar_subquery()
    )
    net_assets_total_expr = gross_assets_total_expr - liabilities_total_expr
    principal_minus_debt_total_expr = Portfolio.cumulative_deposit_amount - liabilities_total_expr
    net_assets_profit_total_expr = net_assets_total_expr - principal_minus_debt_total_expr
    net_assets_return_pct_expr = case(
        (principal_minus_debt_total_expr == 0, None),
        else_=(net_assets_profit_total_expr / func.nullif(principal_minus_debt_total_expr, 0)) * 100,
    )
    total_pnl_amount_expr = (
        gross_assets_total_expr + Portfolio.cumulative_withdrawal_amount - Portfolio.cumulative_deposit_amount
    )
    total_return_pct_expr = case(
        (Portfolio.cumulative_deposit_amount == 0, None),
        else_=(total_pnl_amount_expr / func.nullif(Portfolio.cumulative_deposit_amount, 0)) * 100,
    )

    filters = [Portfolio.owner_user_id == current_user.id]
    if not include_hidden:
        filters.append(Portfolio.is_hidden.is_(False))
    if not include_excluded:
        filters.append(Portfolio.is_included.is_(True))
    if query_text:
        like = f"%{query_text}%"
        filters.append(
            or_(
                Portfolio.name.ilike(like),
                Portfolio.type.ilike(like),
                Portfolio.category.ilike(like),
                Portfolio.exchange_code.ilike(like),
                Portfolio.memo.ilike(like),
                Portfolio.base_currency.ilike(like),
            )
        )

    count_stmt = select(func.count()).select_from(Portfolio).where(*filters)
    total = int(db.scalar(count_stmt) or 0)

    sort_column_map = {
        PortfolioTableSortBy.ID: Portfolio.id,
        PortfolioTableSortBy.NAME: Portfolio.name,
        PortfolioTableSortBy.TYPE: Portfolio.type,
        PortfolioTableSortBy.BASE_CURRENCY: Portfolio.base_currency,
        PortfolioTableSortBy.EXCHANGE_CODE: Portfolio.exchange_code,
        PortfolioTableSortBy.CATEGORY: Portfolio.category,
        PortfolioTableSortBy.IS_INCLUDED: Portfolio.is_included,
        PortfolioTableSortBy.IS_HIDDEN: Portfolio.is_hidden,
        PortfolioTableSortBy.DEPOSIT: Portfolio.cumulative_deposit_amount,
        PortfolioTableSortBy.WITHDRAWAL: Portfolio.cumulative_withdrawal_amount,
        PortfolioTableSortBy.GROSS_ASSETS_TOTAL: gross_assets_total_expr,
        PortfolioTableSortBy.LIABILITIES_TOTAL: liabilities_total_expr,
        PortfolioTableSortBy.NET_ASSETS_TOTAL: net_assets_total_expr,
        PortfolioTableSortBy.PRINCIPAL_MINUS_DEBT_TOTAL: principal_minus_debt_total_expr,
        PortfolioTableSortBy.NET_ASSETS_PROFIT_TOTAL: net_assets_profit_total_expr,
        PortfolioTableSortBy.NET_ASSETS_RETURN_PCT: net_assets_return_pct_expr,
        PortfolioTableSortBy.TOTAL_PNL_AMOUNT: total_pnl_amount_expr,
        PortfolioTableSortBy.TOTAL_RETURN_PCT: total_return_pct_expr,
        PortfolioTableSortBy.CASHFLOW_SOURCE_TYPE: Portfolio.cashflow_source_type,
        PortfolioTableSortBy.UPDATED_AT: Portfolio.updated_at,
        PortfolioTableSortBy.HOLDING_COUNT: holding_count_expr,
        PortfolioTableSortBy.LIABILITY_COUNT: liability_count_expr,
    }
    sort_column = sort_column_map[sort_by]
    order_expr = sort_column.asc() if sort_order == SortOrder.ASC else sort_column.desc()

    stmt = (
        select(
            Portfolio,
            holding_count_expr.label("holding_count"),
            liability_count_expr.label("liability_count"),
            gross_assets_total_expr.label("gross_assets_total"),
            liabilities_total_expr.label("liabilities_total"),
            net_assets_total_expr.label("net_assets_total"),
            principal_minus_debt_total_expr.label("principal_minus_debt_total"),
            net_assets_profit_total_expr.label("net_assets_profit_total"),
            net_assets_return_pct_expr.label("net_assets_return_pct"),
            total_pnl_amount_expr.label("total_pnl_amount"),
            total_return_pct_expr.label("total_return_pct"),
        )
        .where(*filters)
        .order_by(order_expr, Portfolio.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    rows = db.execute(stmt).all()

    items = [
        PortfolioTableRowOut(
            id=portfolio.id,
            owner_user_id=portfolio.owner_user_id,
            name=portfolio.name,
            type=portfolio.type,
            base_currency=portfolio.base_currency,
            exchange_code=portfolio.exchange_code,
            category=portfolio.category,
            memo=portfolio.memo,
            is_included=portfolio.is_included,
            is_hidden=portfolio.is_hidden,
            cumulative_deposit_amount=portfolio.cumulative_deposit_amount,
            cumulative_withdrawal_amount=portfolio.cumulative_withdrawal_amount,
            cashflow_source_type=portfolio.cashflow_source_type,
            created_at=portfolio.created_at,
            updated_at=portfolio.updated_at,
            holding_count=int(holding_count or 0),
            liability_count=int(liability_count or 0),
            gross_assets_total=gross_assets_total,
            liabilities_total=liabilities_total,
            net_assets_total=net_assets_total,
            principal_minus_debt_total=principal_minus_debt_total,
            net_assets_profit_total=net_assets_profit_total,
            net_assets_return_pct=net_assets_return_pct,
            total_pnl_amount=total_pnl_amount,
            total_return_pct=total_return_pct,
        )
        for (
            portfolio,
            holding_count,
            liability_count,
            gross_assets_total,
            liabilities_total,
            net_assets_total,
            principal_minus_debt_total,
            net_assets_profit_total,
            net_assets_return_pct,
            total_pnl_amount,
            total_return_pct,
        ) in rows
    ]

    return PortfolioTablePageOut(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order,
        q=query_text,
    )


@router.get("/performance", response_model=list[PortfolioPerformanceOut])
def list_portfolios_performance(
    include_hidden: bool = Query(default=False),
    include_excluded: bool = Query(default=False),
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> list[PortfolioPerformanceOut]:
    portfolio_stmt = select(Portfolio).where(Portfolio.owner_user_id == current_user.id)
    if not include_hidden:
        portfolio_stmt = portfolio_stmt.where(Portfolio.is_hidden.is_(False))
    if not include_excluded:
        portfolio_stmt = portfolio_stmt.where(Portfolio.is_included.is_(True))

    portfolios = list(db.scalars(portfolio_stmt.order_by(Portfolio.id.desc())).all())
    if not portfolios:
        return []

    portfolio_ids = [p.id for p in portfolios]
    holdings_stmt = select(Holding).where(
        Holding.owner_user_id == current_user.id,
        Holding.portfolio_id.in_(portfolio_ids),
    )
    if not include_hidden:
        holdings_stmt = holdings_stmt.where(Holding.is_hidden.is_(False))

    holdings = list(db.scalars(holdings_stmt).all())
    quote_map = _latest_quote_map(db, sorted({item.asset_id for item in holdings}))

    holdings_by_portfolio: dict[int, list[Holding]] = {p.id: [] for p in portfolios}
    for holding in holdings:
        if holding.portfolio_id is None:
            continue
        holdings_by_portfolio.setdefault(holding.portfolio_id, []).append(holding)

    result: list[PortfolioPerformanceOut] = []
    for portfolio in portfolios:
        nav_amount = Decimal("0")
        missing_quote_count = 0
        latest_quote_as_of = None

        rows = holdings_by_portfolio.get(portfolio.id, [])
        for holding in rows:
            quote = quote_map.get(holding.asset_id)
            if quote is None:
                missing_quote_count += 1
                unit_price = holding.avg_price
            else:
                unit_price = quote.price
                if latest_quote_as_of is None or quote.as_of > latest_quote_as_of:
                    latest_quote_as_of = quote.as_of

            nav_amount += holding.quantity * unit_price

        total_pnl_amount = nav_amount + portfolio.cumulative_withdrawal_amount - portfolio.cumulative_deposit_amount
        total_return_pct = None
        if portfolio.cumulative_deposit_amount != 0:
            total_return_pct = (total_pnl_amount / portfolio.cumulative_deposit_amount) * Decimal("100")

        result.append(
            PortfolioPerformanceOut(
                portfolio_id=portfolio.id,
                name=portfolio.name,
                type=portfolio.type,
                base_currency=portfolio.base_currency,
                category=portfolio.category,
                memo=portfolio.memo,
                is_included=portfolio.is_included,
                is_hidden=portfolio.is_hidden,
                cashflow_source_type=portfolio.cashflow_source_type,
                cumulative_deposit_amount=portfolio.cumulative_deposit_amount,
                cumulative_withdrawal_amount=portfolio.cumulative_withdrawal_amount,
                nav_amount=nav_amount,
                total_pnl_amount=total_pnl_amount,
                total_return_pct=total_return_pct,
                holding_count=len(rows),
                missing_quote_count=missing_quote_count,
                latest_quote_as_of=latest_quote_as_of,
            )
        )

    return result


@router.post("", response_model=PortfolioOut, status_code=status.HTTP_201_CREATED)
def create_portfolio(
    payload: PortfolioCreate,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Portfolio:
    portfolio_data = payload.model_dump()
    portfolio_data["base_currency"] = portfolio_data["base_currency"].upper()
    if portfolio_data.get("exchange_code"):
        portfolio_data["exchange_code"] = portfolio_data["exchange_code"].upper()

    portfolio = Portfolio(owner_user_id=current_user.id, **portfolio_data)
    db.add(portfolio)
    db.commit()
    db.refresh(portfolio)
    return portfolio


@router.patch("/{portfolio_id}", response_model=PortfolioOut)
def update_portfolio(
    portfolio_id: int,
    payload: PortfolioUpdate,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Portfolio:
    portfolio = db.scalar(select(Portfolio).where(Portfolio.id == portfolio_id, Portfolio.owner_user_id == current_user.id))
    if portfolio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found")

    updates = payload.model_dump(exclude_unset=True)
    if "base_currency" in updates and updates["base_currency"] is not None:
        updates["base_currency"] = updates["base_currency"].upper()
    if "exchange_code" in updates and updates["exchange_code"] is not None:
        updates["exchange_code"] = updates["exchange_code"].upper()

    for key, value in updates.items():
        setattr(portfolio, key, value)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid portfolio payload") from exc

    db.refresh(portfolio)
    return portfolio


@router.delete("/{portfolio_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_portfolio(
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Response:
    portfolio = db.scalar(select(Portfolio).where(Portfolio.id == portfolio_id, Portfolio.owner_user_id == current_user.id))
    if portfolio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found")

    db.delete(portfolio)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Portfolio is referenced by other records",
        ) from exc
    return Response(status_code=status.HTTP_204_NO_CONTENT)

