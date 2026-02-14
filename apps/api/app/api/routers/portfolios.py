from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.db import get_db
from app.models.portfolio import Portfolio
from app.schemas.portfolio import PortfolioCreate, PortfolioOut, PortfolioUpdate
from app.services.user_seed import SeedUser

router = APIRouter(prefix="/portfolios", tags=["portfolios"])


@router.get("", response_model=list[PortfolioOut])
def list_portfolios(
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> list[Portfolio]:
    stmt = select(Portfolio).where(Portfolio.owner_user_id == current_user.id).order_by(Portfolio.id.desc())
    return list(db.scalars(stmt).all())


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
