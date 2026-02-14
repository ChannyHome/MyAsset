from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import Select, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.db import get_db
from app.models.asset import Asset
from app.models.household import HouseholdMember
from app.models.holding import Holding
from app.models.portfolio import Portfolio
from app.schemas.holding import HoldingCreate, HoldingHiddenUpdate, HoldingOut, HoldingUpdate
from app.services.user_seed import SeedUser

router = APIRouter(prefix="/holdings", tags=["holdings"])


def _validate_references(
    db: Session,
    owner_user_id: int,
    asset_id: int,
    portfolio_id: int | None,
) -> None:
    asset = db.scalar(select(Asset).where(Asset.id == asset_id))
    if asset is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Asset does not exist")

    if portfolio_id is not None:
        portfolio = db.scalar(select(Portfolio).where(Portfolio.id == portfolio_id, Portfolio.owner_user_id == owner_user_id))
        if portfolio is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Portfolio does not exist")


def _get_owned_holding(db: Session, holding_id: int, owner_user_id: int) -> Holding:
    holding = db.scalar(select(Holding).where(Holding.id == holding_id, Holding.owner_user_id == owner_user_id))
    if holding is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Holding not found")
    return holding


def _resolve_scope_user_ids(
    db: Session,
    current_user: SeedUser,
    scope_type: str | None,
    scope_id: int | None,
) -> list[int]:
    if scope_type is None:
        return [current_user.id]

    normalized_scope_type = scope_type.upper()
    if normalized_scope_type == "USER":
        target_user_id = scope_id or current_user.id
        if target_user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only your own USER scope is allowed")
        return [target_user_id]

    if normalized_scope_type in {"HOUSEHOLD", "GROUP"}:
        if scope_id is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="scope_id is required for HOUSEHOLD scope")

        is_member = db.scalar(
            select(HouseholdMember).where(
                HouseholdMember.household_id == scope_id,
                HouseholdMember.user_id == current_user.id,
            )
        )
        if is_member is None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not a member of this household")

        member_rows = db.scalars(
            select(HouseholdMember.user_id).where(HouseholdMember.household_id == scope_id)
        ).all()
        return list(member_rows)

    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="scope_type must be USER or HOUSEHOLD")


@router.get("", response_model=list[HoldingOut])
def list_holdings(
    scope_type: str | None = None,
    scope_id: int | None = None,
    include_hidden: bool = False,
    include_excluded_portfolios: bool = False,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> list[Holding]:
    scope_user_ids = _resolve_scope_user_ids(
        db=db,
        current_user=current_user,
        scope_type=scope_type,
        scope_id=scope_id,
    )

    stmt: Select[tuple[Holding]] = (
        select(Holding)
        .outerjoin(Portfolio, Holding.portfolio_id == Portfolio.id)
        .where(Holding.owner_user_id.in_(scope_user_ids))
    )
    if not include_hidden:
        stmt = stmt.where(Holding.is_hidden.is_(False))
        stmt = stmt.where(or_(Holding.portfolio_id.is_(None), Portfolio.is_hidden.is_(False)))

    if not include_excluded_portfolios:
        stmt = stmt.where(or_(Holding.portfolio_id.is_(None), Portfolio.is_included.is_(True)))

    stmt = stmt.order_by(Holding.id.desc())
    return list(db.scalars(stmt).all())


@router.post("", response_model=HoldingOut, status_code=status.HTTP_201_CREATED)
def create_holding(
    payload: HoldingCreate,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Holding:
    data = payload.model_dump()
    _validate_references(
        db=db,
        owner_user_id=current_user.id,
        asset_id=data["asset_id"],
        portfolio_id=data["portfolio_id"],
    )

    holding = Holding(owner_user_id=current_user.id, **data)
    db.add(holding)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid holding payload") from exc
    db.refresh(holding)
    return holding


@router.patch("/{holding_id}", response_model=HoldingOut)
def update_holding(
    holding_id: int,
    payload: HoldingUpdate,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Holding:
    holding = _get_owned_holding(db, holding_id, current_user.id)
    updates = payload.model_dump(exclude_unset=True)

    next_asset_id = updates.get("asset_id", holding.asset_id)
    next_portfolio_id = updates.get("portfolio_id", holding.portfolio_id)
    _validate_references(
        db=db,
        owner_user_id=current_user.id,
        asset_id=next_asset_id,
        portfolio_id=next_portfolio_id,
    )

    for key, value in updates.items():
        setattr(holding, key, value)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid holding payload") from exc
    db.refresh(holding)
    return holding


@router.patch("/{holding_id}/hidden", response_model=HoldingOut)
def set_holding_hidden(
    holding_id: int,
    payload: HoldingHiddenUpdate,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Holding:
    holding = _get_owned_holding(db, holding_id, current_user.id)
    holding.is_hidden = payload.is_hidden
    db.commit()
    db.refresh(holding)
    return holding


@router.delete("/{holding_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_holding(
    holding_id: int,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Response:
    holding = _get_owned_holding(db, holding_id, current_user.id)
    db.delete(holding)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
