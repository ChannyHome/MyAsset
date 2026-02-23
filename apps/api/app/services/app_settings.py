from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.app_setting import AppSetting

QUOTE_INTERVAL_KEY = "quote_update_interval_minutes"
FX_STALE_MINUTES_KEY = "fx_stale_minutes"
TOKEN_REFRESH_ENABLED_KEY = "token_refresh_enabled"


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


def get_token_refresh_enabled(db: Session) -> tuple[bool, str]:
    row = db.scalar(select(AppSetting).where(AppSetting.key == TOKEN_REFRESH_ENABLED_KEY))
    if row is None:
        return bool(settings.jwt_refresh_token_enabled), "env"
    normalized = str(row.value).strip().lower()
    if normalized in {"1", "true", "yes", "y", "on"}:
        return True, "db"
    if normalized in {"0", "false", "no", "n", "off"}:
        return False, "db"
    return bool(settings.jwt_refresh_token_enabled), "env"


def set_token_refresh_enabled(db: Session, enabled: bool) -> bool:
    row = db.scalar(select(AppSetting).where(AppSetting.key == TOKEN_REFRESH_ENABLED_KEY))
    value = "1" if bool(enabled) else "0"
    if row is None:
        row = AppSetting(key=TOKEN_REFRESH_ENABLED_KEY, value=value)
        db.add(row)
    else:
        row.value = value
    db.commit()
    return bool(enabled)
