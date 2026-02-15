from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.db import get_db
from app.models.liability import Liability
from app.models.portfolio import Portfolio
from app.schemas.liability import LiabilityCreate, LiabilityHiddenUpdate, LiabilityOut, LiabilityUpdate
from app.services.user_seed import SeedUser

router = APIRouter(prefix="/liabilities", tags=["liabilities"])


def _validate_portfolio(db: Session, owner_user_id: int, portfolio_id: int | None) -> None:
    if portfolio_id is None:
        return

    portfolio = db.scalar(select(Portfolio).where(Portfolio.id == portfolio_id, Portfolio.owner_user_id == owner_user_id))
    if portfolio is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Portfolio does not exist")


def _get_owned_liability(db: Session, liability_id: int, owner_user_id: int) -> Liability:
    liability = db.scalar(select(Liability).where(Liability.id == liability_id, Liability.owner_user_id == owner_user_id))
    if liability is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Liability not found")
    return liability


@router.get("", response_model=list[LiabilityOut])
def list_liabilities(
    include_hidden: bool = False,
    include_excluded: bool = False,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> list[Liability]:
    stmt = select(Liability).where(Liability.owner_user_id == current_user.id)

    if not include_hidden:
        stmt = stmt.where(Liability.is_hidden.is_(False))

    if not include_excluded:
        stmt = stmt.where(Liability.is_included.is_(True))

    stmt = stmt.order_by(Liability.id.desc())
    return list(db.scalars(stmt).all())


@router.post("", response_model=LiabilityOut, status_code=status.HTTP_201_CREATED)
def create_liability(
    payload: LiabilityCreate,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Liability:
    data = payload.model_dump()
    _validate_portfolio(db, current_user.id, data.get("portfolio_id"))

    liability = Liability(owner_user_id=current_user.id, **data)
    db.add(liability)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid liability payload") from exc

    db.refresh(liability)
    return liability


@router.patch("/{liability_id}", response_model=LiabilityOut)
def update_liability(
    liability_id: int,
    payload: LiabilityUpdate,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Liability:
    liability = _get_owned_liability(db, liability_id, current_user.id)

    updates = payload.model_dump(exclude_unset=True)
    next_portfolio_id = updates.get("portfolio_id", liability.portfolio_id)
    _validate_portfolio(db, current_user.id, next_portfolio_id)

    for key, value in updates.items():
        setattr(liability, key, value)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid liability payload") from exc

    db.refresh(liability)
    return liability


@router.patch("/{liability_id}/hidden", response_model=LiabilityOut)
def set_liability_hidden(
    liability_id: int,
    payload: LiabilityHiddenUpdate,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Liability:
    liability = _get_owned_liability(db, liability_id, current_user.id)
    liability.is_hidden = payload.is_hidden
    db.commit()
    db.refresh(liability)
    return liability


@router.delete("/{liability_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_liability(
    liability_id: int,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Response:
    liability = _get_owned_liability(db, liability_id, current_user.id)
    db.delete(liability)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

