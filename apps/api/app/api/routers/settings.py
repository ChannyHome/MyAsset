from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.db import get_db
from app.schemas.app_settings import QuoteIntervalOut, QuoteIntervalUpdate
from app.services.app_settings import get_quote_interval_minutes, set_quote_interval_minutes
from app.services.user_seed import SeedUser
from app.tasks.quotes_scheduler import reschedule_quote_scheduler

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("/quote-interval", response_model=QuoteIntervalOut)
def get_quote_interval(
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(get_current_user),
) -> QuoteIntervalOut:
    minutes, source = get_quote_interval_minutes(db)
    return QuoteIntervalOut(minutes=minutes, source=source)


@router.put("/quote-interval", response_model=QuoteIntervalOut)
def update_quote_interval(
    payload: QuoteIntervalUpdate,
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(get_current_user),
) -> QuoteIntervalOut:
    minutes = set_quote_interval_minutes(db, payload.minutes)
    reschedule_quote_scheduler(minutes)
    return QuoteIntervalOut(minutes=minutes, source="db")
