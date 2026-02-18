from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import require_min_role
from app.core.db import get_db
from app.models.api_audit_log import ApiAuditLog
from app.models.user import User
from app.schemas.admin_history import AdminHistoryPageOut

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

    items = list(db.scalars(stmt).all())
    return AdminHistoryPageOut(items=items, total=total, page=page, page_size=page_size)
