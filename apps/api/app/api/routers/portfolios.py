from datetime import UTC, datetime
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.db import get_db
from app.models.holding import Holding
from app.models.liability import Liability
from app.models.latest_quote import LatestQuote
from app.models.portfolio import Portfolio
from app.models.transaction import Transaction
from app.schemas.performance import PortfolioPerformanceOut
from app.schemas.asset import SortOrder
from app.schemas.entity_change import EditMode, PortfolioRebaselineIn, RebaselineOut
from app.schemas.portfolio import (
    PortfolioCreate,
    PortfolioCashAccountOut,
    PortfolioCashAccountSetIn,
    PortfolioOut,
    PortfolioTablePageOut,
    PortfolioTableRowOut,
    PortfolioTableSortBy,
    PortfolioUpdate,
)
from app.services.currency import FxCache, MissingFxRateError, convert_amount
from app.services.entity_change_log import (
    EntityLogInput,
    actor_from_user,
    snapshot_portfolio,
    write_entity_change_log,
)
from app.services.entity_rebaseline import RebaselineConflictError, rebaseline_portfolio
from app.services.trade_ledger import (
    TradeSyncError,
    ensure_portfolio_cash_account_for_currency,
    ensure_portfolio_cashflow_baseline_transactions,
    list_portfolio_cash_account_mappings,
    set_portfolio_cash_account_mapping,
)
from app.services.user_seed import SeedUser

router = APIRouter(prefix="/portfolios", tags=["portfolios"])


def _latest_quote_map(db: Session, asset_ids: list[int]) -> dict[int, LatestQuote]:
    if not asset_ids:
        return {}

    rows = db.scalars(select(LatestQuote).where(LatestQuote.asset_id.in_(asset_ids))).all()
    return {row.asset_id: row for row in rows}


def _normalize_sort_value(value: object) -> tuple[int, object]:
    if value is None:
        return (1, "")
    if isinstance(value, str):
        return (0, value.lower())
    if isinstance(value, bool):
        return (0, int(value))
    return (0, value)


def _get_owned_portfolio(db: Session, owner_user_id: int, portfolio_id: int) -> Portfolio:
    portfolio = db.scalar(select(Portfolio).where(Portfolio.id == portfolio_id, Portfolio.owner_user_id == owner_user_id))
    if portfolio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found")
    return portfolio


def _is_maintainer_plus(role: str | None) -> bool:
    normalized = (role or "").upper()
    return normalized in {"MAINTAINER", "ADMIN"}


def _has_posted_portfolio_cashflow_trades(db: Session, *, owner_user_id: int, portfolio_id: int) -> bool:
    existing_id = db.scalar(
        select(Transaction.id).where(
            Transaction.owner_user_id == owner_user_id,
            Transaction.portfolio_id == portfolio_id,
            Transaction.status == "POSTED",
            Transaction.txn_type.in_(("DEPOSIT", "WITHDRAW")),
        ).limit(1)
    )
    return existing_id is not None


@router.get("", response_model=list[PortfolioOut])
def list_portfolios(
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> list[Portfolio]:
    stmt = select(Portfolio).where(Portfolio.owner_user_id == current_user.id).order_by(Portfolio.id.desc())
    return list(db.scalars(stmt).all())


@router.get("/{portfolio_id}/cash-accounts", response_model=list[PortfolioCashAccountOut])
def list_portfolio_cash_accounts(
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> list[PortfolioCashAccountOut]:
    portfolio = _get_owned_portfolio(db, current_user.id, portfolio_id)

    rows = list_portfolio_cash_account_mappings(
        db,
        owner_user_id=current_user.id,
        portfolio_id=portfolio.id,
    )
    if not rows:
        try:
            ensure_portfolio_cash_account_for_currency(
                db,
                owner_user_id=current_user.id,
                portfolio_id=portfolio.id,
                currency=portfolio.base_currency,
            )
            db.commit()
        except TradeSyncError as exc:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
        rows = list_portfolio_cash_account_mappings(
            db,
            owner_user_id=current_user.id,
            portfolio_id=portfolio.id,
        )

    return [
        PortfolioCashAccountOut(
            id=mapping.id,
            owner_user_id=mapping.owner_user_id,
            portfolio_id=mapping.portfolio_id,
            currency=mapping.currency,
            asset_id=mapping.asset_id,
            asset_name=asset.name if asset is not None else None,
            asset_symbol=asset.symbol if asset is not None else None,
            created_at=mapping.created_at,
            updated_at=mapping.updated_at,
        )
        for mapping, asset in rows
    ]


@router.put("/{portfolio_id}/cash-accounts/{currency}", response_model=PortfolioCashAccountOut)
def upsert_portfolio_cash_account(
    portfolio_id: int,
    currency: str,
    payload: PortfolioCashAccountSetIn,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> PortfolioCashAccountOut:
    portfolio = _get_owned_portfolio(db, current_user.id, portfolio_id)
    try:
        mapping, _holding, asset = set_portfolio_cash_account_mapping(
            db,
            owner_user_id=current_user.id,
            portfolio_id=portfolio.id,
            currency=currency,
            asset_id=payload.asset_id,
        )
        db.commit()
    except TradeSyncError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid cash account mapping payload") from exc

    db.refresh(mapping)
    return PortfolioCashAccountOut(
        id=mapping.id,
        owner_user_id=mapping.owner_user_id,
        portfolio_id=mapping.portfolio_id,
        currency=mapping.currency,
        asset_id=mapping.asset_id,
        asset_name=asset.name,
        asset_symbol=asset.symbol,
        created_at=mapping.created_at,
        updated_at=mapping.updated_at,
    )


@router.get("/table", response_model=PortfolioTablePageOut)
def list_portfolios_table(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=200),
    sort_by: PortfolioTableSortBy = Query(default=PortfolioTableSortBy.UPDATED_AT),
    sort_order: SortOrder = Query(default=SortOrder.DESC),
    q: str | None = Query(default=None, min_length=1, max_length=100),
    portfolio_id: int | None = Query(default=None, ge=1),
    display_currency: str | None = Query(default=None, min_length=3, max_length=3),
    include_hidden: bool = True,
    include_excluded: bool = True,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> PortfolioTablePageOut:
    query_text = q.strip() if q else None
    filters = [Portfolio.owner_user_id == current_user.id]
    if portfolio_id is not None:
        filters.append(Portfolio.id == portfolio_id)
    if not include_hidden:
        filters.append(Portfolio.is_hidden.is_(False))
    if not include_excluded:
        filters.append(Portfolio.is_included.is_(True))
    if query_text:
        like = f"%{query_text}%"
        filters.append(
            or_(
                Portfolio.name.ilike(like),
                Portfolio.type.ilike(like),
                Portfolio.category.ilike(like),
                Portfolio.exchange_code.ilike(like),
                Portfolio.memo.ilike(like),
                Portfolio.base_currency.ilike(like),
            )
        )

    portfolios = list(db.scalars(select(Portfolio).where(*filters)).all())
    total = len(portfolios)
    if total == 0:
        return PortfolioTablePageOut(
            items=[],
            total=0,
            page=page,
            page_size=page_size,
            sort_by=sort_by,
            sort_order=sort_order,
            q=query_text,
        )

    portfolio_ids = [p.id for p in portfolios]
    holdings = list(
        db.scalars(
            select(Holding).where(
                Holding.owner_user_id == current_user.id,
                Holding.portfolio_id.in_(portfolio_ids),
                Holding.is_hidden.is_(False),
            )
        ).all()
    )
    liabilities = list(
        db.scalars(
            select(Liability).where(
                Liability.owner_user_id == current_user.id,
                Liability.portfolio_id.in_(portfolio_ids),
                Liability.is_hidden.is_(False),
                Liability.is_included.is_(True),
            )
        ).all()
    )

    quote_map = _latest_quote_map(db, sorted({item.asset_id for item in holdings}))
    fx_cache: FxCache = {}

    holdings_by_portfolio: dict[int, list[Holding]] = {pid: [] for pid in portfolio_ids}
    for holding in holdings:
        if holding.portfolio_id is None:
            continue
        holdings_by_portfolio.setdefault(holding.portfolio_id, []).append(holding)

    liabilities_by_portfolio: dict[int, list[Liability]] = {pid: [] for pid in portfolio_ids}
    for liability in liabilities:
        if liability.portfolio_id is None:
            continue
        liabilities_by_portfolio.setdefault(liability.portfolio_id, []).append(liability)

    items: list[PortfolioTableRowOut] = []
    try:
        for portfolio in portfolios:
            target_currency = (display_currency or portfolio.base_currency or "KRW").upper()
            portfolio_holdings = holdings_by_portfolio.get(portfolio.id, [])
            portfolio_liabilities = liabilities_by_portfolio.get(portfolio.id, [])

            gross_assets_total = Decimal("0")
            for holding in portfolio_holdings:
                quote = quote_map.get(holding.asset_id)
                if quote is None:
                    unit_price = holding.avg_price
                    unit_currency = holding.avg_price_currency
                else:
                    unit_price = quote.price
                    unit_currency = quote.currency or holding.avg_price_currency

                holding_value = holding.quantity * unit_price
                gross_assets_total += convert_amount(
                    db=db,
                    amount=holding_value,
                    from_currency=unit_currency,
                    to_currency=target_currency,
                    cache=fx_cache,
                    strict=settings.fx_strict_mode,
                )

            liabilities_total = Decimal("0")
            for liability in portfolio_liabilities:
                liabilities_total += convert_amount(
                    db=db,
                    amount=liability.outstanding_balance,
                    from_currency=liability.currency,
                    to_currency=target_currency,
                    cache=fx_cache,
                    strict=settings.fx_strict_mode,
                )

            converted_deposit = convert_amount(
                db=db,
                amount=portfolio.cumulative_deposit_amount,
                from_currency=portfolio.base_currency,
                to_currency=target_currency,
                cache=fx_cache,
                strict=settings.fx_strict_mode,
            )
            converted_withdrawal = convert_amount(
                db=db,
                amount=portfolio.cumulative_withdrawal_amount,
                from_currency=portfolio.base_currency,
                to_currency=target_currency,
                cache=fx_cache,
                strict=settings.fx_strict_mode,
            )

            net_assets_total = gross_assets_total - liabilities_total
            net_contribution_total = converted_deposit - converted_withdrawal
            principal_minus_debt_total = converted_deposit - liabilities_total
            net_assets_profit_total = net_assets_total - principal_minus_debt_total

            net_assets_return_pct = None
            if principal_minus_debt_total != 0:
                net_assets_return_pct = (net_assets_profit_total / principal_minus_debt_total) * Decimal("100")

            total_pnl_amount = gross_assets_total + converted_withdrawal - converted_deposit
            total_return_pct = None
            if converted_deposit != 0:
                total_return_pct = (total_pnl_amount / converted_deposit) * Decimal("100")

            items.append(
                PortfolioTableRowOut(
                    id=portfolio.id,
                    owner_user_id=portfolio.owner_user_id,
                    name=portfolio.name,
                    type=portfolio.type,
                    base_currency=target_currency,
                    exchange_code=portfolio.exchange_code,
                    category=portfolio.category,
                    memo=portfolio.memo,
                    is_included=portfolio.is_included,
                    is_hidden=portfolio.is_hidden,
                    cumulative_deposit_amount=converted_deposit,
                    cumulative_withdrawal_amount=converted_withdrawal,
                    cashflow_source_type=portfolio.cashflow_source_type,
                    created_at=portfolio.created_at,
                    updated_at=portfolio.updated_at,
                    holding_count=len(portfolio_holdings),
                    liability_count=len(portfolio_liabilities),
                    gross_assets_total=gross_assets_total,
                    liabilities_total=liabilities_total,
                    net_assets_total=net_assets_total,
                    net_contribution_total=net_contribution_total,
                    principal_minus_debt_total=principal_minus_debt_total,
                    debt_adjusted_principal_total=principal_minus_debt_total,
                    net_assets_profit_total=net_assets_profit_total,
                    net_assets_return_pct=net_assets_return_pct,
                    total_pnl_amount=total_pnl_amount,
                    portfolio_profit_total=total_pnl_amount,
                    total_return_pct=total_return_pct,
                )
            )
    except MissingFxRateError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Missing FX rate for {exc.from_currency}->{exc.to_currency}. Please refresh FX quotes.",
        ) from exc

    # Keep secondary ordering by id desc for ties.
    items.sort(key=lambda row: row.id, reverse=True)
    if sort_by in {PortfolioTableSortBy.PRINCIPAL_NET, PortfolioTableSortBy.NET_CONTRIBUTION_TOTAL}:
        items.sort(
            key=lambda row: _normalize_sort_value(row.cumulative_deposit_amount - row.cumulative_withdrawal_amount),
            reverse=(sort_order == SortOrder.DESC),
        )
    else:
        items.sort(
            key=lambda row: _normalize_sort_value(getattr(row, sort_by.value, None)),
            reverse=(sort_order == SortOrder.DESC),
        )

    start = (page - 1) * page_size
    end = start + page_size
    paged_items = items[start:end]

    return PortfolioTablePageOut(
        items=paged_items,
        total=total,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order,
        q=query_text,
    )


@router.get("/performance", response_model=list[PortfolioPerformanceOut])
def list_portfolios_performance(
    display_currency: str | None = Query(default=None, min_length=3, max_length=3),
    include_hidden: bool = Query(default=False),
    include_excluded: bool = Query(default=False),
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> list[PortfolioPerformanceOut]:
    portfolio_stmt = select(Portfolio).where(Portfolio.owner_user_id == current_user.id)
    if not include_hidden:
        portfolio_stmt = portfolio_stmt.where(Portfolio.is_hidden.is_(False))
    if not include_excluded:
        portfolio_stmt = portfolio_stmt.where(Portfolio.is_included.is_(True))

    portfolios = list(db.scalars(portfolio_stmt.order_by(Portfolio.id.desc())).all())
    if not portfolios:
        return []

    portfolio_ids = [p.id for p in portfolios]
    holdings_stmt = select(Holding).where(
        Holding.owner_user_id == current_user.id,
        Holding.portfolio_id.in_(portfolio_ids),
    )
    if not include_hidden:
        holdings_stmt = holdings_stmt.where(Holding.is_hidden.is_(False))

    holdings = list(db.scalars(holdings_stmt).all())
    quote_map = _latest_quote_map(db, sorted({item.asset_id for item in holdings}))
    fx_cache: FxCache = {}

    holdings_by_portfolio: dict[int, list[Holding]] = {p.id: [] for p in portfolios}
    for holding in holdings:
        if holding.portfolio_id is None:
            continue
        holdings_by_portfolio.setdefault(holding.portfolio_id, []).append(holding)

    result: list[PortfolioPerformanceOut] = []
    try:
        for portfolio in portfolios:
            target_currency = (display_currency or portfolio.base_currency or "KRW").upper()
            nav_amount = Decimal("0")
            missing_quote_count = 0
            latest_quote_as_of = None

            rows = holdings_by_portfolio.get(portfolio.id, [])
            for holding in rows:
                quote = quote_map.get(holding.asset_id)
                if quote is None:
                    missing_quote_count += 1
                    unit_price = holding.avg_price
                    unit_currency = holding.avg_price_currency
                else:
                    unit_price = quote.price
                    unit_currency = quote.currency or holding.avg_price_currency
                    if latest_quote_as_of is None or quote.as_of > latest_quote_as_of:
                        latest_quote_as_of = quote.as_of

                holding_value = holding.quantity * unit_price
                nav_amount += convert_amount(
                    db=db,
                    amount=holding_value,
                    from_currency=unit_currency,
                    to_currency=target_currency,
                    cache=fx_cache,
                    strict=settings.fx_strict_mode,
                )

            converted_deposit = convert_amount(
                db=db,
                amount=portfolio.cumulative_deposit_amount,
                from_currency=portfolio.base_currency,
                to_currency=target_currency,
                cache=fx_cache,
                strict=settings.fx_strict_mode,
            )
            converted_withdrawal = convert_amount(
                db=db,
                amount=portfolio.cumulative_withdrawal_amount,
                from_currency=portfolio.base_currency,
                to_currency=target_currency,
                cache=fx_cache,
                strict=settings.fx_strict_mode,
            )
            net_contribution_total = converted_deposit - converted_withdrawal

            total_pnl_amount = nav_amount + converted_withdrawal - converted_deposit
            total_return_pct = None
            if converted_deposit != 0:
                total_return_pct = (total_pnl_amount / converted_deposit) * Decimal("100")

            result.append(
                PortfolioPerformanceOut(
                    portfolio_id=portfolio.id,
                    name=portfolio.name,
                    type=portfolio.type,
                    base_currency=target_currency,
                    category=portfolio.category,
                    memo=portfolio.memo,
                    is_included=portfolio.is_included,
                    is_hidden=portfolio.is_hidden,
                    cashflow_source_type=portfolio.cashflow_source_type,
                    cumulative_deposit_amount=converted_deposit,
                    cumulative_withdrawal_amount=converted_withdrawal,
                    net_contribution_total=net_contribution_total,
                    nav_amount=nav_amount,
                    total_pnl_amount=total_pnl_amount,
                    portfolio_profit_total=total_pnl_amount,
                    total_return_pct=total_return_pct,
                    holding_count=len(rows),
                    missing_quote_count=missing_quote_count,
                    latest_quote_as_of=latest_quote_as_of,
                )
            )
    except MissingFxRateError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Missing FX rate for {exc.from_currency}->{exc.to_currency}. Please refresh FX quotes.",
        ) from exc

    return result


@router.post("", response_model=PortfolioOut, status_code=status.HTTP_201_CREATED)
def create_portfolio(
    payload: PortfolioCreate,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Portfolio:
    actor_user_id, actor_email = actor_from_user(current_user)
    portfolio_data = payload.model_dump()
    portfolio_data["base_currency"] = portfolio_data["base_currency"].upper()
    if portfolio_data.get("exchange_code"):
        portfolio_data["exchange_code"] = portfolio_data["exchange_code"].upper()

    portfolio = Portfolio(owner_user_id=current_user.id, **portfolio_data)
    db.add(portfolio)
    try:
        db.flush()
        ensure_portfolio_cashflow_baseline_transactions(
            db=db,
            owner_user_id=current_user.id,
            portfolio_id=portfolio.id,
            executed_at=datetime.now(UTC).replace(tzinfo=None),
        )
        ensure_portfolio_cash_account_for_currency(
            db=db,
            owner_user_id=current_user.id,
            portfolio_id=portfolio.id,
            currency=portfolio.base_currency,
        )
        write_entity_change_log(
            db,
            EntityLogInput(
                entity_type="PORTFOLIO",
                entity_id=portfolio.id,
                owner_user_id=current_user.id,
                action="CREATE",
                before=None,
                after=snapshot_portfolio(portfolio),
                reason=None,
                actor_user_id=actor_user_id,
                actor_email=actor_email,
            ),
        )
        db.commit()
    except TradeSyncError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid portfolio payload") from exc
    db.refresh(portfolio)
    return portfolio


@router.patch("/{portfolio_id}", response_model=PortfolioOut)
def update_portfolio(
    portfolio_id: int,
    payload: PortfolioUpdate,
    edit_mode: EditMode = Query(default=EditMode.SAFE),
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Portfolio:
    portfolio = db.scalar(select(Portfolio).where(Portfolio.id == portfolio_id, Portfolio.owner_user_id == current_user.id))
    if portfolio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found")

    actor_user_id, actor_email = actor_from_user(current_user)
    before_snapshot = snapshot_portfolio(portfolio)
    updates = payload.model_dump(exclude_unset=True)
    if "base_currency" in updates and updates["base_currency"] is not None:
        updates["base_currency"] = updates["base_currency"].upper()
    if "exchange_code" in updates and updates["exchange_code"] is not None:
        updates["exchange_code"] = updates["exchange_code"].upper()

    ledger_fields = {"cumulative_deposit_amount", "cumulative_withdrawal_amount"}
    touches_ledger_fields = any(field in updates for field in ledger_fields)
    if edit_mode == EditMode.HARD and not _is_maintainer_plus(current_user.role):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="HARD edit requires MAINTAINER+")
    if (
        edit_mode == EditMode.SAFE
        and touches_ledger_fields
        and _has_posted_portfolio_cashflow_trades(
            db,
            owner_user_id=current_user.id,
            portfolio_id=portfolio.id,
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ledger-managed portfolio cashflow has posted DEPOSIT/WITHDRAW trades. Use /portfolios/{id}/rebaseline or edit_mode=HARD.",
        )

    for key, value in updates.items():
        setattr(portfolio, key, value)

    try:
        db.flush()
        if edit_mode == EditMode.SAFE:
            ensure_portfolio_cashflow_baseline_transactions(
                db=db,
                owner_user_id=current_user.id,
                portfolio_id=portfolio.id,
                executed_at=datetime.now(UTC).replace(tzinfo=None),
            )
        ensure_portfolio_cash_account_for_currency(
            db=db,
            owner_user_id=current_user.id,
            portfolio_id=portfolio.id,
            currency=portfolio.base_currency,
        )
        write_entity_change_log(
            db,
            EntityLogInput(
                entity_type="PORTFOLIO",
                entity_id=portfolio.id,
                owner_user_id=current_user.id,
                action="UPDATE_HARD" if edit_mode == EditMode.HARD else "UPDATE_SAFE",
                before=before_snapshot,
                after=snapshot_portfolio(portfolio),
                reason=None,
                actor_user_id=actor_user_id,
                actor_email=actor_email,
            ),
        )
        db.commit()
    except TradeSyncError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid portfolio payload") from exc

    db.refresh(portfolio)
    return portfolio


@router.post("/{portfolio_id}/rebaseline", response_model=RebaselineOut)
def rebaseline_portfolio_endpoint(
    portfolio_id: int,
    payload: PortfolioRebaselineIn,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> RebaselineOut:
    portfolio = _get_owned_portfolio(db, current_user.id, portfolio_id)
    actor_user_id, actor_email = actor_from_user(current_user)
    before_snapshot = snapshot_portfolio(portfolio)
    try:
        result = rebaseline_portfolio(
            db=db,
            owner_user_id=current_user.id,
            portfolio=portfolio,
            payload=payload,
            strict_fx=settings.fx_strict_mode,
        )
        db.flush()
        db.refresh(portfolio)
        write_entity_change_log(
            db,
            EntityLogInput(
                entity_type="PORTFOLIO",
                entity_id=portfolio.id,
                owner_user_id=current_user.id,
                action="REBASELINE",
                before=before_snapshot,
                after=snapshot_portfolio(portfolio),
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
        entity_type="PORTFOLIO",
        entity_id=portfolio.id,
        voided_transactions=result.voided_transactions,
        baseline_transaction_ids=result.baseline_transaction_ids,
        affected_scope=result.affected_scope,
    )


@router.delete("/{portfolio_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_portfolio(
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> Response:
    portfolio = db.scalar(select(Portfolio).where(Portfolio.id == portfolio_id, Portfolio.owner_user_id == current_user.id))
    if portfolio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found")

    actor_user_id, actor_email = actor_from_user(current_user)
    before_snapshot = snapshot_portfolio(portfolio)
    db.delete(portfolio)
    try:
        write_entity_change_log(
            db,
            EntityLogInput(
                entity_type="PORTFOLIO",
                entity_id=portfolio_id,
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
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Portfolio is referenced by other records",
        ) from exc
    return Response(status_code=status.HTTP_204_NO_CONTENT)

