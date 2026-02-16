import secrets
import string

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import require_min_role
from app.core.db import get_db
from app.core.security import get_password_hash
from app.models.household import HouseholdMember
from app.models.user import User
from app.schemas.admin_user import (
    AdminUserOut,
    AdminUserPasswordResetIn,
    AdminUserPasswordResetOut,
    AdminUserRoleUpdateIn,
    AdminUserStatusUpdateIn,
)

router = APIRouter(prefix="/admin/users", tags=["admin-users"])

MANAGEABLE_BY_MAINTAINER = {"GUEST", "USER", "SUPERUSER"}


def _active_admin_count(db: Session) -> int:
    return len(
        db.scalars(
            select(User.id).where(
                User.role == "ADMIN",
                User.status == "ACTIVE",
                User.is_active.is_(True),
            )
        ).all()
    )


def _get_user_or_404(db: Session, user_id: int) -> User:
    user = db.scalar(select(User).where(User.id == user_id))
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


def _assert_can_manage(actor: User, target: User) -> None:
    if actor.id == target.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot manage your own account via admin API")

    if actor.role == "ADMIN":
        return

    if actor.role == "MAINTAINER":
        if target.role not in MANAGEABLE_BY_MAINTAINER:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Maintainer cannot manage this role")
        return

    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role")


def _set_user_active_flags(user: User) -> None:
    user.is_active = user.status == "ACTIVE"


def _random_password(length: int = 12) -> str:
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


def _deactivate_owner_memberships(db: Session, target_user: User, successor_user_id: int | None) -> None:
    owner_rows = list(
        db.scalars(
            select(HouseholdMember).where(
                HouseholdMember.user_id == target_user.id,
                HouseholdMember.role == "OWNER",
            )
        ).all()
    )

    if not owner_rows:
        return

    if successor_user_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="successor_user_id is required when deactivating an OWNER account",
        )
    if successor_user_id == target_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="successor_user_id must be different")

    successor = db.scalar(select(User).where(User.id == successor_user_id))
    if successor is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Successor user does not exist")
    if not successor.is_active or successor.status != "ACTIVE":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Successor user must be ACTIVE")

    for owner_row in owner_rows:
        successor_membership = db.scalar(
            select(HouseholdMember).where(
                HouseholdMember.household_id == owner_row.household_id,
                HouseholdMember.user_id == successor_user_id,
            )
        )
        if successor_membership is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Successor must be a member of household_id={owner_row.household_id}",
            )
        successor_membership.role = "OWNER"
        db.delete(owner_row)


@router.get("", response_model=list[AdminUserOut])
def list_users(
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_min_role("MAINTAINER")),
) -> list[User]:
    return list(db.scalars(select(User).order_by(User.id.asc())).all())


@router.patch("/{user_id}/role", response_model=AdminUserOut)
def update_user_role(
    user_id: int,
    payload: AdminUserRoleUpdateIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_min_role("MAINTAINER")),
) -> User:
    target_user = _get_user_or_404(db, user_id)
    _assert_can_manage(current_user, target_user)

    next_role = payload.role
    if current_user.role == "MAINTAINER" and next_role not in MANAGEABLE_BY_MAINTAINER:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Maintainer cannot assign this role")

    if target_user.role == "ADMIN" and next_role != "ADMIN" and _active_admin_count(db) <= 1:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="At least one ACTIVE ADMIN is required")

    target_user.role = next_role
    db.commit()
    db.refresh(target_user)
    return target_user


@router.patch("/{user_id}/status", response_model=AdminUserOut)
def update_user_status(
    user_id: int,
    payload: AdminUserStatusUpdateIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_min_role("MAINTAINER")),
) -> User:
    target_user = _get_user_or_404(db, user_id)
    _assert_can_manage(current_user, target_user)

    next_status = payload.status

    if target_user.role == "ADMIN" and next_status != "ACTIVE" and _active_admin_count(db) <= 1:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="At least one ACTIVE ADMIN is required")

    if next_status == "DEACTIVATED":
        _deactivate_owner_memberships(db, target_user, payload.successor_user_id)

    target_user.status = next_status
    _set_user_active_flags(target_user)
    db.commit()
    db.refresh(target_user)
    return target_user


@router.post("/{user_id}/reset-password", response_model=AdminUserPasswordResetOut)
def reset_user_password(
    user_id: int,
    payload: AdminUserPasswordResetIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_min_role("MAINTAINER")),
) -> AdminUserPasswordResetOut:
    target_user = _get_user_or_404(db, user_id)
    _assert_can_manage(current_user, target_user)

    temporary_password = payload.temporary_password or _random_password(12)
    target_user.password_hash = get_password_hash(temporary_password)
    target_user.must_change_password = True
    db.commit()

    return AdminUserPasswordResetOut(
        user_id=target_user.id,
        temporary_password=temporary_password,
        must_change_password=True,
    )