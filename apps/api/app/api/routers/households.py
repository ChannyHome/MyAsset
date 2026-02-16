from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_min_role
from app.core.db import get_db
from app.models.household import Household, HouseholdMember
from app.models.user import User
from app.schemas.household import (
    HouseholdCreate,
    HouseholdMemberCreate,
    HouseholdMemberOut,
    HouseholdMemberRoleUpdate,
    HouseholdOut,
    HouseholdUpdate,
)

router = APIRouter(prefix="/households", tags=["households"])


def _is_privileged(user: User) -> bool:
    return user.role in {"MAINTAINER", "ADMIN"}


def _get_household_or_404(db: Session, household_id: int) -> Household:
    household = db.scalar(select(Household).where(Household.id == household_id))
    if household is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Household not found")
    return household


def _ensure_household_access(db: Session, household_id: int, current_user: User) -> None:
    if _is_privileged(current_user):
        return

    is_member = db.scalar(
        select(HouseholdMember).where(
            HouseholdMember.household_id == household_id,
            HouseholdMember.user_id == current_user.id,
        )
    )
    if is_member is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not a member of this household")


def _owner_count(db: Session, household_id: int) -> int:
    return len(
        db.scalars(
            select(HouseholdMember).where(
                HouseholdMember.household_id == household_id,
                HouseholdMember.role == "OWNER",
            )
        ).all()
    )


@router.get("", response_model=list[HouseholdOut])
def list_households(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Household]:
    if _is_privileged(current_user):
        return list(db.scalars(select(Household).order_by(Household.id.asc())).all())

    stmt = (
        select(Household)
        .join(HouseholdMember, HouseholdMember.household_id == Household.id)
        .where(HouseholdMember.user_id == current_user.id)
        .order_by(Household.id.asc())
    )
    return list(db.scalars(stmt).all())


@router.post("", response_model=HouseholdOut, status_code=status.HTTP_201_CREATED)
def create_household(
    payload: HouseholdCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_min_role("MAINTAINER")),
) -> Household:
    owner_user_id = payload.owner_user_id or current_user.id

    owner_user = db.scalar(select(User).where(User.id == owner_user_id))
    if owner_user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Owner user does not exist")

    household = Household(name=payload.name)
    db.add(household)
    db.flush()

    db.add(HouseholdMember(household_id=household.id, user_id=owner_user_id, role="OWNER"))
    db.commit()
    db.refresh(household)
    return household


@router.patch("/{household_id}", response_model=HouseholdOut)
def update_household(
    household_id: int,
    payload: HouseholdUpdate,
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_min_role("MAINTAINER")),
) -> Household:
    household = _get_household_or_404(db, household_id)
    household.name = payload.name
    db.commit()
    db.refresh(household)
    return household


@router.get("/{household_id}/members", response_model=list[HouseholdMemberOut])
def list_household_members(
    household_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[HouseholdMemberOut]:
    _get_household_or_404(db, household_id)
    _ensure_household_access(db, household_id, current_user)

    stmt = (
        select(HouseholdMember, User)
        .join(User, User.id == HouseholdMember.user_id)
        .where(HouseholdMember.household_id == household_id)
        .order_by(HouseholdMember.user_id.asc())
    )
    rows = db.execute(stmt).all()
    return [
        HouseholdMemberOut(
            household_id=member.household_id,
            user_id=member.user_id,
            role=member.role,
            display_name=user.display_name,
            email=user.email,
        )
        for member, user in rows
    ]


@router.post("/{household_id}/members", response_model=HouseholdMemberOut, status_code=status.HTTP_201_CREATED)
def add_household_member(
    household_id: int,
    payload: HouseholdMemberCreate,
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_min_role("MAINTAINER")),
) -> HouseholdMemberOut:
    _get_household_or_404(db, household_id)

    member_user = db.scalar(select(User).where(User.id == payload.user_id))
    if member_user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User does not exist")

    row = HouseholdMember(household_id=household_id, user_id=payload.user_id, role=payload.role)
    db.add(row)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Member already exists") from exc

    return HouseholdMemberOut(
        household_id=household_id,
        user_id=member_user.id,
        role=payload.role,
        display_name=member_user.display_name,
        email=member_user.email,
    )


@router.patch("/{household_id}/members/{user_id}", response_model=HouseholdMemberOut)
def update_household_member_role(
    household_id: int,
    user_id: int,
    payload: HouseholdMemberRoleUpdate,
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_min_role("MAINTAINER")),
) -> HouseholdMemberOut:
    _get_household_or_404(db, household_id)

    member = db.scalar(
        select(HouseholdMember).where(
            HouseholdMember.household_id == household_id,
            HouseholdMember.user_id == user_id,
        )
    )
    if member is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")

    if member.role == "OWNER" and payload.role == "MEMBER" and _owner_count(db, household_id) <= 1:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="At least one OWNER is required")

    member.role = payload.role
    db.commit()

    member_user = db.scalar(select(User).where(User.id == user_id))
    return HouseholdMemberOut(
        household_id=household_id,
        user_id=user_id,
        role=payload.role,
        display_name=member_user.display_name if member_user else "-",
        email=member_user.email if member_user else "-",
    )


@router.delete("/{household_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_household_member(
    household_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_min_role("MAINTAINER")),
) -> Response:
    _get_household_or_404(db, household_id)

    member = db.scalar(
        select(HouseholdMember).where(
            HouseholdMember.household_id == household_id,
            HouseholdMember.user_id == user_id,
        )
    )
    if member is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")

    if member.role == "OWNER" and _owner_count(db, household_id) <= 1:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="At least one OWNER is required")

    db.delete(member)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)