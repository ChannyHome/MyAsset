from __future__ import annotations

from datetime import UTC, datetime
from decimal import Decimal
from typing import Any

from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session

from app.models.dividend import DividendUpdateRun

DIVIDEND_RUN_SUCCESS_STATUSES = {"COMPLETED", "COMPLETED_WITH_WARNINGS"}
DIVIDEND_RUN_MISSED_STATUSES = {"MISSED", "MAX_INSTANCES"}


def _now_utc() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


def _duration_seconds(started_at: datetime | None, finished_at: datetime | None) -> Decimal | None:
    if started_at is None or finished_at is None:
        return None
    return Decimal(str(round((finished_at - started_at).total_seconds(), 3)))


def _run_summary(row: DividendUpdateRun | None) -> dict[str, Any] | None:
    if row is None:
        return None
    return {
        "total_assets": row.total_assets,
        "processed_assets": row.processed_assets,
        "updated_count": row.updated_count,
        "skipped_count": row.skipped_count,
        "failed_count": row.failed_count,
        "errors": row.errors_json or [],
    }


def record_dividend_run_started(
    db: Session,
    *,
    run_type: str,
    scheduled_run_at: datetime | None = None,
    started_at: datetime | None = None,
) -> DividendUpdateRun:
    row = DividendUpdateRun(
        run_type=run_type,
        status="STARTED",
        scheduled_run_at=scheduled_run_at,
        started_at=started_at or _now_utc(),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def record_dividend_run_finished(
    db: Session,
    *,
    run_id: int | None,
    run_type: str,
    status: str,
    started_at: datetime | None,
    finished_at: datetime | None = None,
    summary: dict[str, Any] | None = None,
    snapshot_collected: bool = False,
    snapshot_error: str | None = None,
    error_message: str | None = None,
) -> DividendUpdateRun:
    finished = finished_at or _now_utc()
    row = db.get(DividendUpdateRun, run_id) if run_id is not None else None
    if row is None:
        row = DividendUpdateRun(run_type=run_type, status="STARTED", started_at=started_at)
        db.add(row)

    summary = summary or {}
    row.status = status
    row.started_at = started_at
    row.finished_at = finished
    row.duration_seconds = _duration_seconds(started_at, finished)
    row.total_assets = int(summary.get("total_assets") or 0)
    row.processed_assets = int(summary.get("processed_assets") or 0)
    row.updated_count = int(summary.get("updated_count") or 0)
    row.skipped_count = int(summary.get("skipped_count") or 0)
    row.failed_count = int(summary.get("failed_count") or 0)
    errors = summary.get("errors")
    row.errors_json = [str(item) for item in errors] if isinstance(errors, list) else None
    row.snapshot_collected = bool(snapshot_collected)
    row.snapshot_error = snapshot_error
    row.error_message = error_message
    db.commit()
    db.refresh(row)
    return row


def record_dividend_run_event(
    db: Session,
    *,
    run_type: str,
    status: str,
    scheduled_run_at: datetime | None = None,
    error_message: str | None = None,
) -> DividendUpdateRun:
    finished = _now_utc()
    row = DividendUpdateRun(
        run_type=run_type,
        status=status,
        scheduled_run_at=scheduled_run_at,
        finished_at=finished,
        error_message=error_message,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def mark_stale_started_dividend_runs(db: Session, *, run_type: str, error_message: str) -> int:
    rows = list(
        db.scalars(
            select(DividendUpdateRun).where(
                DividendUpdateRun.run_type == run_type,
                DividendUpdateRun.status == "STARTED",
                DividendUpdateRun.finished_at.is_(None),
            )
        ).all()
    )
    if not rows:
        return 0

    finished = _now_utc()
    for row in rows:
        row.status = "FAILED"
        row.finished_at = finished
        row.duration_seconds = _duration_seconds(row.started_at, finished)
        row.error_message = error_message
    db.commit()
    return len(rows)


def get_dividend_run_status_snapshot(db: Session, *, run_type: str = "AUTO") -> dict[str, Any]:
    def latest_where(*statuses: str) -> DividendUpdateRun | None:
        return db.scalar(
            select(DividendUpdateRun)
            .where(
                DividendUpdateRun.run_type == run_type,
                DividendUpdateRun.status.in_(list(statuses)),
            )
            .order_by(
                desc(DividendUpdateRun.finished_at),
                desc(DividendUpdateRun.created_at),
                desc(DividendUpdateRun.id),
            )
        )

    def count_where(*statuses: str) -> int:
        return int(
            db.scalar(
                select(func.count())
                .select_from(DividendUpdateRun)
                .where(
                    DividendUpdateRun.run_type == run_type,
                    DividendUpdateRun.status.in_(list(statuses)),
                )
            )
            or 0
        )

    latest_any = db.scalar(
        select(DividendUpdateRun)
        .where(DividendUpdateRun.run_type == run_type)
        .order_by(desc(DividendUpdateRun.created_at), desc(DividendUpdateRun.id))
    )
    latest_success = latest_where(*DIVIDEND_RUN_SUCCESS_STATUSES)
    latest_failure = latest_where("FAILED")
    latest_missed = latest_where(*DIVIDEND_RUN_MISSED_STATUSES)

    return {
        "last_event": latest_any.status if latest_any is not None else None,
        "last_started_at": latest_any.started_at if latest_any is not None else None,
        "last_finished_at": latest_any.finished_at if latest_any is not None else None,
        "last_duration_seconds": float(latest_any.duration_seconds)
        if latest_any and latest_any.duration_seconds is not None
        else None,
        "last_success_at": latest_success.finished_at if latest_success is not None else None,
        "last_failure_at": latest_failure.finished_at if latest_failure is not None else None,
        "last_error": latest_failure.error_message if latest_failure is not None else None,
        "last_summary": _run_summary(latest_success or latest_any),
        "last_snapshot_collected": latest_success.snapshot_collected if latest_success is not None else None,
        "last_snapshot_error": latest_success.snapshot_error if latest_success is not None else None,
        "run_count": count_where("STARTED", "COMPLETED", "COMPLETED_WITH_WARNINGS", "FAILED"),
        "success_count": count_where(*DIVIDEND_RUN_SUCCESS_STATUSES),
        "failure_count": count_where("FAILED"),
        "missed_count": count_where("MISSED"),
        "max_instances_missed_count": count_where("MAX_INSTANCES"),
        "last_missed_at": latest_missed.finished_at if latest_missed is not None else None,
        "last_missed_scheduled_run_at": latest_missed.scheduled_run_at if latest_missed is not None else None,
    }
