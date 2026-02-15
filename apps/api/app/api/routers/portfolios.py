from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.db import get_db
from app.models.holding import Holding
from app.models.latest_quote import LatestQuote
from app.models.portfolio import Portfolio
from app.schemas.performance import PortfolioPerformanceOut
from app.schemas.portfolio import PortfolioCreate, PortfolioOut, PortfolioUpdate
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
    portfolio = Portfolio(owner_user_id=current_user.id, **payload.model_dump())
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

