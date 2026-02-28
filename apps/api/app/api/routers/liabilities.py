from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.db import get_db
from app.models.asset import Asset
from app.models.holding import Holding
from app.models.liability import Liability
from app.models.portfolio import Portfolio
from app.models.transaction import Transaction
from app.schemas.asset import SortOrder
from app.schemas.entity_change import EditMode, LiabilityRebaselineIn, RebaselineOut
from app.schemas.liability import (
    LiabilityCreate,
    LiabilityHiddenUpdate,
    LiabilityOut,
    LiabilityTablePageOut,
    LiabilityTableRowOut,
    LiabilityTableSortBy,
    LiabilityUpdate,
)
from app.services.entity_change_log import (
    EntityLogInput,
    actor_from_user,
    snapshot_liability,
    write_entity_change_log,
)
from app.services.entity_rebaseline import RebaselineConflictError, rebaseline_liability
from app.services.trade_ledger import (
    TradeSyncError,
    ensure_liability_baseline_transaction,
    rebuild_cash_holding_from_trades,
)
from app.services.currency import FxCache, MissingFxRateError, convert_amount
from app.services.user_seed import SeedUser

router = APIRouter(prefix="/liabilities", tags=["liabilities"])


def _validate_portfolio(db: Session, owner_user_id: int, portfolio_id: int | None) -> None:
    if portfolio_id is None:
        return

    portfolio = db.scalar(select(Portfolio).where(Portfolio.id == portfolio_id, Portfolio.owner_user_id == owner_user_id))
    if portfolio is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Portfolio does not exist")


def _get_owned_liability(db: Session, liability_id: int, owner_user_id: int) -> Liability:
    liability = db.scalar(select(Liability).where(Liability.id == liability_id, Liability.owner_user_id == owner_user_id))
    if liability is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Liability not found")
    return liability


def _is_cash_asset(symbol: str | None, meta_json: object) -> bool:
    if symbol and symbol.upper().startswith("CASH_"):
        return True
    if isinstance(meta_json, dict):
        subtype = str(meta_json.get("asset_subtype") or "").upper()
        if subtype == "CASH_BALANCE":
            return True
    return False


def _has_cash_holding_for_currency(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
    currency: str,
) -> bool:
    normalized_currency = (currency or "KRW").upper().strip()
    rows = db.execute(
        select(Asset.symbol, Asset.meta_json)
        .join(Holding, Holding.asset_id == Asset.id)
        .where(
            Holding.owner_user_id == owner_user_id,
            Holding.portfolio_id == portfolio_id,
            Asset.currency == normalized_currency,
        )
    ).all()
    for symbol, meta_json in rows:
        if _is_cash_asset(symbol, meta_json):
            return True
    return False


def _is_maintainer_plus(role: str | None) -> bool:
    normalized = (role or "").upper()
    return normalized in {"MAINTAINER", "ADMIN"}


def _has_posted_liability_principal_trades(db: Session, *, owner_user_id: int, liability_id: int) -> bool:
    existing_id = db.scalar(
        select(Transaction.id).where(
            Transaction.owner_user_id == owner_user_id,
            Transaction.liability_id == liability_id,
            Transaction.status == "POSTED",
            Transaction.txn_type.in_(("LOAN_BORROW", "LOAN_REPAY")),
        ).limit(1)
    )
    return existing_id is not None


@router.get("", response_model=list[LiabilityOut])
def list_liabilities(
    include_hidden: bool = False,
    include_excluded: bool = False,
    display_currency: str | None = Query(default=None, min_length=3, max_length=3),
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> list[LiabilityOut]:
    stmt = select(Liability).where(Liability.owner_user_id == current_user.id)

    if not include_hidden:
        stmt = stmt.where(Liability.is_hidden.is_(False))

    if not include_excluded:
        stmt = stmt.where(Liability.is_included.is_(True))

    stmt = stmt.order_by(Liability.id.desc())
    rows = list(db.scalars(stmt).all())
    target_currency = (display_currency or "").upper()
    if not target_currency:
        return [LiabilityOut.model_validate(row) for row in rows]

    fx_cache: FxCache = {}
    try:
        converted_rows: list[LiabilityOut] = []
        for row in rows:
            outstanding_balance = convert_amount(
                db=db,
                amount=row.outstanding_balance,
                from_currency=row.currency,
                to_currency=target_currency,
                cache=fx_cache,
                strict=settings.fx_strict_mode,
            )
            monthly_payment = row.monthly_payment
            if monthly_payment is not None:
                monthly_payment = convert_amount(
                    db=db,
                    amount=monthly_payment,
                    from_currency=row.currency,
                    to_currency=target_currency,
                    cache=fx_cache,
                    strict=settings.fx_strict_mode,
                )
            converted_rows.append(
                LiabilityOut(
                    id=row.id,
                    owner_user_id=row.owner_user_id,
                    portfolio_id=row.portfolio_id,
                    name=row.name,
                    liability_type=row.liability_type,
                    currency=target_currency,
                    outstanding_balance=outstanding_balance,
                    interest_rate=row.interest_rate,
                    monthly_payment=monthly_payment,
                    source_type=row.source_type,
                    is_included=row.is_included,
                    is_hidden=row.is_hidden,
                    memo=row.memo,
                    created_at=row.created_at,
                    updated_at=row.updated_at,
                )
            )
    except MissingFxRateError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Missing FX rate for {exc.from_currency}->{exc.to_currency}. Please refresh FX quotes.",
        ) from exc

    return converted_rows


@router.get("/table", response_model=LiabilityTablePageOut)
def list_liabilities_table(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=200),
    sort_by: LiabilityTableSortBy = Query(default=LiabilityTableSortBy.UPDATED_AT),
    sort_order: SortOrder = Query(default=SortOrder.DESC),
    q: str | None = Query(default=None, min_length=1, max_length=100),
    display_currency: str | None = Query(default=None, min_length=3, max_length=3),
    include_hidden: bool = True,
    include_excluded: bool = True,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> LiabilityTablePageOut:
    query_text = q.strip() if q else None

    filters = [Liability.owner_user_id == current_user.id]
    if not include_hidden:
        filters.append(Liability.is_hidden.is_(False))
    if not include_excluded:
        filters.append(Liability.is_included.is_(True))
    if query_text:
        like = f"%{query_text}%"
        filters.append(
            or_(
                Liability.name.ilike(like),
                Liability.liability_type.ilike(like),
                Liability.memo.ilike(like),
                Portfolio.name.ilike(like),
                Liability.currency.ilike(like),
            )
        )

    count_stmt = (
        select(func.count())
        .select_from(Liability)
        .outerjoin(Portfolio, Liability.portfolio_id == Portfolio.id)
        .where(*filters)
    )
    total = int(db.scalar(count_stmt) or 0)

    sort_column_map = {
        LiabilityTableSortBy.ID: Liability.id,
        LiabilityTableSortBy.NAME: Liability.name,
        LiabilityTableSortBy.PORTFOLIO_NAME: Portfolio.name,
        LiabilityTableSortBy.LIABILITY_TYPE: Liability.liability_type,
        LiabilityTableSortBy.CURRENCY: Liability.currency,
        LiabilityTableSortBy.OUTSTANDING_BALANCE: Liability.outstanding_balance,
        LiabilityTableSortBy.INTEREST_RATE: Liability.interest_rate,
        LiabilityTableSortBy.MONTHLY_PAYMENT: Liability.monthly_payment,
        LiabilityTableSortBy.IS_INCLUDED: Liability.is_included,
        LiabilityTableSortBy.IS_HIDDEN: Liability.is_hidden,
        LiabilityTableSortBy.UPDATED_AT: Liability.updated_at,
    }
    sort_column = sort_column_map[sort_by]
    order_expr = sort_column.asc() if sort_order == SortOrder.ASC else sort_column.desc()

    stmt = (
        select(Liability, Portfolio.name)
        .outerjoin(Portfolio, Liability.portfolio_id == Portfolio.id)
        .where(*filters)
        .order_by(order_expr, Liability.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    rows = db.execute(stmt).all()

    target_currency = (display_currency or "").upper()
    fx_cache: FxCache = {}
    items: list[LiabilityTableRowOut] = []
    try:
        for liability, portfolio_name in rows:
            row_currency = liability.currency
            outstanding_balance = liability.outstanding_balance
            monthly_payment = liability.monthly_payment
            if target_currency:
                outstanding_balance = convert_amount(
                    db=db,
                    amount=outstanding_balance,
                    from_currency=row_currency,
                    to_currency=target_currency,
                    cache=fx_cache,
                    strict=settings.fx_strict_mode,
                )
                if monthly_payment is not None:
                    monthly_payment = convert_amount(
                        db=db,
                        amount=monthly_payment,
                        from_currency=row_currency,
                        to_currency=target_currency,
                        cache=fx_cache,
                        strict=settings.fx_strict_mode,
                    )
                row_currency = target_currency

            items.append(
                LiabilityTableRowOut(
                    id=liability.id,
                    owner_user_id=liability.owner_user_id,
                    portfolio_id=liability.portfolio_id,
                    name=liability.name,
                    liability_type=liability.liability_type,
                    currency=row_currency,
                    outstanding_balance=outstanding_balance,
                    interest_rate=liability.interest_rate,
                    monthly_payment=monthly_payment,
                    source_type=liability.source_type,
                    is_included=liability.is_included,
                    is_hidden=liability.is_hidden,
                    memo=liability.memo,
                    created_at=liability.created_at,
                    updated_at=liability.updated_at,
                    portfolio_name=portfolio_name,
                )
            )
    except MissingFxRateError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Missing FX rate for {exc.from_currency}->{exc.to_currency}. Please refresh FX quotes.",
        ) from exc

    return LiabilityTablePageOut(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order,
        q=query_text,
    )


@router.post("", response_model=LiabilityOut, status_code=status.HTTP_201_CREATED)
def create_liability(
    payload: LiabilityCreate,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> LiabilityOut:
    actor_user_id, actor_email = actor_from_user(current_user)
    data = payload.model_dump()
    _validate_portfolio(db, current_user.id, data.get("portfolio_id"))

    liability = Liability(owner_user_id=current_user.id, **data)
    db.add(liability)
    auto_cash_holding_created = False
    try:
        db.flush()
        if liability.portfolio_id is not None:
            ensure_liability_baseline_transaction(
                db=db,
                owner_user_id=current_user.id,
                portfolio_id=liability.portfolio_id,
                liability_id=liability.id,
                executed_at=datetime.now(UTC).replace(tzinfo=None),
                strict_fx=settings.fx_strict_mode,
            )
        if liability.portfolio_id is not None:
            had_cash_holding = _has_cash_holding_for_currency(
                db,
                owner_user_id=current_user.id,
                portfolio_id=liability.portfolio_id,
                currency=liability.currency,
            )
            rebuild_cash_holding_from_trades(
                db,
                owner_user_id=current_user.id,
                portfolio_id=liability.portfolio_id,
                currency=liability.currency,
            )
            auto_cash_holding_created = not had_cash_holding
        write_entity_change_log(
            db,
            EntityLogInput(
                entity_type="LIABILITY",
                entity_id=liability.id,
                owner_user_id=current_user.id,
                action="CREATE",
                before=None,
                after=snapshot_liability(liability),
                reason=None,
                actor_user_id=actor_user_id,
                actor_email=actor_email,
            ),
        )
        db.commit()
    except TradeSyncError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except MissingFxRateError as exc:
        db.rollback()
        raise HTTPException(
            status_code=503,
            detail=f"Missing FX rate for {exc.from_currency}->{exc.to_currency}. Please refresh FX quotes.",
        ) from exc
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid liability payload") from exc

    db.refresh(liability)
    return LiabilityOut.model_validate(liability).model_copy(
        update={"auto_cash_holding_created": auto_cash_holding_created}
    )


@router.patch("/{liability_id}", response_model=LiabilityOut)
def update_liability(
    liability_id: int,
    payload: LiabilityUpdate,
    edit_mode: EditMode = Query(default=EditMode.SAFE),
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> LiabilityOut:
    liability = _get_owned_liability(db, liability_id, current_user.id)
    actor_user_id, actor_email = actor_from_user(current_user)
    before_snapshot = snapshot_liability(liability)

    updates = payload.model_dump(exclude_unset=True)
    next_portfolio_id = updates.get("portfolio_id", liability.portfolio_id)
    _validate_portfolio(db, current_user.id, next_portfolio_id)

    if edit_mode == EditMode.HARD and not _is_maintainer_plus(current_user.role):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="HARD edit requires MAINTAINER+")

    ledger_fields = {"outstanding_balance"}
    touches_ledger_fields = any(field in updates for field in ledger_fields)
    if (
        edit_mode == EditMode.SAFE
        and touches_ledger_fields
        and _has_posted_liability_principal_trades(
            db,
            owner_user_id=current_user.id,
            liability_id=liability.id,
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ledger-managed liability has posted LOAN_BORROW/LOAN_REPAY trades. Use /liabilities/{id}/rebaseline or edit_mode=HARD.",
        )

    for key, value in updates.items():
        setattr(liability, key, value)

    auto_cash_holding_created = False
    try:
        db.flush()
        if edit_mode == EditMode.SAFE and liability.portfolio_id is not None:
            ensure_liability_baseline_transaction(
                db=db,
                owner_user_id=current_user.id,
                portfolio_id=liability.portfolio_id,
                liability_id=liability.id,
                executed_at=datetime.now(UTC).replace(tzinfo=None),
                strict_fx=settings.fx_strict_mode,
            )
        if liability.portfolio_id is not None:
            had_cash_holding = _has_cash_holding_for_currency(
                db,
                owner_user_id=current_user.id,
                portfolio_id=liability.portfolio_id,
                currency=liability.currency,
            )
            rebuild_cash_holding_from_trades(
                db,
                owner_user_id=current_user.id,
                portfolio_id=liability.portfolio_id,
                currency=liability.currency,
            )
            auto_cash_holding_created = not had_cash_holding
        write_entity_change_log(
            db,
            EntityLogInput(
                entity_type="LIABILITY",
                entity_id=liability.id,
                owner_user_id=current_user.id,
                action="UPDATE_HARD" if edit_mode == EditMode.HARD else "UPDATE_SAFE",
                before=before_snapshot,
                after=snapshot_liability(liability),
                reason=None,
                actor_user_id=actor_user_id,
                actor_email=actor_email,
            ),
        )
        db.commit()
    except TradeSyncError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except MissingFxRateError as exc:
        db.rollback()
        raise HTTPException(
            status_code=503,
            detail=f"Missing FX rate for {exc.from_currency}->{exc.to_currency}. Please refresh FX quotes.",
        ) from exc
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid liability payload") from exc

    db.refresh(liability)
    return LiabilityOut.model_validate(liability).model_copy(
        update={"auto_cash_holding_created": auto_cash_holding_created}
    )


@router.post("/{liability_id}/rebaseline", response_model=RebaselineOut)
def rebaseline_liability_endpoint(
    liability_id: int,
    payload: LiabilityRebaselineIn,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> RebaselineOut:
    liability = _get_owned_liability(db, liability_id, current_user.id)
    actor_user_id, actor_email = actor_from_user(current_user)
    before_snapshot = snapshot_liability(liability)
    try:
        result = rebaseline_liability(
            db=db,
            owner_user_id=current_user.id,
            liability=liability,
            payload=payload,
            strict_fx=settings.fx_strict_mode,
        )
        db.flush()
        db.refresh(liability)
        write_entity_change_log(
            db,
            EntityLogInput(
                entity_type="LIABILITY",
                entity_id=liability.id,
                owner_user_id=current_user.id,
                action="REBASELINE",
                before=before_snapshot,
                after=snapshot_liability(liability),
                reason=payload.reason,
                actor_user_id=actor_user_id,
                actor_email=actor_email,
            ),
        )
        db.commit()
    except RebaselineConflictError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    except MissingFxRateError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Missing FX rate for {exc.from_currency}->{exc.to_currency}. Please refresh FX quotes.",
        ) from exc
    except TradeSyncError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return RebaselineOut(
        entity_type="LIABILITY",
        entity_id=liability.id,
        voided_transactions=result.voided_transactions,
        baseline_transaction_ids=result.baseline_transaction_ids,
        affected_scope=result.affected_scope,
    )


@router.patch("/{liability_id}/hidden", response_model=LiabilityOut)
def set_liability_hidden(
    liability_id: int,
    payload: LiabilityHiddenUpdate,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Liability:
    liability = _get_owned_liability(db, liability_id, current_user.id)
    liability.is_hidden = payload.is_hidden
    db.commit()
    db.refresh(liability)
    return liability


@router.delete("/{liability_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_liability(
    liability_id: int,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Response:
    liability = _get_owned_liability(db, liability_id, current_user.id)
    actor_user_id, actor_email = actor_from_user(current_user)
    before_snapshot = snapshot_liability(liability)
    db.delete(liability)
    write_entity_change_log(
        db,
        EntityLogInput(
            entity_type="LIABILITY",
            entity_id=liability_id,
            owner_user_id=current_user.id,
            action="DELETE",
            before=before_snapshot,
            after=None,
            reason=None,
            actor_user_id=actor_user_id,
            actor_email=actor_email,
        ),
    )
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

