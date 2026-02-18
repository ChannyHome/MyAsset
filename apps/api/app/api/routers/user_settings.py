from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.db import get_db
from app.models.user import User
from app.models.user_setting import UserSetting
from app.schemas.user_settings import UserSettingsOut, UserSettingsUpdate

router = APIRouter(prefix="/users/me", tags=["user-settings"])


def _get_or_create_user_settings(db: Session, user_id: int) -> UserSetting:
    row = db.get(UserSetting, user_id)
    if row is not None:
        current = (row.display_currency or "KRW").upper()
        normalized = "USD" if current == "USD" else "KRW"
        if normalized != row.display_currency:
            row.display_currency = normalized
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
    row.display_currency = payload.display_currency
    db.commit()
    db.refresh(row)
    return row
