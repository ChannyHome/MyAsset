from __future__ import annotations

from dataclasses import dataclass, field, replace
from datetime import UTC, date, datetime
from threading import Lock
from uuid import uuid4

from app.core.config import settings
from app.core.db import get_session_maker
from app.services.dividend_income import (
    DividendUpdateSummary,
    collect_dividend_snapshots_batch,
    count_supported_dividend_assets,
    refresh_dividends_for_supported_assets,
)
from app.services.dividend_update_runs import record_dividend_run_finished, record_dividend_run_started


@dataclass
class DividendUpdateJobState:
    job_id: str
    status: str
    created_at: datetime
    started_at: datetime | None = None
    finished_at: datetime | None = None
    total_assets: int = 0
    processed_assets: int = 0
    updated_count: int = 0
    skipped_count: int = 0
    failed_count: int = 0
    errors: list[str] = field(default_factory=list)
    snapshot_collected: bool = False
    snapshot_currency: str | None = None
    snapshot_date: date | None = None
    snapshot_user_scopes: int = 0
    snapshot_error: str | None = None


_jobs: dict[str, DividendUpdateJobState] = {}
_jobs_lock = Lock()
_MAX_JOBS = 100


def _copy_state(state: DividendUpdateJobState) -> DividendUpdateJobState:
    return replace(state, errors=list(state.errors))


def _prune_jobs_locked() -> None:
    if len(_jobs) <= _MAX_JOBS:
        return
    removable = sorted(_jobs.values(), key=lambda job: job.created_at)[: len(_jobs) - _MAX_JOBS]
    for job in removable:
        _jobs.pop(job.job_id, None)


def create_dividend_update_job() -> DividendUpdateJobState:
    session = get_session_maker()()
    try:
        total_assets = count_supported_dividend_assets(session)
    finally:
        session.close()

    state = DividendUpdateJobState(
        job_id=uuid4().hex,
        status="QUEUED",
        created_at=datetime.now(UTC).replace(tzinfo=None),
        total_assets=total_assets,
    )
    with _jobs_lock:
        _jobs[state.job_id] = state
        _prune_jobs_locked()
        return _copy_state(state)


def get_dividend_update_job(job_id: str) -> DividendUpdateJobState | None:
    with _jobs_lock:
        state = _jobs.get(job_id)
        return _copy_state(state) if state is not None else None


def get_active_dividend_update_job() -> DividendUpdateJobState | None:
    with _jobs_lock:
        active = [state for state in _jobs.values() if state.status in {"QUEUED", "RUNNING"}]
        if not active:
            return None
        active.sort(key=lambda item: item.created_at, reverse=True)
        return _copy_state(active[0])


def run_dividend_update_job(job_id: str) -> None:
    started_at = datetime.now(UTC).replace(tzinfo=None)
    with _jobs_lock:
        state = _jobs.get(job_id)
        if state is None:
            return
        state.status = "RUNNING"
        state.started_at = started_at
        state.finished_at = None

    session = get_session_maker()()
    persisted_run_id: int | None = None
    summary_payload: dict[str, object] | None = None
    snapshot_collected = False
    snapshot_error: str | None = None
    try:
        try:
            persisted_run = record_dividend_run_started(session, run_type="MANUAL", started_at=started_at)
            persisted_run_id = persisted_run.id
        except Exception:
            session.rollback()

        def on_progress(processed: int, total: int, summary: DividendUpdateSummary) -> None:
            with _jobs_lock:
                current = _jobs.get(job_id)
                if current is None:
                    return
                current.total_assets = total
                current.processed_assets = processed
                current.updated_count = summary.updated_count
                current.skipped_count = summary.skipped_count
                current.failed_count = summary.failed_count
                current.errors = list(summary.errors)

        summary = refresh_dividends_for_supported_assets(session, on_progress=on_progress)
        summary_payload = {
            "total_assets": summary.total_assets,
            "processed_assets": summary.processed_assets,
            "updated_count": summary.updated_count,
            "skipped_count": summary.skipped_count,
            "failed_count": summary.failed_count,
            "errors": list(summary.errors),
        }
        snapshot_result = None
        try:
            snapshot_result = collect_dividend_snapshots_batch(
                session,
                display_currency=settings.valuation_snapshot_collect_currency,
            )
        except Exception as exc:
            session.rollback()
            snapshot_error = str(exc)

        if snapshot_result is not None:
            snapshot_collected = True

        persisted_status = "COMPLETED_WITH_WARNINGS" if summary.failed_count > 0 or snapshot_error else "COMPLETED"
        try:
            record_dividend_run_finished(
                session,
                run_id=persisted_run_id,
                run_type="MANUAL",
                status=persisted_status,
                started_at=started_at,
                finished_at=datetime.now(UTC).replace(tzinfo=None),
                summary=summary_payload,
                snapshot_collected=snapshot_collected,
                snapshot_error=snapshot_error,
            )
        except Exception:
            session.rollback()

        with _jobs_lock:
            current = _jobs.get(job_id)
            if current is None:
                return
            current.total_assets = summary.total_assets
            current.processed_assets = summary.total_assets
            current.updated_count = summary.updated_count
            current.skipped_count = summary.skipped_count
            current.failed_count = summary.failed_count
            current.errors = list(summary.errors)
            current.snapshot_error = snapshot_error
            if snapshot_result is not None:
                current.snapshot_collected = True
                current.snapshot_currency = snapshot_result.display_currency
                current.snapshot_date = snapshot_result.snapshot_date
                current.snapshot_user_scopes = snapshot_result.user_scopes_collected
            current.status = "COMPLETED"
            current.finished_at = datetime.now(UTC).replace(tzinfo=None)
    except Exception as exc:
        try:
            record_dividend_run_finished(
                session,
                run_id=persisted_run_id,
                run_type="MANUAL",
                status="FAILED",
                started_at=started_at,
                finished_at=datetime.now(UTC).replace(tzinfo=None),
                summary=summary_payload,
                snapshot_collected=snapshot_collected,
                snapshot_error=snapshot_error,
                error_message=str(exc),
            )
        except Exception:
            session.rollback()
        with _jobs_lock:
            current = _jobs.get(job_id)
            if current is None:
                return
            current.status = "FAILED"
            current.errors.append(str(exc))
            current.finished_at = datetime.now(UTC).replace(tzinfo=None)
    finally:
        session.close()
