from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.app_setting import AppSetting

QUOTE_INTERVAL_KEY = "quote_update_interval_minutes"
FX_STALE_MINUTES_KEY = "fx_stale_minutes"


def get_quote_interval_minutes(db: Session) -> tuple[int, str]:
    row = db.scalar(select(AppSetting).where(AppSetting.key == QUOTE_INTERVAL_KEY))
    if row is None:
        return settings.quote_update_interval_minutes, "env"

    try:
        value = int(row.value)
    except ValueError:
        return settings.quote_update_interval_minutes, "env"

    return max(1, min(1440, value)), "db"


def set_quote_interval_minutes(db: Session, minutes: int) -> int:
    normalized = max(1, min(1440, int(minutes)))
    row = db.scalar(select(AppSetting).where(AppSetting.key == QUOTE_INTERVAL_KEY))
    if row is None:
        row = AppSetting(key=QUOTE_INTERVAL_KEY, value=str(normalized))
        db.add(row)
    else:
        row.value = str(normalized)
    db.commit()
    return normalized


def get_fx_stale_minutes(db: Session) -> tuple[int, str]:
    row = db.scalar(select(AppSetting).where(AppSetting.key == FX_STALE_MINUTES_KEY))
    if row is None:
        return settings.fx_stale_minutes, "env"

    try:
        value = int(row.value)
    except ValueError:
        return settings.fx_stale_minutes, "env"

    return max(1, min(1440, value)), "db"


def set_fx_stale_minutes(db: Session, minutes: int) -> int:
    normalized = max(1, min(1440, int(minutes)))
    row = db.scalar(select(AppSetting).where(AppSetting.key == FX_STALE_MINUTES_KEY))
    if row is None:
        row = AppSetting(key=FX_STALE_MINUTES_KEY, value=str(normalized))
        db.add(row)
    else:
        row.value = str(normalized)
    db.commit()
    return normalized
