from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.db import get_db
from app.models.liability import Liability
from app.models.portfolio import Portfolio
from app.schemas.asset import SortOrder
from app.schemas.liability import (
    LiabilityCreate,
    LiabilityHiddenUpdate,
    LiabilityOut,
    LiabilityTablePageOut,
    LiabilityTableRowOut,
    LiabilityTableSortBy,
    LiabilityUpdate,
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
) -> Liability:
    data = payload.model_dump()
    _validate_portfolio(db, current_user.id, data.get("portfolio_id"))

    liability = Liability(owner_user_id=current_user.id, **data)
    db.add(liability)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid liability payload") from exc

    db.refresh(liability)
    return liability


@router.patch("/{liability_id}", response_model=LiabilityOut)
def update_liability(
    liability_id: int,
    payload: LiabilityUpdate,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Liability:
    liability = _get_owned_liability(db, liability_id, current_user.id)

    updates = payload.model_dump(exclude_unset=True)
    next_portfolio_id = updates.get("portfolio_id", liability.portfolio_id)
    _validate_portfolio(db, current_user.id, next_portfolio_id)

    for key, value in updates.items():
        setattr(liability, key, value)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid liability payload") from exc

    db.refresh(liability)
    return liability


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
    db.delete(liability)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

