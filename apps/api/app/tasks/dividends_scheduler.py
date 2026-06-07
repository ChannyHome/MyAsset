from __future__ import annotations

import logging
from datetime import UTC, datetime
from threading import Lock
from typing import Any

from apscheduler.events import EVENT_JOB_ERROR, EVENT_JOB_MAX_INSTANCES, EVENT_JOB_MISSED, JobEvent
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.db import get_session_maker
from app.services.app_settings import (
    get_dividend_auto_update_enabled,
    get_dividend_scheduler_misfire_grace_seconds,
    get_dividend_update_interval_hours,
)
from app.services.dividend_income import collect_dividend_snapshots_batch, refresh_dividends_for_supported_assets
from app.services.dividend_update_runs import (
    get_dividend_run_status_snapshot,
    mark_stale_started_dividend_runs,
    record_dividend_run_event,
    record_dividend_run_finished,
    record_dividend_run_started,
)

_scheduler: BackgroundScheduler | None = None
_state_lock = Lock()
_JOB_ID = "dividend_update_job"
_logger = logging.getLogger(__name__)

_state: dict[str, Any] = {
    "enabled": False,
    "running": False,
    "job_id": _JOB_ID,
    "interval_hours": None,
    "misfire_grace_seconds": None,
    "coalesce": True,
    "max_instances": 1,
    "job_running": False,
    "next_run_at": None,
    "last_event": "IDLE",
    "last_started_at": None,
    "last_finished_at": None,
    "last_duration_seconds": None,
    "last_success_at": None,
    "last_failure_at": None,
    "last_error": None,
    "last_summary": None,
    "last_snapshot_collected": None,
    "last_snapshot_error": None,
    "run_count": 0,
    "success_count": 0,
    "failure_count": 0,
    "missed_count": 0,
    "max_instances_missed_count": 0,
    "last_missed_at": None,
    "last_missed_scheduled_run_at": None,
}


def _now_utc() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


def _normalize_dt(value: Any) -> datetime | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        if value.tzinfo is not None:
            return value.astimezone(UTC).replace(tzinfo=None)
        return value
    return None


def _set_state(**updates: Any) -> None:
    with _state_lock:
        _state.update(updates)


def _increment_state(key: str) -> None:
    with _state_lock:
        _state[key] = int(_state.get(key) or 0) + 1


def _get_next_run_at() -> datetime | None:
    if _scheduler is None:
        return None
    job = _scheduler.get_job(_JOB_ID)
    if job is None:
        return None
    return _normalize_dt(job.next_run_time)


def _get_scheduler_settings() -> tuple[bool, int, int]:
    session_maker = get_session_maker()
    db: Session = session_maker()
    try:
        enabled, _ = get_dividend_auto_update_enabled(db)
        interval_hours, _ = get_dividend_update_interval_hours(db)
        misfire_seconds, _ = get_dividend_scheduler_misfire_grace_seconds(db)
        return enabled, interval_hours, misfire_seconds
    except SQLAlchemyError:
        return (
            bool(settings.dividend_auto_update_enabled),
            int(settings.dividend_update_interval_hours),
            int(settings.dividend_scheduler_misfire_grace_seconds),
        )
    finally:
        db.close()


def get_dividend_scheduler_status() -> dict[str, Any]:
    enabled, _, _ = _get_scheduler_settings()
    with _state_lock:
        status = dict(_state)
    status["enabled"] = bool(enabled)
    status["running"] = bool(_scheduler is not None and _scheduler.running)
    status["next_run_at"] = _get_next_run_at()
    session_maker = get_session_maker()
    db: Session = session_maker()
    try:
        persisted = get_dividend_run_status_snapshot(db, run_type="AUTO")
        for key, value in persisted.items():
            if key in {"run_count", "success_count", "failure_count", "missed_count", "max_instances_missed_count"}:
                status[key] = max(int(status.get(key) or 0), int(value or 0))
                continue
            current = status.get(key)
            should_replace = current is None or (isinstance(current, str) and current in {"IDLE", "SCHEDULED", "STOPPED"})
            if value is not None and should_replace:
                status[key] = value
    except SQLAlchemyError:
        db.rollback()
        _logger.exception("Failed to load persisted dividend scheduler status")
    finally:
        db.close()
    return status


def _handle_scheduler_event(event: JobEvent) -> None:
    if getattr(event, "job_id", None) != _JOB_ID:
        return

    now = _now_utc()
    scheduled = _normalize_dt(getattr(event, "scheduled_run_time", None))

    if event.code == EVENT_JOB_MISSED:
        _increment_state("missed_count")
        _set_state(last_event="MISSED", last_missed_at=now, last_missed_scheduled_run_at=scheduled)
        session_maker = get_session_maker()
        db: Session = session_maker()
        try:
            record_dividend_run_event(
                db,
                run_type="AUTO",
                status="MISSED",
                scheduled_run_at=scheduled,
                error_message="Scheduled dividend job run was missed.",
            )
        except SQLAlchemyError:
            db.rollback()
            _logger.exception("Failed to persist dividend scheduler missed event")
        finally:
            db.close()
        return

    if event.code == EVENT_JOB_MAX_INSTANCES:
        scheduled_runs = getattr(event, "scheduled_run_times", None) or []
        scheduled = _normalize_dt(scheduled_runs[-1]) if scheduled_runs else scheduled
        _increment_state("max_instances_missed_count")
        _set_state(last_event="MAX_INSTANCES", last_missed_at=now, last_missed_scheduled_run_at=scheduled)
        session_maker = get_session_maker()
        db: Session = session_maker()
        try:
            record_dividend_run_event(
                db,
                run_type="AUTO",
                status="MAX_INSTANCES",
                scheduled_run_at=scheduled,
                error_message="Scheduled dividend job run was skipped because a previous run was still active.",
            )
        except SQLAlchemyError:
            db.rollback()
            _logger.exception("Failed to persist dividend scheduler max-instances event")
        finally:
            db.close()
        return

    if event.code == EVENT_JOB_ERROR:
        _logger.error("Dividend scheduler job raised an unhandled error: %s", getattr(event, "exception", None))


def _run_dividend_job() -> None:
    started_at = _now_utc()
    _increment_state("run_count")
    _set_state(
        job_running=True,
        last_event="RUNNING",
        last_started_at=started_at,
        last_finished_at=None,
        last_duration_seconds=None,
        last_error=None,
        last_summary=None,
        last_snapshot_collected=None,
        last_snapshot_error=None,
    )
    session_maker = get_session_maker()
    db: Session = session_maker()
    persisted_run_id: int | None = None
    summary_payload: dict[str, Any] | None = None
    snapshot_collected = False
    snapshot_error: str | None = None
    try:
        try:
            persisted_run = record_dividend_run_started(db, run_type="AUTO", started_at=started_at)
            persisted_run_id = persisted_run.id
        except SQLAlchemyError:
            db.rollback()
            _logger.exception("Failed to persist dividend scheduler start")

        summary = refresh_dividends_for_supported_assets(db)
        summary_payload = {
            "total_assets": summary.total_assets,
            "processed_assets": summary.processed_assets,
            "updated_count": summary.updated_count,
            "skipped_count": summary.skipped_count,
            "failed_count": summary.failed_count,
            "errors": list(summary.errors),
        }
        try:
            collect_dividend_snapshots_batch(db, display_currency=settings.valuation_snapshot_collect_currency)
            snapshot_collected = True
        except Exception as exc:
            db.rollback()
            snapshot_error = str(exc)
            _logger.exception("Dividend scheduler snapshot collection failed")

        finished_at = _now_utc()
        status = "COMPLETED_WITH_WARNINGS" if summary.failed_count > 0 or snapshot_error else "COMPLETED"
        try:
            record_dividend_run_finished(
                db,
                run_id=persisted_run_id,
                run_type="AUTO",
                status=status,
                started_at=started_at,
                finished_at=finished_at,
                summary=summary_payload,
                snapshot_collected=snapshot_collected,
                snapshot_error=snapshot_error,
            )
        except SQLAlchemyError:
            db.rollback()
            _logger.exception("Failed to persist dividend scheduler finish")

        _increment_state("success_count")
        _set_state(
            job_running=False,
            last_event=status,
            last_finished_at=finished_at,
            last_duration_seconds=(finished_at - started_at).total_seconds(),
            last_success_at=finished_at,
            last_summary=summary_payload,
            last_snapshot_collected=snapshot_collected,
            last_snapshot_error=snapshot_error,
        )
    except Exception as exc:
        db.rollback()
        finished_at = _now_utc()
        try:
            record_dividend_run_finished(
                db,
                run_id=persisted_run_id,
                run_type="AUTO",
                status="FAILED",
                started_at=started_at,
                finished_at=finished_at,
                summary=summary_payload,
                snapshot_collected=snapshot_collected,
                snapshot_error=snapshot_error,
                error_message=str(exc),
            )
        except SQLAlchemyError:
            db.rollback()
            _logger.exception("Failed to persist dividend scheduler failure")
        _increment_state("failure_count")
        _set_state(
            job_running=False,
            last_event="FAILED",
            last_finished_at=finished_at,
            last_duration_seconds=(finished_at - started_at).total_seconds(),
            last_failure_at=finished_at,
            last_error=str(exc),
            last_summary=summary_payload,
            last_snapshot_collected=snapshot_collected,
            last_snapshot_error=snapshot_error,
        )
        raise
    finally:
        db.close()


def start_dividend_scheduler() -> None:
    global _scheduler

    enabled, interval_hours, misfire_grace_seconds = _get_scheduler_settings()
    if not enabled:
        _set_state(enabled=False, running=False, last_event="DISABLED")
        return
    if _scheduler is not None and _scheduler.running:
        return

    session_maker = get_session_maker()
    db: Session = session_maker()
    try:
        stale_count = mark_stale_started_dividend_runs(
            db,
            run_type="AUTO",
            error_message="API process restarted before the scheduled dividend job finished.",
        )
        if stale_count:
            _logger.warning("Marked %s stale dividend scheduler runs as failed", stale_count)
    except SQLAlchemyError:
        db.rollback()
        _logger.exception("Failed to mark stale dividend scheduler runs")
    finally:
        db.close()

    _scheduler = BackgroundScheduler(timezone="UTC")
    _scheduler.add_listener(_handle_scheduler_event, EVENT_JOB_MISSED | EVENT_JOB_MAX_INSTANCES | EVENT_JOB_ERROR)
    _scheduler.add_job(
        _run_dividend_job,
        "interval",
        hours=interval_hours,
        id=_JOB_ID,
        replace_existing=True,
        misfire_grace_time=misfire_grace_seconds,
        coalesce=True,
        max_instances=1,
    )
    _scheduler.start()
    _set_state(
        enabled=True,
        running=True,
        interval_hours=interval_hours,
        misfire_grace_seconds=misfire_grace_seconds,
        coalesce=True,
        max_instances=1,
        next_run_at=_get_next_run_at(),
        last_event="SCHEDULED",
    )
    _logger.info(
        "Dividend scheduler started interval_hours=%s misfire_grace_seconds=%s next_run_at=%s",
        interval_hours,
        misfire_grace_seconds,
        _get_next_run_at(),
    )


def stop_dividend_scheduler() -> None:
    global _scheduler
    if _scheduler is not None:
        _scheduler.shutdown(wait=False)
        _scheduler = None
    _set_state(running=False, job_running=False, next_run_at=None, last_event="STOPPED")
