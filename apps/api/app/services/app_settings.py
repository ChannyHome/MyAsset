from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.app_setting import AppSetting

QUOTE_INTERVAL_KEY = "quote_update_interval_minutes"
FX_STALE_MINUTES_KEY = "fx_stale_minutes"
TOKEN_REFRESH_ENABLED_KEY = "token_refresh_enabled"
OPENAI_ENABLED_KEY = "openai_enabled"
DIVIDEND_AUTO_UPDATE_ENABLED_KEY = "dividend_auto_update_enabled"
DIVIDEND_UPDATE_INTERVAL_HOURS_KEY = "dividend_update_interval_hours"
DIVIDEND_SCHEDULER_MISFIRE_GRACE_SECONDS_KEY = "dividend_scheduler_misfire_grace_seconds"
FINANCIAL_INCOME_TAXABLE_LIMIT_KRW_KEY = "financial_income_taxable_limit_krw"
DEFAULT_FINANCIAL_INCOME_TAXABLE_LIMIT_KRW = 20_000_000


def _parse_bool(value: str | None, fallback: bool) -> bool:
    normalized = str(value or "").strip().lower()
    if normalized in {"1", "true", "yes", "y", "on"}:
        return True
    if normalized in {"0", "false", "no", "n", "off"}:
        return False
    return bool(fallback)


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
    value = _parse_bool(row.value, bool(settings.jwt_refresh_token_enabled))
    return value, "db"


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


def get_openai_enabled(db: Session) -> tuple[bool, str]:
    row = db.scalar(select(AppSetting).where(AppSetting.key == OPENAI_ENABLED_KEY))
    if row is None:
        return bool(settings.openai_enabled), "env"
    value = _parse_bool(row.value, bool(settings.openai_enabled))
    return value, "db"


def set_openai_enabled(db: Session, enabled: bool) -> bool:
    row = db.scalar(select(AppSetting).where(AppSetting.key == OPENAI_ENABLED_KEY))
    value = "1" if bool(enabled) else "0"
    if row is None:
        row = AppSetting(key=OPENAI_ENABLED_KEY, value=value)
        db.add(row)
    else:
        row.value = value
    db.commit()
    return bool(enabled)


def get_dividend_auto_update_enabled(db: Session) -> tuple[bool, str]:
    row = db.scalar(select(AppSetting).where(AppSetting.key == DIVIDEND_AUTO_UPDATE_ENABLED_KEY))
    if row is None:
        return bool(settings.dividend_auto_update_enabled), "env"
    return _parse_bool(row.value, bool(settings.dividend_auto_update_enabled)), "db"


def set_dividend_auto_update_enabled(db: Session, enabled: bool) -> bool:
    row = db.scalar(select(AppSetting).where(AppSetting.key == DIVIDEND_AUTO_UPDATE_ENABLED_KEY))
    value = "1" if bool(enabled) else "0"
    if row is None:
        row = AppSetting(key=DIVIDEND_AUTO_UPDATE_ENABLED_KEY, value=value)
        db.add(row)
    else:
        row.value = value
    db.commit()
    return bool(enabled)


def get_dividend_update_interval_hours(db: Session) -> tuple[int, str]:
    row = db.scalar(select(AppSetting).where(AppSetting.key == DIVIDEND_UPDATE_INTERVAL_HOURS_KEY))
    if row is None:
        return settings.dividend_update_interval_hours, "env"

    try:
        value = int(row.value)
    except ValueError:
        return settings.dividend_update_interval_hours, "env"

    return max(1, min(720, value)), "db"


def set_dividend_update_interval_hours(db: Session, hours: int) -> int:
    normalized = max(1, min(720, int(hours)))
    row = db.scalar(select(AppSetting).where(AppSetting.key == DIVIDEND_UPDATE_INTERVAL_HOURS_KEY))
    if row is None:
        row = AppSetting(key=DIVIDEND_UPDATE_INTERVAL_HOURS_KEY, value=str(normalized))
        db.add(row)
    else:
        row.value = str(normalized)
    db.commit()
    return normalized


def get_dividend_scheduler_misfire_grace_seconds(db: Session) -> tuple[int, str]:
    row = db.scalar(select(AppSetting).where(AppSetting.key == DIVIDEND_SCHEDULER_MISFIRE_GRACE_SECONDS_KEY))
    if row is None:
        return settings.dividend_scheduler_misfire_grace_seconds, "env"

    try:
        value = int(row.value)
    except ValueError:
        return settings.dividend_scheduler_misfire_grace_seconds, "env"

    return max(60, min(86400, value)), "db"


def set_dividend_scheduler_misfire_grace_seconds(db: Session, seconds: int) -> int:
    normalized = max(60, min(86400, int(seconds)))
    row = db.scalar(select(AppSetting).where(AppSetting.key == DIVIDEND_SCHEDULER_MISFIRE_GRACE_SECONDS_KEY))
    if row is None:
        row = AppSetting(key=DIVIDEND_SCHEDULER_MISFIRE_GRACE_SECONDS_KEY, value=str(normalized))
        db.add(row)
    else:
        row.value = str(normalized)
    db.commit()
    return normalized


def get_financial_income_taxable_limit_krw(db: Session) -> tuple[int, str]:
    row = db.scalar(select(AppSetting).where(AppSetting.key == FINANCIAL_INCOME_TAXABLE_LIMIT_KRW_KEY))
    if row is None:
        return DEFAULT_FINANCIAL_INCOME_TAXABLE_LIMIT_KRW, "default"

    try:
        value = int(row.value)
    except ValueError:
        return DEFAULT_FINANCIAL_INCOME_TAXABLE_LIMIT_KRW, "default"

    return max(0, min(10_000_000_000, value)), "db"


def set_financial_income_taxable_limit_krw(db: Session, amount: int) -> int:
    normalized = max(0, min(10_000_000_000, int(amount)))
    row = db.scalar(select(AppSetting).where(AppSetting.key == FINANCIAL_INCOME_TAXABLE_LIMIT_KRW_KEY))
    if row is None:
        row = AppSetting(key=FINANCIAL_INCOME_TAXABLE_LIMIT_KRW_KEY, value=str(normalized))
        db.add(row)
    else:
        row.value = str(normalized)
    db.commit()
    return normalized
