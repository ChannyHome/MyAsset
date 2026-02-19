from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import Select, func, or_, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.db import get_db
from app.models.asset import Asset
from app.models.portfolio import Portfolio
from app.models.transaction import Transaction
from app.schemas.asset import SortOrder
from app.schemas.trade import (
    TradeCreate,
    TradeOut,
    TradePageOut,
    TradeRebuildIn,
    TradeRebuildOut,
    TradeRowOut,
    TradeUpdate,
    TransactionSortBy,
)
from app.services.currency import MissingFxRateError
from app.services.trade_ledger import (
    TradeSyncError,
    normalize_trade_payload,
    rebuild_trade_scope,
    sync_single_trade_scope,
)
from app.services.user_seed import SeedUser

router = APIRouter(prefix="/trades", tags=["trades"])


def _get_owned_transaction(db: Session, owner_user_id: int, transaction_id: int) -> Transaction:
    txn = db.scalar(
        select(Transaction).where(
            Transaction.id == transaction_id,
            Transaction.owner_user_id == owner_user_id,
        )
    )
    if txn is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return txn


def _to_trade_out(txn: Transaction) -> TradeOut:
    return TradeOut.model_validate(txn)


@router.get("", response_model=TradePageOut)
def list_trades(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=200),
    sort_by: TransactionSortBy = Query(default=TransactionSortBy.EXECUTED_AT),
    sort_order: SortOrder = Query(default=SortOrder.DESC),
    q: str | None = Query(default=None, min_length=1, max_length=100),
    portfolio_id: int | None = Query(default=None, ge=1),
    asset_id: int | None = Query(default=None, ge=1),
    txn_type: str | None = Query(default=None, min_length=3, max_length=20),
    status_filter: str | None = Query(default=None, alias="status", min_length=4, max_length=20),
    from_at: datetime | None = Query(default=None, alias="from"),
    to_at: datetime | None = Query(default=None, alias="to"),
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> TradePageOut:
    query_text = q.strip() if q else None
    filters = [Transaction.owner_user_id == current_user.id]

    if portfolio_id is not None:
        filters.append(Transaction.portfolio_id == portfolio_id)
    if asset_id is not None:
        filters.append(Transaction.asset_id == asset_id)
    if txn_type:
        filters.append(Transaction.txn_type == txn_type.upper().strip())
    if status_filter:
        filters.append(Transaction.status == status_filter.upper().strip())
    if from_at is not None:
        filters.append(Transaction.executed_at >= from_at)
    if to_at is not None:
        filters.append(Transaction.executed_at <= to_at)
    if query_text:
        like = f"%{query_text}%"
        filters.append(
            or_(
                Transaction.memo.ilike(like),
                Transaction.currency.ilike(like),
                Transaction.txn_type.ilike(like),
                Portfolio.name.ilike(like),
                Asset.name.ilike(like),
                Asset.symbol.ilike(like),
            )
        )

    count_stmt = (
        select(func.count())
        .select_from(Transaction)
        .join(Portfolio, Portfolio.id == Transaction.portfolio_id)
        .outerjoin(Asset, Asset.id == Transaction.asset_id)
        .where(*filters)
    )
    total = int(db.scalar(count_stmt) or 0)

    sort_column_map: dict[TransactionSortBy, object] = {
        TransactionSortBy.ID: Transaction.id,
        TransactionSortBy.EXECUTED_AT: Transaction.executed_at,
        TransactionSortBy.TXN_TYPE: Transaction.txn_type,
        TransactionSortBy.PORTFOLIO_ID: Transaction.portfolio_id,
        TransactionSortBy.PORTFOLIO_NAME: Portfolio.name,
        TransactionSortBy.ASSET_ID: Transaction.asset_id,
        TransactionSortBy.ASSET_NAME: Asset.name,
        TransactionSortBy.AMOUNT: Transaction.amount,
        TransactionSortBy.AMOUNT_IN_PORTFOLIO_CURRENCY: Transaction.amount_in_portfolio_currency,
        TransactionSortBy.CURRENCY: Transaction.currency,
        TransactionSortBy.STATUS: Transaction.status,
        TransactionSortBy.UPDATED_AT: Transaction.updated_at,
    }
    sort_column = sort_column_map[sort_by]
    order_expr = sort_column.asc() if sort_order == SortOrder.ASC else sort_column.desc()

    stmt: Select = (
        select(Transaction, Portfolio.name, Asset.name, Asset.symbol)
        .join(Portfolio, Portfolio.id == Transaction.portfolio_id)
        .outerjoin(Asset, Asset.id == Transaction.asset_id)
        .where(*filters)
        .order_by(order_expr, Transaction.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    rows = db.execute(stmt).all()

    items = [
        TradeRowOut(
            id=txn.id,
            owner_user_id=txn.owner_user_id,
            portfolio_id=txn.portfolio_id,
            asset_id=txn.asset_id,
            txn_type=txn.txn_type,
            quantity=txn.quantity,
            unit_price=txn.unit_price,
            amount=txn.amount,
            currency=txn.currency,
            amount_in_portfolio_currency=txn.amount_in_portfolio_currency,
            fx_rate_used=txn.fx_rate_used,
            fx_as_of=txn.fx_as_of,
            fx_source=txn.fx_source,
            executed_at=txn.executed_at,
            memo=txn.memo,
            source_type=txn.source_type,
            auto_apply_cash_holding=txn.auto_apply_cash_holding,
            auto_apply_portfolio_cashflow=txn.auto_apply_portfolio_cashflow,
            status=txn.status,
            created_at=txn.created_at,
            updated_at=txn.updated_at,
            portfolio_name=portfolio_name,
            asset_name=asset_name,
            asset_symbol=asset_symbol,
        )
        for txn, portfolio_name, asset_name, asset_symbol in rows
    ]
    return TradePageOut(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order,
        q=query_text,
    )


@router.post("", response_model=TradeOut, status_code=status.HTTP_201_CREATED)
def create_trade(
    payload: TradeCreate,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> TradeOut:
    try:
        normalized = normalize_trade_payload(
            db=db,
            owner_user_id=current_user.id,
            payload=payload.model_dump(),
            strict_fx=settings.fx_strict_mode,
        )
    except MissingFxRateError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Missing FX rate for {exc.from_currency}->{exc.to_currency}. Please refresh FX quotes.",
        ) from exc
    except TradeSyncError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    txn = Transaction(owner_user_id=current_user.id, **normalized)
    db.add(txn)
    try:
        db.flush()
        sync_single_trade_scope(
            db=db,
            owner_user_id=current_user.id,
            portfolio_id=txn.portfolio_id,
            asset_id=txn.asset_id,
        )
        db.commit()
    except TradeSyncError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - defensive fallback
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create trade") from exc

    db.refresh(txn)
    return _to_trade_out(txn)


@router.patch("/{transaction_id}", response_model=TradeOut)
def update_trade(
    transaction_id: int,
    payload: TradeUpdate,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> TradeOut:
    txn = _get_owned_transaction(db, current_user.id, transaction_id)
    if txn.status == "VOID":
        raise HTTPException(status_code=400, detail="VOID transaction cannot be updated")

    old_scope = (txn.portfolio_id, txn.asset_id)
    merged = {
        "portfolio_id": txn.portfolio_id,
        "txn_type": txn.txn_type,
        "asset_id": txn.asset_id,
        "quantity": txn.quantity,
        "unit_price": txn.unit_price,
        "amount": txn.amount,
        "currency": txn.currency,
        "executed_at": txn.executed_at,
        "memo": txn.memo,
        "source_type": txn.source_type,
        "auto_apply_cash_holding": txn.auto_apply_cash_holding,
        "auto_apply_portfolio_cashflow": txn.auto_apply_portfolio_cashflow,
    }
    updates = payload.model_dump(exclude_unset=True)
    merged.update(updates)

    try:
        normalized = normalize_trade_payload(
            db=db,
            owner_user_id=current_user.id,
            payload=merged,
            strict_fx=settings.fx_strict_mode,
        )
    except MissingFxRateError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Missing FX rate for {exc.from_currency}->{exc.to_currency}. Please refresh FX quotes.",
        ) from exc
    except TradeSyncError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    for key, value in normalized.items():
        setattr(txn, key, value)

    new_scope = (txn.portfolio_id, txn.asset_id)

    try:
        db.flush()
        sync_single_trade_scope(
            db=db,
            owner_user_id=current_user.id,
            portfolio_id=new_scope[0],
            asset_id=new_scope[1],
        )
        if old_scope != new_scope:
            sync_single_trade_scope(
                db=db,
                owner_user_id=current_user.id,
                portfolio_id=old_scope[0],
                asset_id=old_scope[1],
            )
        db.commit()
    except TradeSyncError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - defensive fallback
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update trade") from exc

    db.refresh(txn)
    return _to_trade_out(txn)


@router.post("/{transaction_id}/void", response_model=TradeOut)
def void_trade(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> TradeOut:
    txn = _get_owned_transaction(db, current_user.id, transaction_id)
    if txn.status == "VOID":
        raise HTTPException(status_code=400, detail="Transaction already VOID")

    txn.status = "VOID"
    try:
        db.flush()
        sync_single_trade_scope(
            db=db,
            owner_user_id=current_user.id,
            portfolio_id=txn.portfolio_id,
            asset_id=txn.asset_id,
        )
        db.commit()
    except TradeSyncError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - defensive fallback
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to void trade") from exc

    db.refresh(txn)
    return _to_trade_out(txn)


@router.post("/rebuild", response_model=TradeRebuildOut)
def rebuild_trade_totals(
    payload: TradeRebuildIn,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> TradeRebuildOut:
    try:
        result = rebuild_trade_scope(
            db=db,
            owner_user_id=current_user.id,
            portfolio_id=payload.portfolio_id,
            asset_id=payload.asset_id,
        )
        db.commit()
    except TradeSyncError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - defensive fallback
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to rebuild trade totals") from exc

    return TradeRebuildOut(
        owner_user_id=current_user.id,
        portfolio_id=payload.portfolio_id,
        asset_id=payload.asset_id,
        affected_portfolios=result.affected_portfolios,
        affected_holdings=result.affected_holdings,
    )


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trade_hard_disabled(
    transaction_id: int,
    _db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(get_current_user),
) -> Response:
    # Hard delete is intentionally disabled for auditability.
    raise HTTPException(
        status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
        detail=f"Hard delete is disabled. Use /trades/{transaction_id}/void",
    )
