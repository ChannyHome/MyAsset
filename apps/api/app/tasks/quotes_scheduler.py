from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.db import get_session_maker
from app.services.app_settings import get_quote_interval_minutes
from app.services.quote_updater import refresh_quotes_for_supported_assets

_scheduler: BackgroundScheduler | None = None


def _run_quote_job() -> None:
    session_maker = get_session_maker()
    db: Session = session_maker()
    try:
        refresh_quotes_for_supported_assets(db)
    finally:
        db.close()


def _get_interval_minutes() -> int:
    session_maker = get_session_maker()
    db: Session = session_maker()
    try:
        minutes, _ = get_quote_interval_minutes(db)
        return minutes
    except SQLAlchemyError:
        return settings.quote_update_interval_minutes
    finally:
        db.close()


def start_quote_scheduler() -> None:
    global _scheduler

    if not settings.quote_auto_update_enabled:
        return
    if _scheduler is not None and _scheduler.running:
        return

    interval = _get_interval_minutes()
    _scheduler = BackgroundScheduler(timezone="UTC")
    _scheduler.add_job(
        _run_quote_job,
        "interval",
        minutes=interval,
        id="quote_update_job",
        replace_existing=True,
    )
    _scheduler.start()


def reschedule_quote_scheduler(interval_minutes: int) -> None:
    global _scheduler
    if _scheduler is None or not _scheduler.running:
        return

    _scheduler.reschedule_job(
        "quote_update_job",
        trigger="interval",
        minutes=interval_minutes,
    )


def stop_quote_scheduler() -> None:
    global _scheduler
    if _scheduler is None:
        return
    _scheduler.shutdown(wait=False)
    _scheduler = None
