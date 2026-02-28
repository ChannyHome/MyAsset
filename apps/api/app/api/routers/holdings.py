from datetime import UTC, datetime
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import Select, func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.db import get_db
from app.models.asset import Asset
from app.models.latest_quote import LatestQuote
from app.models.household import HouseholdMember
from app.models.holding import Holding
from app.models.portfolio import Portfolio
from app.models.transaction import Transaction
from app.schemas.holding import (
    HoldingCreate,
    HoldingHiddenUpdate,
    HoldingOut,
    HoldingTablePageOut,
    HoldingTableRowOut,
    HoldingTableSortBy,
    HoldingUpdate,
)
from app.schemas.asset import SortOrder
from app.schemas.entity_change import EditMode, HoldingRebaselineIn, RebaselineOut
from app.schemas.performance import HoldingPerformanceOut
from app.services.trade_ledger import TradeSyncError, ensure_holding_baseline_transaction
from app.services.entity_change_log import (
    EntityLogInput,
    actor_from_user,
    snapshot_holding,
    write_entity_change_log,
)
from app.services.entity_rebaseline import RebaselineConflictError, rebaseline_holding
from app.services.currency import FxCache, MissingFxRateError, convert_amount
from app.services.user_seed import SeedUser

router = APIRouter(prefix="/holdings", tags=["holdings"])


def _validate_references(
    db: Session,
    owner_user_id: int,
    asset_id: int,
    portfolio_id: int | None,
) -> None:
    asset = db.scalar(select(Asset).where(Asset.id == asset_id))
    if asset is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Asset does not exist")

    if portfolio_id is not None:
        portfolio = db.scalar(select(Portfolio).where(Portfolio.id == portfolio_id, Portfolio.owner_user_id == owner_user_id))
        if portfolio is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Portfolio does not exist")


def _get_owned_holding(db: Session, holding_id: int, owner_user_id: int) -> Holding:
    holding = db.scalar(select(Holding).where(Holding.id == holding_id, Holding.owner_user_id == owner_user_id))
    if holding is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Holding not found")
    return holding


def _ensure_unique_holding(
    db: Session,
    owner_user_id: int,
    portfolio_id: int | None,
    asset_id: int,
    exclude_holding_id: int | None = None,
) -> None:
    stmt = select(Holding).where(
        Holding.owner_user_id == owner_user_id,
        Holding.portfolio_id == portfolio_id,
        Holding.asset_id == asset_id,
    )
    if exclude_holding_id is not None:
        stmt = stmt.where(Holding.id != exclude_holding_id)

    exists = db.scalar(stmt)
    if exists is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Holding already exists for the same portfolio and asset",
        )


def _is_maintainer_plus(role: str | None) -> bool:
    normalized = (role or "").upper()
    return normalized in {"MAINTAINER", "ADMIN"}


def _has_posted_holding_trades(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int | None,
    asset_id: int,
) -> bool:
    if portfolio_id is None:
        return False
    existing_id = db.scalar(
        select(Transaction.id).where(
            Transaction.owner_user_id == owner_user_id,
            Transaction.portfolio_id == portfolio_id,
            Transaction.asset_id == asset_id,
            Transaction.status == "POSTED",
            Transaction.txn_type.in_(("BUY", "SELL")),
        ).limit(1)
    )
    return existing_id is not None


def _resolve_scope_user_ids(
    db: Session,
    current_user: SeedUser,
    scope_type: str | None,
    scope_id: int | None,
) -> list[int]:
    if scope_type is None:
        return [current_user.id]

    normalized_scope_type = scope_type.upper()
    if normalized_scope_type == "USER":
        target_user_id = scope_id or current_user.id
        if target_user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only your own USER scope is allowed")
        return [target_user_id]

    if normalized_scope_type in {"HOUSEHOLD", "GROUP"}:
        if scope_id is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="scope_id is required for HOUSEHOLD scope")

        is_member = db.scalar(
            select(HouseholdMember).where(
                HouseholdMember.household_id == scope_id,
                HouseholdMember.user_id == current_user.id,
            )
        )
        if is_member is None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not a member of this household")

        member_rows = db.scalars(
            select(HouseholdMember.user_id).where(HouseholdMember.household_id == scope_id)
        ).all()
        return list(member_rows)

    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="scope_type must be USER or HOUSEHOLD")


def _latest_quote_map(db: Session, asset_ids: list[int]) -> dict[int, LatestQuote]:
    if not asset_ids:
        return {}

    stmt = (
        select(LatestQuote).where(LatestQuote.asset_id.in_(asset_ids))
    )
    rows = db.scalars(stmt).all()
    latest: dict[int, LatestQuote] = {}
    for quote in rows:
        if quote.asset_id not in latest:
            latest[quote.asset_id] = quote
    return latest


@router.get("", response_model=list[HoldingOut])
def list_holdings(
    scope_type: str | None = None,
    scope_id: int | None = None,
    include_hidden: bool = False,
    include_excluded_portfolios: bool = False,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> list[Holding]:
    scope_user_ids = _resolve_scope_user_ids(
        db=db,
        current_user=current_user,
        scope_type=scope_type,
        scope_id=scope_id,
    )

    stmt: Select[tuple[Holding]] = (
        select(Holding)
        .outerjoin(Portfolio, Holding.portfolio_id == Portfolio.id)
        .where(Holding.owner_user_id.in_(scope_user_ids))
    )
    if not include_hidden:
        stmt = stmt.where(Holding.is_hidden.is_(False))
        stmt = stmt.where(or_(Holding.portfolio_id.is_(None), Portfolio.is_hidden.is_(False)))

    if not include_excluded_portfolios:
        stmt = stmt.where(or_(Holding.portfolio_id.is_(None), Portfolio.is_included.is_(True)))

    stmt = stmt.order_by(Holding.id.desc())
    return list(db.scalars(stmt).all())


@router.get("/table", response_model=HoldingTablePageOut)
def list_holdings_table(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=200),
    sort_by: HoldingTableSortBy = Query(default=HoldingTableSortBy.UPDATED_AT),
    sort_order: SortOrder = Query(default=SortOrder.DESC),
    q: str | None = Query(default=None, min_length=1, max_length=100),
    display_currency: str | None = Query(default=None, min_length=3, max_length=3),
    include_hidden: bool = True,
    include_excluded_portfolios: bool = True,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> HoldingTablePageOut:
    query_text = q.strip() if q else None
    evaluated_expr = Holding.quantity * func.coalesce(LatestQuote.price, Holding.avg_price)
    invested_expr = func.coalesce(Holding.invested_amount, Holding.quantity * Holding.avg_price)
    pnl_pct_expr = ((evaluated_expr - invested_expr) / func.nullif(invested_expr, 0)) * 100

    filters = [Holding.owner_user_id == current_user.id]
    if not include_hidden:
        filters.append(Holding.is_hidden.is_(False))
        filters.append(or_(Holding.portfolio_id.is_(None), Portfolio.is_hidden.is_(False)))
    if not include_excluded_portfolios:
        filters.append(or_(Holding.portfolio_id.is_(None), Portfolio.is_included.is_(True)))
    if query_text:
        like = f"%{query_text}%"
        filters.append(
            or_(
                Asset.name.ilike(like),
                Asset.symbol.ilike(like),
                Asset.asset_class.ilike(like),
                Portfolio.name.ilike(like),
                Holding.memo.ilike(like),
            )
        )

    count_stmt = (
        select(func.count())
        .select_from(Holding)
        .join(Asset, Asset.id == Holding.asset_id)
        .outerjoin(Portfolio, Holding.portfolio_id == Portfolio.id)
        .where(*filters)
    )
    total = int(db.scalar(count_stmt) or 0)

    sort_column_map = {
        HoldingTableSortBy.ID: Holding.id,
        HoldingTableSortBy.PORTFOLIO_NAME: Portfolio.name,
        HoldingTableSortBy.ASSET_NAME: Asset.name,
        HoldingTableSortBy.ASSET_SYMBOL: Asset.symbol,
        HoldingTableSortBy.QUANTITY: Holding.quantity,
        HoldingTableSortBy.AVG_PRICE: Holding.avg_price,
        HoldingTableSortBy.INVESTED_AMOUNT: invested_expr,
        HoldingTableSortBy.CURRENT_PRICE: LatestQuote.price,
        HoldingTableSortBy.EVALUATED_AMOUNT: evaluated_expr,
        HoldingTableSortBy.PNL_PCT: pnl_pct_expr,
        HoldingTableSortBy.SOURCE_TYPE: Holding.source_type,
        HoldingTableSortBy.IS_HIDDEN: Holding.is_hidden,
        HoldingTableSortBy.UPDATED_AT: Holding.updated_at,
        HoldingTableSortBy.QUOTE_AS_OF: LatestQuote.as_of,
    }
    sort_column = sort_column_map[sort_by]
    order_expr = sort_column.asc() if sort_order == SortOrder.ASC else sort_column.desc()

    stmt = (
        select(Holding, Asset, Portfolio, LatestQuote)
        .join(Asset, Asset.id == Holding.asset_id)
        .outerjoin(Portfolio, Holding.portfolio_id == Portfolio.id)
        .outerjoin(LatestQuote, LatestQuote.asset_id == Holding.asset_id)
        .where(*filters)
        .order_by(order_expr, Holding.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    rows = db.execute(stmt).all()

    items: list[HoldingTableRowOut] = []
    target_currency = (display_currency or "").upper()
    fx_cache: FxCache = {}
    try:
        for holding, asset, portfolio, quote in rows:
            invested_amount = holding.invested_amount or (holding.quantity * holding.avg_price)
            invested_currency = holding.invested_amount_currency if holding.invested_amount is not None else holding.avg_price_currency
            price = quote.price if quote else None
            price_currency = quote.currency if quote else holding.avg_price_currency
            evaluated_amount = holding.quantity * (price if price is not None else holding.avg_price)

            avg_price = holding.avg_price
            avg_price_currency = holding.avg_price_currency
            current_price = price
            current_price_currency = quote.currency if quote else None

            if target_currency:
                avg_price = convert_amount(
                    db=db,
                    amount=holding.avg_price,
                    from_currency=holding.avg_price_currency,
                    to_currency=target_currency,
                    cache=fx_cache,
                    strict=settings.fx_strict_mode,
                )
                avg_price_currency = target_currency
                invested_amount = convert_amount(
                    db=db,
                    amount=invested_amount,
                    from_currency=invested_currency,
                    to_currency=target_currency,
                    cache=fx_cache,
                    strict=settings.fx_strict_mode,
                )
                invested_currency = target_currency
                evaluated_amount = convert_amount(
                    db=db,
                    amount=evaluated_amount,
                    from_currency=price_currency,
                    to_currency=target_currency,
                    cache=fx_cache,
                    strict=settings.fx_strict_mode,
                )
                if current_price is not None and current_price_currency is not None:
                    current_price = convert_amount(
                        db=db,
                        amount=current_price,
                        from_currency=current_price_currency,
                        to_currency=target_currency,
                        cache=fx_cache,
                        strict=settings.fx_strict_mode,
                    )
                    current_price_currency = target_currency

            pnl_amount = evaluated_amount - invested_amount
            pnl_pct: Decimal | None = None
            if invested_amount != 0:
                pnl_pct = (pnl_amount / invested_amount) * Decimal("100")

            items.append(
                HoldingTableRowOut(
                    id=holding.id,
                    owner_user_id=holding.owner_user_id,
                    portfolio_id=holding.portfolio_id,
                    asset_id=holding.asset_id,
                    quantity=holding.quantity,
                    avg_price=avg_price,
                    avg_price_currency=avg_price_currency,
                    invested_amount=invested_amount,
                    invested_amount_currency=invested_currency,
                    source_type=holding.source_type,
                    is_hidden=holding.is_hidden,
                    memo=holding.memo,
                    created_at=holding.created_at,
                    updated_at=holding.updated_at,
                    portfolio_name=portfolio.name if portfolio else None,
                    asset_name=asset.name,
                    asset_symbol=asset.symbol,
                    asset_class=asset.asset_class,
                    asset_currency=asset.currency,
                    current_price=current_price,
                    current_price_currency=current_price_currency,
                    avg_cost=avg_price,
                    avg_cost_currency=avg_price_currency,
                    cost_basis_total=invested_amount,
                    cost_basis_currency=invested_currency,
                    evaluated_amount=evaluated_amount,
                    pnl_amount=pnl_amount,
                    pnl_pct=pnl_pct,
                    quote_as_of=quote.as_of if quote else None,
                    quote_source=quote.source if quote else None,
                )
            )
    except MissingFxRateError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Missing FX rate for {exc.from_currency}->{exc.to_currency}. Please refresh FX quotes.",
        ) from exc

    return HoldingTablePageOut(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order,
        q=query_text,
    )


@router.get("/performance", response_model=list[HoldingPerformanceOut])
def list_holdings_performance(
    scope_type: str | None = None,
    scope_id: int | None = None,
    display_currency: str | None = Query(default=None, min_length=3, max_length=3),
    include_hidden: bool = False,
    include_excluded_portfolios: bool = False,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> list[HoldingPerformanceOut]:
    scope_user_ids = _resolve_scope_user_ids(
        db=db,
        current_user=current_user,
        scope_type=scope_type,
        scope_id=scope_id,
    )

    stmt: Select[tuple[Holding, Asset]] = (
        select(Holding, Asset)
        .join(Asset, Asset.id == Holding.asset_id)
        .outerjoin(Portfolio, Holding.portfolio_id == Portfolio.id)
        .where(Holding.owner_user_id.in_(scope_user_ids))
    )

    if not include_hidden:
        stmt = stmt.where(Holding.is_hidden.is_(False))
        stmt = stmt.where(or_(Holding.portfolio_id.is_(None), Portfolio.is_hidden.is_(False)))

    if not include_excluded_portfolios:
        stmt = stmt.where(or_(Holding.portfolio_id.is_(None), Portfolio.is_included.is_(True)))

    rows = db.execute(stmt.order_by(Holding.id.desc())).all()
    quote_map = _latest_quote_map(db, [asset.id for _, asset in rows])
    target_currency = (display_currency or "").upper()
    fx_cache: FxCache = {}

    result: list[HoldingPerformanceOut] = []
    try:
        for holding, asset in rows:
            invested = holding.invested_amount or (holding.quantity * holding.avg_price)
            invested_currency = (
                holding.invested_amount_currency if holding.invested_amount is not None else holding.avg_price_currency
            )
            quote = quote_map.get(asset.id)

            current_price = quote.price if quote else None
            current_ccy = quote.currency if quote else None
            quote_as_of = quote.as_of if quote else None

            evaluated_amount = (holding.quantity * current_price) if current_price is not None else None

            avg_price = holding.avg_price
            avg_price_currency = holding.avg_price_currency
            if target_currency:
                avg_price = convert_amount(
                    db=db,
                    amount=holding.avg_price,
                    from_currency=holding.avg_price_currency,
                    to_currency=target_currency,
                    cache=fx_cache,
                    strict=settings.fx_strict_mode,
                )
                avg_price_currency = target_currency
                invested = convert_amount(
                    db=db,
                    amount=invested,
                    from_currency=invested_currency,
                    to_currency=target_currency,
                    cache=fx_cache,
                    strict=settings.fx_strict_mode,
                )
                invested_currency = target_currency
                if current_price is not None and current_ccy is not None:
                    current_price = convert_amount(
                        db=db,
                        amount=current_price,
                        from_currency=current_ccy,
                        to_currency=target_currency,
                        cache=fx_cache,
                        strict=settings.fx_strict_mode,
                    )
                    current_ccy = target_currency
                if evaluated_amount is not None and quote is not None:
                    evaluated_amount = convert_amount(
                        db=db,
                        amount=evaluated_amount,
                        from_currency=quote.currency or asset.currency,
                        to_currency=target_currency,
                        cache=fx_cache,
                        strict=settings.fx_strict_mode,
                    )

            pnl_amount = (evaluated_amount - invested) if evaluated_amount is not None else None
            pnl_pct = ((pnl_amount / invested) * 100) if (pnl_amount is not None and invested != 0) else None

            result.append(
                HoldingPerformanceOut(
                    holding_id=holding.id,
                    owner_user_id=holding.owner_user_id,
                    portfolio_id=holding.portfolio_id,
                    asset_id=asset.id,
                    asset_symbol=asset.symbol,
                    asset_name=asset.name,
                    asset_class=asset.asset_class,
                    quantity=holding.quantity,
                    avg_price=avg_price,
                    avg_price_currency=avg_price_currency,
                    avg_cost=avg_price,
                    avg_cost_currency=avg_price_currency,
                    invested_amount=invested,
                    invested_amount_currency=invested_currency,
                    cost_basis_total=invested,
                    cost_basis_currency=invested_currency,
                    current_price=current_price,
                    current_price_currency=current_ccy,
                    evaluated_amount=evaluated_amount,
                    pnl_amount=pnl_amount,
                    pnl_pct=pnl_pct,
                    quote_as_of=quote_as_of,
                )
            )
    except MissingFxRateError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Missing FX rate for {exc.from_currency}->{exc.to_currency}. Please refresh FX quotes.",
        ) from exc

    return result


@router.post("", response_model=HoldingOut, status_code=status.HTTP_201_CREATED)
def create_holding(
    payload: HoldingCreate,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Holding:
    actor_user_id, actor_email = actor_from_user(current_user)
    data = payload.model_dump()
    data["avg_price_currency"] = (data.get("avg_price_currency") or "KRW").upper()
    data["invested_amount_currency"] = (data.get("invested_amount_currency") or "KRW").upper()
    _validate_references(
        db=db,
        owner_user_id=current_user.id,
        asset_id=data["asset_id"],
        portfolio_id=data["portfolio_id"],
    )
    _ensure_unique_holding(
        db=db,
        owner_user_id=current_user.id,
        portfolio_id=data["portfolio_id"],
        asset_id=data["asset_id"],
    )

    holding = Holding(owner_user_id=current_user.id, **data)
    db.add(holding)
    try:
        db.flush()
        if holding.portfolio_id is not None:
            ensure_holding_baseline_transaction(
                db=db,
                owner_user_id=current_user.id,
                portfolio_id=holding.portfolio_id,
                asset_id=holding.asset_id,
                executed_at=datetime.now(UTC).replace(tzinfo=None),
                strict_fx=settings.fx_strict_mode,
            )
        write_entity_change_log(
            db,
            EntityLogInput(
                entity_type="HOLDING",
                entity_id=holding.id,
                owner_user_id=current_user.id,
                action="CREATE",
                before=None,
                after=snapshot_holding(holding),
                reason=None,
                actor_user_id=actor_user_id,
                actor_email=actor_email,
            ),
        )
        db.commit()
    except MissingFxRateError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Missing FX rate for {exc.from_currency}->{exc.to_currency}. Please refresh FX quotes.",
        ) from exc
    except TradeSyncError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid holding payload") from exc
    db.refresh(holding)
    return holding


@router.patch("/{holding_id}", response_model=HoldingOut)
def update_holding(
    holding_id: int,
    payload: HoldingUpdate,
    edit_mode: EditMode = Query(default=EditMode.SAFE),
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Holding:
    holding = _get_owned_holding(db, holding_id, current_user.id)
    actor_user_id, actor_email = actor_from_user(current_user)
    before_snapshot = snapshot_holding(holding)
    updates = payload.model_dump(exclude_unset=True)
    if "avg_price_currency" in updates and updates["avg_price_currency"] is not None:
        updates["avg_price_currency"] = updates["avg_price_currency"].upper()
    if "invested_amount_currency" in updates and updates["invested_amount_currency"] is not None:
        updates["invested_amount_currency"] = updates["invested_amount_currency"].upper()

    next_asset_id = updates.get("asset_id", holding.asset_id)
    next_portfolio_id = updates.get("portfolio_id", holding.portfolio_id)
    _validate_references(
        db=db,
        owner_user_id=current_user.id,
        asset_id=next_asset_id,
        portfolio_id=next_portfolio_id,
    )
    _ensure_unique_holding(
        db=db,
        owner_user_id=current_user.id,
        portfolio_id=next_portfolio_id,
        asset_id=next_asset_id,
        exclude_holding_id=holding.id,
    )

    ledger_fields = {
        "quantity",
        "avg_price",
        "avg_price_currency",
        "invested_amount",
        "invested_amount_currency",
        "source_type",
    }
    touches_ledger_fields = any(field in updates for field in ledger_fields)
    if edit_mode == EditMode.HARD and not _is_maintainer_plus(current_user.role):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="HARD edit requires MAINTAINER+")

    if (
        edit_mode == EditMode.SAFE
        and touches_ledger_fields
        and _has_posted_holding_trades(
            db,
            owner_user_id=current_user.id,
            portfolio_id=next_portfolio_id,
            asset_id=next_asset_id,
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ledger-managed holding has posted BUY/SELL trades. Use /holdings/{id}/rebaseline or edit_mode=HARD.",
        )

    for key, value in updates.items():
        setattr(holding, key, value)

    try:
        db.flush()
        if edit_mode == EditMode.SAFE and holding.portfolio_id is not None:
            ensure_holding_baseline_transaction(
                db=db,
                owner_user_id=current_user.id,
                portfolio_id=holding.portfolio_id,
                asset_id=holding.asset_id,
                executed_at=datetime.now(UTC).replace(tzinfo=None),
                strict_fx=settings.fx_strict_mode,
            )
        after_snapshot = snapshot_holding(holding)
        write_entity_change_log(
            db,
            EntityLogInput(
                entity_type="HOLDING",
                entity_id=holding.id,
                owner_user_id=current_user.id,
                action="UPDATE_HARD" if edit_mode == EditMode.HARD else "UPDATE_SAFE",
                before=before_snapshot,
                after=after_snapshot,
                reason=None,
                actor_user_id=actor_user_id,
                actor_email=actor_email,
            ),
        )
        db.commit()
    except MissingFxRateError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Missing FX rate for {exc.from_currency}->{exc.to_currency}. Please refresh FX quotes.",
        ) from exc
    except TradeSyncError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid holding payload") from exc
    db.refresh(holding)
    return holding


@router.post("/{holding_id}/rebaseline", response_model=RebaselineOut)
def rebaseline_holding_endpoint(
    holding_id: int,
    payload: HoldingRebaselineIn,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> RebaselineOut:
    holding = _get_owned_holding(db, holding_id, current_user.id)
    actor_user_id, actor_email = actor_from_user(current_user)
    before_snapshot = snapshot_holding(holding)
    try:
        result = rebaseline_holding(
            db=db,
            owner_user_id=current_user.id,
            holding=holding,
            payload=payload,
            strict_fx=settings.fx_strict_mode,
        )
        db.flush()
        db.refresh(holding)
        write_entity_change_log(
            db,
            EntityLogInput(
                entity_type="HOLDING",
                entity_id=holding.id,
                owner_user_id=current_user.id,
                action="REBASELINE",
                before=before_snapshot,
                after=snapshot_holding(holding),
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
        entity_type="HOLDING",
        entity_id=holding.id,
        voided_transactions=result.voided_transactions,
        baseline_transaction_ids=result.baseline_transaction_ids,
        affected_scope=result.affected_scope,
    )


@router.patch("/{holding_id}/hidden", response_model=HoldingOut)
def set_holding_hidden(
    holding_id: int,
    payload: HoldingHiddenUpdate,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Holding:
    holding = _get_owned_holding(db, holding_id, current_user.id)
    holding.is_hidden = payload.is_hidden
    db.commit()
    db.refresh(holding)
    return holding


@router.delete("/{holding_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_holding(
    holding_id: int,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Response:
    holding = _get_owned_holding(db, holding_id, current_user.id)
    actor_user_id, actor_email = actor_from_user(current_user)
    before_snapshot = snapshot_holding(holding)
    db.delete(holding)
    write_entity_change_log(
        db,
        EntityLogInput(
            entity_type="HOLDING",
            entity_id=holding_id,
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


