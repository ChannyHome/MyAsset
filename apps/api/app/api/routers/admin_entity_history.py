import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import require_min_role
from app.core.config import settings
from app.core.db import get_db
from app.models.asset import Asset
from app.models.entity_change_log import EntityChangeLog
from app.models.holding import Holding
from app.models.liability import Liability
from app.models.portfolio import Portfolio
from app.models.user import User
from app.schemas.asset import SortOrder
from app.schemas.entity_change import (
    EntityHistoryItemOut,
    EntityHistoryPageOut,
    EntityHistoryRevertOut,
    EntityHistorySortBy,
    HoldingRebaselineIn,
    LiabilityRebaselineIn,
    PortfolioRebaselineIn,
    RebaselineOut,
)
from app.services.entity_change_log import (
    EntityLogInput,
    loads_json,
    snapshot_asset,
    snapshot_holding,
    snapshot_liability,
    snapshot_portfolio,
    write_entity_change_log,
)
from app.services.entity_rebaseline import (
    RebaselineConflictError,
    rebaseline_holding,
    rebaseline_liability,
    rebaseline_portfolio,
)
from app.services.trade_ledger import TradeSyncError

router = APIRouter(prefix="/admin/entity-history", tags=["admin-entity-history"])


def _parse_json(value: str | None) -> dict | list | None:
    if not value:
        return None
    try:
        return json.loads(value)
    except Exception:
        return None


@router.get("", response_model=EntityHistoryPageOut)
def list_entity_history(
    entity_type: str | None = Query(default=None, min_length=3, max_length=30),
    entity_id: int | None = Query(default=None, ge=1),
    owner_user_id: int | None = Query(default=None, ge=1),
    actor_user_id: int | None = Query(default=None, ge=1),
    action: str | None = Query(default=None, min_length=3, max_length=30),
    from_: datetime | None = Query(default=None, alias="from"),
    to_: datetime | None = Query(default=None, alias="to"),
    sort_by: EntityHistorySortBy = Query(default=EntityHistorySortBy.CREATED_AT),
    sort_order: SortOrder = Query(default=SortOrder.DESC),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=200),
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_min_role("MAINTAINER")),
) -> EntityHistoryPageOut:
    filters = []
    if entity_type:
        filters.append(EntityChangeLog.entity_type == entity_type.strip().upper())
    if entity_id is not None:
        filters.append(EntityChangeLog.entity_id == entity_id)
    if owner_user_id is not None:
        filters.append(EntityChangeLog.owner_user_id == owner_user_id)
    if actor_user_id is not None:
        filters.append(EntityChangeLog.actor_user_id == actor_user_id)
    if action:
        filters.append(EntityChangeLog.action == action.strip().upper())
    if from_ is not None:
        filters.append(EntityChangeLog.created_at >= from_)
    if to_ is not None:
        filters.append(EntityChangeLog.created_at <= to_)

    count_stmt = select(func.count()).select_from(EntityChangeLog)
    if filters:
        count_stmt = count_stmt.where(*filters)
    total = int(db.scalar(count_stmt) or 0)

    sort_column_map = {
        EntityHistorySortBy.CREATED_AT: EntityChangeLog.created_at,
        EntityHistorySortBy.ENTITY_TYPE: EntityChangeLog.entity_type,
        EntityHistorySortBy.ENTITY_ID: EntityChangeLog.entity_id,
        EntityHistorySortBy.ACTION: EntityChangeLog.action,
        EntityHistorySortBy.OWNER_USER_ID: EntityChangeLog.owner_user_id,
        EntityHistorySortBy.ACTOR_USER_ID: EntityChangeLog.actor_user_id,
    }
    sort_column = sort_column_map[sort_by]
    order_expr = sort_column.asc() if sort_order == SortOrder.ASC else sort_column.desc()
    tie_breaker = EntityChangeLog.id.asc() if sort_order == SortOrder.ASC else EntityChangeLog.id.desc()

    stmt = select(EntityChangeLog)
    if filters:
        stmt = stmt.where(*filters)
    stmt = stmt.order_by(order_expr, tie_breaker).offset((page - 1) * page_size).limit(page_size)

    rows = list(db.scalars(stmt).all())
    items: list[EntityHistoryItemOut] = []
    for row in rows:
        item = EntityHistoryItemOut.model_validate(row, from_attributes=True)
        item.before = _parse_json(row.before_json)  # type: ignore[assignment]
        item.after = _parse_json(row.after_json)  # type: ignore[assignment]
        parsed_fields = loads_json(row.changed_fields_json)
        if isinstance(parsed_fields, list):
            item.changed_fields = [str(field) for field in parsed_fields]
        items.append(item)

    return EntityHistoryPageOut(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order,
    )


@router.post("/{history_id}/revert", response_model=EntityHistoryRevertOut)
def revert_entity_history(
    history_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_min_role("MAINTAINER")),
) -> EntityHistoryRevertOut:
    row = db.scalar(select(EntityChangeLog).where(EntityChangeLog.id == history_id))
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="History not found")

    before = _parse_json(row.before_json)
    if not isinstance(before, dict):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Selected history does not have revertable snapshot")

    reverted_with = "PATCH"
    rebaseline_out: RebaselineOut | None = None
    reason = f"REVERT history_id={row.id}"

    try:
        if row.entity_type == "ASSET":
            entity = db.scalar(select(Asset).where(Asset.id == row.entity_id))
            if entity is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
            before_current = snapshot_asset(entity)
            for key in ("asset_class", "symbol", "name", "currency", "quote_mode", "exchange_code", "is_trade_supported", "meta_json"):
                if key in before:
                    setattr(entity, key, before[key])
            after_current = snapshot_asset(entity)
            write_entity_change_log(
                db,
                EntityLogInput(
                    entity_type="ASSET",
                    entity_id=entity.id,
                    owner_user_id=row.owner_user_id,
                    action="REVERT",
                    before=before_current,
                    after=after_current,
                    reason=reason,
                    actor_user_id=current_user.id,
                    actor_email=current_user.email,
                ),
            )
        elif row.entity_type == "HOLDING":
            entity = db.scalar(
                select(Holding).where(Holding.id == row.entity_id, Holding.owner_user_id == row.owner_user_id)
            )
            if entity is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Holding not found")
            result = rebaseline_holding(
                db=db,
                owner_user_id=row.owner_user_id,
                holding=entity,
                payload=HoldingRebaselineIn(
                    effective_at=datetime.now(),
                    quantity=before.get("quantity", 0),
                    avg_price=before.get("avg_price", 0),
                    avg_price_currency=before.get("avg_price_currency", "KRW"),
                    invested_amount=before.get("invested_amount"),
                    invested_amount_currency=before.get("invested_amount_currency", "KRW"),
                    reason=reason,
                ),
                strict_fx=settings.fx_strict_mode,
            )
            db.flush()
            db.refresh(entity)
            write_entity_change_log(
                db,
                EntityLogInput(
                    entity_type="HOLDING",
                    entity_id=entity.id,
                    owner_user_id=row.owner_user_id,
                    action="REVERT",
                    before=before,
                    after=snapshot_holding(entity),
                    reason=reason,
                    actor_user_id=current_user.id,
                    actor_email=current_user.email,
                ),
            )
            reverted_with = "REBASELINE"
            rebaseline_out = RebaselineOut(
                entity_type="HOLDING",
                entity_id=entity.id,
                voided_transactions=result.voided_transactions,
                baseline_transaction_ids=result.baseline_transaction_ids,
                affected_scope=result.affected_scope,
            )
        elif row.entity_type == "PORTFOLIO":
            entity = db.scalar(
                select(Portfolio).where(Portfolio.id == row.entity_id, Portfolio.owner_user_id == row.owner_user_id)
            )
            if entity is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found")
            result = rebaseline_portfolio(
                db=db,
                owner_user_id=row.owner_user_id,
                portfolio=entity,
                payload=PortfolioRebaselineIn(
                    effective_at=datetime.now(),
                    cumulative_deposit_amount=before.get("cumulative_deposit_amount", 0),
                    cumulative_withdrawal_amount=before.get("cumulative_withdrawal_amount", 0),
                    reason=reason,
                ),
                strict_fx=settings.fx_strict_mode,
            )
            db.flush()
            db.refresh(entity)
            write_entity_change_log(
                db,
                EntityLogInput(
                    entity_type="PORTFOLIO",
                    entity_id=entity.id,
                    owner_user_id=row.owner_user_id,
                    action="REVERT",
                    before=before,
                    after=snapshot_portfolio(entity),
                    reason=reason,
                    actor_user_id=current_user.id,
                    actor_email=current_user.email,
                ),
            )
            reverted_with = "REBASELINE"
            rebaseline_out = RebaselineOut(
                entity_type="PORTFOLIO",
                entity_id=entity.id,
                voided_transactions=result.voided_transactions,
                baseline_transaction_ids=result.baseline_transaction_ids,
                affected_scope=result.affected_scope,
            )
        elif row.entity_type == "LIABILITY":
            entity = db.scalar(
                select(Liability).where(Liability.id == row.entity_id, Liability.owner_user_id == row.owner_user_id)
            )
            if entity is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Liability not found")
            result = rebaseline_liability(
                db=db,
                owner_user_id=row.owner_user_id,
                liability=entity,
                payload=LiabilityRebaselineIn(
                    effective_at=datetime.now(),
                    outstanding_balance=before.get("outstanding_balance", 0),
                    reason=reason,
                ),
                strict_fx=settings.fx_strict_mode,
            )
            db.flush()
            db.refresh(entity)
            write_entity_change_log(
                db,
                EntityLogInput(
                    entity_type="LIABILITY",
                    entity_id=entity.id,
                    owner_user_id=row.owner_user_id,
                    action="REVERT",
                    before=before,
                    after=snapshot_liability(entity),
                    reason=reason,
                    actor_user_id=current_user.id,
                    actor_email=current_user.email,
                ),
            )
            reverted_with = "REBASELINE"
            rebaseline_out = RebaselineOut(
                entity_type="LIABILITY",
                entity_id=entity.id,
                voided_transactions=result.voided_transactions,
                baseline_transaction_ids=result.baseline_transaction_ids,
                affected_scope=result.affected_scope,
            )
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported entity type")
        db.commit()
    except RebaselineConflictError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    except TradeSyncError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except HTTPException:
        db.rollback()
        raise
    except Exception as exc:  # pragma: no cover
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to revert history") from exc

    return EntityHistoryRevertOut(
        history_id=row.id,
        entity_type=row.entity_type,
        entity_id=row.entity_id,
        reverted_with=reverted_with,
        rebaseline=rebaseline_out,
    )
