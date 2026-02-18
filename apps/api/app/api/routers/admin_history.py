from datetime import datetime
import json

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import require_min_role
from app.core.db import get_db
from app.models.api_audit_log import ApiAuditLog
from app.models.user import User
from app.schemas.admin_history import AdminHistoryItemOut, AdminHistoryPageOut

router = APIRouter(prefix="/admin/history", tags=["admin-history"])


@router.get("", response_model=AdminHistoryPageOut)
def list_admin_history(
    from_: datetime | None = Query(default=None, alias="from"),
    to_: datetime | None = Query(default=None, alias="to"),
    user_id: int | None = Query(default=None, ge=1),
    method: str | None = Query(default=None, min_length=1, max_length=10),
    path_contains: str | None = Query(default=None, min_length=1, max_length=255),
    status_code: int | None = Query(default=None, ge=100, le=599),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=200),
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_min_role("MAINTAINER")),
) -> AdminHistoryPageOut:
    filters = []
    if from_ is not None:
        filters.append(ApiAuditLog.timestamp >= from_)
    if to_ is not None:
        filters.append(ApiAuditLog.timestamp <= to_)
    if user_id is not None:
        filters.append(ApiAuditLog.user_id == user_id)
    if method:
        filters.append(ApiAuditLog.method == method.upper().strip())
    if path_contains:
        filters.append(ApiAuditLog.path.ilike(f"%{path_contains.strip()}%"))
    if status_code is not None:
        filters.append(ApiAuditLog.status_code == status_code)

    count_stmt = select(func.count()).select_from(ApiAuditLog)
    if filters:
        count_stmt = count_stmt.where(*filters)
    total = int(db.scalar(count_stmt) or 0)

    stmt = select(ApiAuditLog)
    if filters:
        stmt = stmt.where(*filters)
    stmt = stmt.order_by(ApiAuditLog.timestamp.desc(), ApiAuditLog.id.desc())
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)

    rows = list(db.scalars(stmt).all())
    user_ids = sorted({row.user_id for row in rows if row.user_id is not None})
    email_by_user_id: dict[int, str] = {}
    if user_ids:
        for uid, email in db.execute(select(User.id, User.email).where(User.id.in_(user_ids))).all():
            email_by_user_id[int(uid)] = str(email)

    items: list[AdminHistoryItemOut] = []
    for row in rows:
        item = AdminHistoryItemOut.model_validate(row, from_attributes=True)
        item.actor_email = email_by_user_id.get(int(row.user_id)) if row.user_id is not None else None
        if item.actor_email is None and row.path.endswith("/auth/login") and row.request_body_masked:
            try:
                parsed = json.loads(row.request_body_masked)
                email_value = parsed.get("email") if isinstance(parsed, dict) else None
                if isinstance(email_value, str) and email_value:
                    item.actor_email = email_value.strip().lower()
            except Exception:
                pass
        items.append(item)

    return AdminHistoryPageOut(items=items, total=total, page=page, page_size=page_size)
