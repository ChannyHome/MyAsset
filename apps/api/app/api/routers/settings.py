from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user_any, require_min_role
from app.core.db import get_db
from app.models.user import User
from app.schemas.app_settings import (
    FxStaleMinutesOut,
    FxStaleMinutesUpdate,
    QuoteIntervalOut,
    QuoteIntervalUpdate,
)
from app.services.app_settings import (
    get_fx_stale_minutes,
    get_quote_interval_minutes,
    set_fx_stale_minutes,
    set_quote_interval_minutes,
)
from app.tasks.quotes_scheduler import reschedule_quote_scheduler

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("/quote-interval", response_model=QuoteIntervalOut)
def get_quote_interval(
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_min_role("ADMIN")),
) -> QuoteIntervalOut:
    minutes, source = get_quote_interval_minutes(db)
    return QuoteIntervalOut(minutes=minutes, source=source)


@router.put("/quote-interval", response_model=QuoteIntervalOut)
def update_quote_interval(
    payload: QuoteIntervalUpdate,
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_min_role("ADMIN")),
) -> QuoteIntervalOut:
    minutes = set_quote_interval_minutes(db, payload.minutes)
    reschedule_quote_scheduler(minutes)
    return QuoteIntervalOut(minutes=minutes, source="db")


@router.get("/fx-stale-minutes", response_model=FxStaleMinutesOut)
def get_fx_stale_minutes_setting(
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user_any),
) -> FxStaleMinutesOut:
    minutes, source = get_fx_stale_minutes(db)
    return FxStaleMinutesOut(minutes=minutes, source=source)


@router.put("/fx-stale-minutes", response_model=FxStaleMinutesOut)
def update_fx_stale_minutes_setting(
    payload: FxStaleMinutesUpdate,
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_min_role("ADMIN")),
) -> FxStaleMinutesOut:
    minutes = set_fx_stale_minutes(db, payload.minutes)
    return FxStaleMinutesOut(minutes=minutes, source="db")
