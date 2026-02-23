from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.db import get_db
from app.models.user import User
from app.models.user_setting import UserSetting
from app.schemas.user_settings import UserSettingsOut, UserSettingsUpdate

router = APIRouter(prefix="/users/me", tags=["user-settings"])


def _normalize_mobile_top_n(value: int | None) -> int:
    if value is None:
        return 6
    if value < 3:
        return 3
    if value > 12:
        return 12
    return int(value)


def _get_or_create_user_settings(db: Session, user_id: int) -> UserSetting:
    row = db.get(UserSetting, user_id)
    if row is not None:
        dirty = False
        current = (row.display_currency or "KRW").upper()
        normalized = "USD" if current == "USD" else "KRW"
        if normalized != row.display_currency:
            row.display_currency = normalized
            dirty = True
        if row.name_clamp_enabled is None:
            row.name_clamp_enabled = True
            dirty = True
        normalized_top_n = _normalize_mobile_top_n(row.mobile_allocation_top_n)
        if normalized_top_n != row.mobile_allocation_top_n:
            row.mobile_allocation_top_n = normalized_top_n
            dirty = True
        if dirty:
            db.commit()
            db.refresh(row)
        return row

    row = UserSetting(user_id=user_id)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.get("/settings", response_model=UserSettingsOut)
def get_my_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserSetting:
    return _get_or_create_user_settings(db, current_user.id)


@router.patch("/settings", response_model=UserSettingsOut)
def update_my_settings(
    payload: UserSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserSetting:
    row = _get_or_create_user_settings(db, current_user.id)
    updates = payload.model_dump(exclude_unset=True)
    if "display_currency" in updates and updates["display_currency"] is not None:
        row.display_currency = updates["display_currency"]
    if "name_clamp_enabled" in updates and updates["name_clamp_enabled"] is not None:
        row.name_clamp_enabled = bool(updates["name_clamp_enabled"])
    if "mobile_allocation_top_n" in updates and updates["mobile_allocation_top_n"] is not None:
        row.mobile_allocation_top_n = _normalize_mobile_top_n(updates["mobile_allocation_top_n"])
    db.commit()
    db.refresh(row)
    return row
