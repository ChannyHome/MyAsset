from __future__ import annotations

from dataclasses import dataclass, field, replace
from datetime import UTC, date, datetime
from decimal import Decimal
from threading import Lock
from uuid import uuid4

from app.core.config import settings
from app.core.db import get_session_maker
from app.services.quote_updater import (
    count_supported_auto_assets,
    refresh_quotes_for_supported_assets,
    refresh_usd_krw_rate,
)
from app.services.valuation_snapshots import collect_valuation_snapshots_batch


@dataclass
class QuoteUpdateJobState:
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
    fx_updated: bool = False
    fx_base_currency: str | None = None
    fx_quote_currency: str | None = None
    fx_rate: Decimal | None = None
    fx_as_of: datetime | None = None
    fx_source: str | None = None
    fx_error: str | None = None
    snapshot_collected: bool = False
    snapshot_currency: str | None = None
    snapshot_date: date | None = None
    snapshot_user_scopes: int = 0
    snapshot_household_scopes: int = 0
    snapshot_upserted_rows: int = 0
    snapshot_error: str | None = None


_jobs: dict[str, QuoteUpdateJobState] = {}
_jobs_lock = Lock()
_MAX_JOBS = 100


def _copy_state(state: QuoteUpdateJobState) -> QuoteUpdateJobState:
    return replace(state, errors=list(state.errors))


def _prune_jobs_locked() -> None:
    if len(_jobs) <= _MAX_JOBS:
        return
    removable = sorted(_jobs.values(), key=lambda job: job.created_at)[: len(_jobs) - _MAX_JOBS]
    for job in removable:
        _jobs.pop(job.job_id, None)


def create_quote_update_job() -> QuoteUpdateJobState:
    session = get_session_maker()()
    try:
        total_assets = count_supported_auto_assets(session)
    finally:
        session.close()

    state = QuoteUpdateJobState(
        job_id=uuid4().hex,
        status="QUEUED",
        created_at=datetime.now(UTC).replace(tzinfo=None),
        total_assets=total_assets,
    )

    with _jobs_lock:
        _jobs[state.job_id] = state
        _prune_jobs_locked()
        return _copy_state(state)


def get_quote_update_job(job_id: str) -> QuoteUpdateJobState | None:
    with _jobs_lock:
        state = _jobs.get(job_id)
        return _copy_state(state) if state is not None else None


def get_active_quote_update_job() -> QuoteUpdateJobState | None:
    with _jobs_lock:
        active = [
            state
            for state in _jobs.values()
            if state.status in {"QUEUED", "RUNNING"}
        ]
        if not active:
            return None
        active.sort(key=lambda item: item.created_at, reverse=True)
        return _copy_state(active[0])


def run_quote_update_job(job_id: str) -> None:
    with _jobs_lock:
        state = _jobs.get(job_id)
        if state is None:
            return
        state.status = "RUNNING"
        state.started_at = datetime.now(UTC).replace(tzinfo=None)
        state.finished_at = None

    session = get_session_maker()()
    try:
        def on_progress(processed: int, total: int, summary) -> None:
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

        summary = refresh_quotes_for_supported_assets(session, on_progress=on_progress)
        fx_row, fx_error = refresh_usd_krw_rate(session)
        snapshot_result = None
        snapshot_error = None
        if settings.valuation_snapshot_auto_collect_enabled:
            try:
                snapshot_result = collect_valuation_snapshots_batch(
                    db=session,
                    display_currency=settings.valuation_snapshot_collect_currency,
                    include_users=True,
                    include_households=True,
                )
            except Exception as exc:
                session.rollback()
                snapshot_error = str(exc)

        with _jobs_lock:
            current = _jobs.get(job_id)
            if current is None:
                return
            current.total_assets = max(current.total_assets, current.processed_assets)
            current.processed_assets = current.total_assets
            current.updated_count = summary.updated_count
            current.skipped_count = summary.skipped_count
            current.failed_count = summary.failed_count
            current.errors = list(summary.errors)
            current.fx_updated = fx_row is not None
            current.fx_error = fx_error
            if fx_row is not None:
                current.fx_base_currency = fx_row.base_currency
                current.fx_quote_currency = fx_row.quote_currency
                current.fx_rate = fx_row.rate
                current.fx_as_of = fx_row.as_of
                current.fx_source = fx_row.source
            current.snapshot_error = snapshot_error
            if snapshot_result is not None:
                current.snapshot_collected = True
                current.snapshot_currency = snapshot_result.display_currency
                current.snapshot_date = snapshot_result.snapshot_date
                current.snapshot_user_scopes = snapshot_result.user_scopes_collected
                current.snapshot_household_scopes = snapshot_result.household_scopes_collected
                current.snapshot_upserted_rows = snapshot_result.upserted_rows
            current.status = "COMPLETED"
            current.finished_at = datetime.now(UTC).replace(tzinfo=None)
    except Exception as exc:
        with _jobs_lock:
            current = _jobs.get(job_id)
            if current is None:
                return
            current.status = "FAILED"
            current.errors.append(str(exc))
            current.finished_at = datetime.now(UTC).replace(tzinfo=None)
    finally:
        session.close()
