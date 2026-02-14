from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.db import get_db
from app.models.household import Household, HouseholdMember
from app.models.user import User
from app.schemas.household import HouseholdMemberOut, HouseholdOut
from app.services.user_seed import SeedUser

router = APIRouter(prefix="/households", tags=["households"])


@router.get("", response_model=list[HouseholdOut])
def list_households(
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> list[Household]:
    stmt = (
        select(Household)
        .join(HouseholdMember, HouseholdMember.household_id == Household.id)
        .where(HouseholdMember.user_id == current_user.id)
        .order_by(Household.id.asc())
    )
    return list(db.scalars(stmt).all())


@router.get("/{household_id}/members", response_model=list[HouseholdMemberOut])
def list_household_members(
    household_id: int,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> list[HouseholdMemberOut]:
    is_member = db.scalar(
        select(HouseholdMember).where(
            HouseholdMember.household_id == household_id,
            HouseholdMember.user_id == current_user.id,
        )
    )
    if is_member is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not a member of this household")

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
