from datetime import date, datetime, time
from decimal import Decimal

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_min_role
from app.models.asset import Asset
from app.models.dividend import (
    AssetProviderIdentifier,
    DividendReceipt,
    DividendSnapshot,
    DividendSnapshotAssetRow,
    DividendSnapshotPortfolioRow,
)
from app.models.portfolio import Portfolio
from app.models.transaction import Transaction
from app.schemas.dividend import (
    AssetProviderIdentifierIn,
    AssetProviderIdentifierOut,
    DividendLookupOut,
    DividendReceiptCreateIn,
    DividendReceiptOut,
    DividendReceiptPageOut,
    DividendReceiptUpdateIn,
    DividendSchedulerStatusOut,
    DividendSnapshotSummaryOut,
    DividendTableOut,
    DividendTableRowOut,
    DividendUpdateJobStartOut,
    DividendUpdateJobStatusOut,
)
from app.services.dividend_income import create_dividend_receipt_transaction, get_latest_dividend_snapshot
from app.services.dividend_provider import (
    DividendProviderError,
    fetch_alpha_vantage_stock_dividends,
    fetch_data_go_kr_stock_dividends,
    fetch_dividends_for_asset,
)
from app.services.dividend_update_jobs import (
    create_dividend_update_job,
    get_active_dividend_update_job,
    get_dividend_update_job,
    run_dividend_update_job,
)
from app.services.trade_ledger import TradeSyncError, sync_single_trade_scope
from app.services.user_seed import SeedUser
from app.tasks.dividends_scheduler import get_dividend_scheduler_status

router = APIRouter(prefix="/dividends", tags=["dividends"])


def _raise_provider_error(exc: DividendProviderError) -> None:
    raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


def _hide_raw(payload: DividendLookupOut, *, include_raw: bool) -> DividendLookupOut:
    if include_raw:
        return payload
    payload.items = [item.model_copy(update={"raw": None}) for item in payload.items]
    return payload


def _snapshot_out(snapshot: DividendSnapshot) -> DividendSnapshotSummaryOut:
    return DividendSnapshotSummaryOut(
        id=snapshot.id,
        scope_type=snapshot.scope_type,
        scope_id=snapshot.scope_id,
        display_currency=snapshot.display_currency,
        dividend_year=snapshot.dividend_year,
        snapshot_date=snapshot.snapshot_date,
        as_of=snapshot.as_of,
        expected_annual_gross=snapshot.expected_annual_gross,
        expected_annual_tax=snapshot.expected_annual_tax,
        expected_annual_net=snapshot.expected_annual_net,
        received_ytd_gross=snapshot.received_ytd_gross,
        received_ytd_tax=snapshot.received_ytd_tax,
        received_ytd_net=snapshot.received_ytd_net,
        source=snapshot.source,
    )


def _receipt_out(row: DividendReceipt, portfolio: Portfolio | None = None, asset: Asset | None = None) -> DividendReceiptOut:
    return DividendReceiptOut(
        id=row.id,
        owner_user_id=row.owner_user_id,
        portfolio_id=row.portfolio_id,
        portfolio_name=portfolio.name if portfolio is not None else None,
        asset_id=row.asset_id,
        asset_name=asset.name if asset is not None else None,
        symbol=asset.symbol if asset is not None else None,
        transaction_id=row.transaction_id,
        received_date=row.received_date,
        currency=row.currency,
        gross_amount=row.gross_amount,
        withholding_tax=row.withholding_tax,
        net_amount=row.net_amount,
        tax_rate_pct=row.tax_rate_pct,
        tax_country=row.tax_country,
        status=row.status,
        source_type=row.source_type,
        memo=row.memo,
        created_at=row.created_at,
        updated_at=row.updated_at,
    )


@router.get("/providers/data-go-kr/stock", response_model=DividendLookupOut)
def get_data_go_kr_stock_dividends(
    stock_name: str | None = Query(default=None, description="주식발행회사명. 예: 삼성전자"),
    crno: str | None = Query(default=None, description="법인등록번호. 예: 삼성전자 1301110006246"),
    isin_code: str | None = Query(default=None, description="ISIN code. 예: KR7005930003"),
    bas_dt: str | None = Query(default=None, description="기준일자 YYYYMMDD. 비우면 전체 최신 적재 기준에서 조회"),
    year: int | None = Query(default=None, ge=1900, le=2200),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=100, ge=1, le=1000),
    max_pages: int = Query(default=5, ge=1, le=20),
    tax_rate_pct: Decimal = Query(default=Decimal("15.4"), ge=0, le=100),
    include_raw: bool = Query(default=False),
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(get_current_user),
) -> DividendLookupOut:
    if not any([stock_name, crno, isin_code]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One of stock_name, crno, or isin_code is required.",
        )
    try:
        result = fetch_data_go_kr_stock_dividends(
            db,
            stock_name=stock_name,
            crno=crno,
            isin_code=isin_code,
            bas_dt=bas_dt,
            year=year,
            page=page,
            page_size=page_size,
            max_pages=max_pages,
            tax_rate_pct=tax_rate_pct,
        )
    except DividendProviderError as exc:
        _raise_provider_error(exc)
    return _hide_raw(result, include_raw=include_raw)


@router.get("/providers/alpha-vantage/stock", response_model=DividendLookupOut)
def get_alpha_vantage_stock_dividends(
    symbol: str = Query(..., min_length=1, max_length=32, description="US ticker. 예: VOO"),
    year: int | None = Query(default=None, ge=1900, le=2200),
    tax_rate_pct: Decimal = Query(default=Decimal("15"), ge=0, le=100),
    include_raw: bool = Query(default=False),
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(get_current_user),
) -> DividendLookupOut:
    try:
        result = fetch_alpha_vantage_stock_dividends(
            db,
            symbol=symbol,
            year=year,
            tax_rate_pct=tax_rate_pct,
        )
    except DividendProviderError as exc:
        _raise_provider_error(exc)
    return _hide_raw(result, include_raw=include_raw)


@router.get("/assets/{asset_id}/events", response_model=DividendLookupOut)
def get_asset_dividend_events(
    asset_id: int,
    year: int | None = Query(default=None, ge=1900, le=2200),
    tax_rate_pct: Decimal | None = Query(default=None, ge=0, le=100),
    include_raw: bool = Query(default=False),
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(get_current_user),
) -> DividendLookupOut:
    asset = db.scalar(select(Asset).where(Asset.id == asset_id))
    if asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
    try:
        result = fetch_dividends_for_asset(
            db,
            asset=asset,
            year=year,
            tax_rate_pct=tax_rate_pct,
        )
    except DividendProviderError as exc:
        _raise_provider_error(exc)
    return _hide_raw(result, include_raw=include_raw)


@router.post("/update-now", response_model=DividendUpdateJobStartOut, status_code=status.HTTP_202_ACCEPTED)
def update_dividends_now(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> DividendUpdateJobStartOut:
    _ = db
    active = get_active_dividend_update_job()
    if active is not None:
        return DividendUpdateJobStartOut(
            job_id=active.job_id,
            status=active.status,
            created_at=active.created_at,
            total_assets=active.total_assets,
        )

    job = create_dividend_update_job()
    background_tasks.add_task(run_dividend_update_job, job.job_id)
    return DividendUpdateJobStartOut(
        job_id=job.job_id,
        status=job.status,
        created_at=job.created_at,
        total_assets=job.total_assets,
    )


@router.get("/update-jobs/{job_id}", response_model=DividendUpdateJobStatusOut)
def get_dividend_update_job_status(
    job_id: str,
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> DividendUpdateJobStatusOut:
    _ = db
    job = get_dividend_update_job(job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dividend update job not found")
    return DividendUpdateJobStatusOut(
        job_id=job.job_id,
        status=job.status,
        created_at=job.created_at,
        started_at=job.started_at,
        finished_at=job.finished_at,
        total_assets=job.total_assets,
        processed_assets=job.processed_assets,
        updated_count=job.updated_count,
        skipped_count=job.skipped_count,
        failed_count=job.failed_count,
        errors=job.errors,
        snapshot_collected=job.snapshot_collected,
        snapshot_currency=job.snapshot_currency,
        snapshot_date=job.snapshot_date,
        snapshot_user_scopes=job.snapshot_user_scopes,
        snapshot_error=job.snapshot_error,
    )


@router.get("/scheduler/status", response_model=DividendSchedulerStatusOut)
def get_scheduler_status(
    _current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> DividendSchedulerStatusOut:
    return DividendSchedulerStatusOut(**get_dividend_scheduler_status())


@router.get("/identifiers", response_model=list[AssetProviderIdentifierOut])
def list_asset_provider_identifiers(
    asset_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> list[AssetProviderIdentifierOut]:
    stmt = select(AssetProviderIdentifier).order_by(
        AssetProviderIdentifier.provider.asc(),
        AssetProviderIdentifier.asset_id.asc(),
        AssetProviderIdentifier.identifier_type.asc(),
    )
    if asset_id is not None:
        stmt = stmt.where(AssetProviderIdentifier.asset_id == asset_id)
    return [
        AssetProviderIdentifierOut(
            id=row.id,
            asset_id=row.asset_id,
            provider=row.provider,
            identifier_type=row.identifier_type,
            identifier_value=row.identifier_value,
            market=row.market,
            is_primary=row.is_primary,
            created_at=row.created_at,
            updated_at=row.updated_at,
        )
        for row in db.scalars(stmt).all()
    ]


@router.put("/identifiers", response_model=AssetProviderIdentifierOut)
def upsert_asset_provider_identifier(
    payload: AssetProviderIdentifierIn,
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> AssetProviderIdentifierOut:
    asset = db.get(Asset, payload.asset_id)
    if asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
    provider = payload.provider.upper().strip()
    identifier_type = payload.identifier_type.upper().strip()
    row = db.scalar(
        select(AssetProviderIdentifier).where(
            AssetProviderIdentifier.asset_id == payload.asset_id,
            AssetProviderIdentifier.provider == provider,
            AssetProviderIdentifier.identifier_type == identifier_type,
        )
    )
    if row is None:
        row = AssetProviderIdentifier(
            asset_id=payload.asset_id,
            provider=provider,
            identifier_type=identifier_type,
        )
        db.add(row)
    row.identifier_value = payload.identifier_value.strip()
    row.market = payload.market
    row.is_primary = payload.is_primary
    db.commit()
    db.refresh(row)
    return AssetProviderIdentifierOut(
        id=row.id,
        asset_id=row.asset_id,
        provider=row.provider,
        identifier_type=row.identifier_type,
        identifier_value=row.identifier_value,
        market=row.market,
        is_primary=row.is_primary,
        created_at=row.created_at,
        updated_at=row.updated_at,
    )


@router.delete("/identifiers/{identifier_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_asset_provider_identifier(
    identifier_id: int,
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> None:
    row = db.get(AssetProviderIdentifier, identifier_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Identifier not found")
    db.delete(row)
    db.commit()


@router.get("/receipts", response_model=DividendReceiptPageOut)
def list_dividend_receipts(
    year: int | None = Query(default=None, ge=1900, le=2200),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> DividendReceiptPageOut:
    stmt = select(DividendReceipt).where(DividendReceipt.owner_user_id == current_user.id)
    if year is not None:
        stmt = stmt.where(
            DividendReceipt.received_date >= date(year, 1, 1),
            DividendReceipt.received_date <= date(year, 12, 31),
        )
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = int(db.scalar(count_stmt) or 0)
    rows = list(
        db.scalars(
            stmt.order_by(DividendReceipt.received_date.desc(), DividendReceipt.id.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        ).all()
    )
    portfolios = {row.id: row for row in db.scalars(select(Portfolio).where(Portfolio.id.in_([r.portfolio_id for r in rows] or [-1]))).all()}
    assets = {row.id: row for row in db.scalars(select(Asset).where(Asset.id.in_([r.asset_id for r in rows if r.asset_id] or [-1]))).all()}
    return DividendReceiptPageOut(
        items=[_receipt_out(row, portfolios.get(row.portfolio_id), assets.get(row.asset_id)) for row in rows],
        total=total,
    )


@router.post("/receipts", response_model=DividendReceiptOut, status_code=status.HTTP_201_CREATED)
def create_dividend_receipt(
    payload: DividendReceiptCreateIn,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> DividendReceiptOut:
    portfolio = db.scalar(
        select(Portfolio).where(Portfolio.id == payload.portfolio_id, Portfolio.owner_user_id == current_user.id)
    )
    if portfolio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found")
    asset = db.get(Asset, payload.asset_id) if payload.asset_id is not None else None
    gross = Decimal(payload.gross_amount)
    tax = Decimal(payload.withholding_tax or 0)
    net = Decimal(payload.net_amount) if payload.net_amount is not None else gross - tax
    if net < 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="net_amount cannot be negative")
    received_at = datetime.combine(payload.received_date, time.min)
    try:
        txn = create_dividend_receipt_transaction(
            db,
            owner_user_id=current_user.id,
            portfolio_id=payload.portfolio_id,
            asset_id=payload.asset_id,
            received_at=received_at,
            currency=payload.currency.upper(),
            net_amount=net,
            memo=payload.memo,
        )
        row = DividendReceipt(
            owner_user_id=current_user.id,
            portfolio_id=payload.portfolio_id,
            asset_id=payload.asset_id,
            transaction_id=txn.id,
            received_date=payload.received_date,
            currency=payload.currency.upper(),
            gross_amount=gross,
            withholding_tax=tax,
            net_amount=net,
            tax_rate_pct=payload.tax_rate_pct,
            tax_country=payload.tax_country,
            status="POSTED",
            source_type="MANUAL",
            memo=payload.memo,
        )
        db.add(row)
        db.commit()
    except TradeSyncError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    db.refresh(row)
    return _receipt_out(row, portfolio, asset)


@router.patch("/receipts/{receipt_id}", response_model=DividendReceiptOut)
def update_dividend_receipt(
    receipt_id: int,
    payload: DividendReceiptUpdateIn,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> DividendReceiptOut:
    row = db.scalar(select(DividendReceipt).where(DividendReceipt.id == receipt_id, DividendReceipt.owner_user_id == current_user.id))
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dividend receipt not found")
    updates = payload.model_dump(exclude_unset=True, mode="python")
    for key, value in updates.items():
        if key == "status" and value is not None:
            value = str(value).upper()
        setattr(row, key, value)
    if "gross_amount" in updates or "withholding_tax" in updates or "net_amount" in updates:
        gross = Decimal(row.gross_amount or 0)
        tax = Decimal(row.withholding_tax or 0)
        row.net_amount = Decimal(updates["net_amount"]) if "net_amount" in updates and updates["net_amount"] is not None else gross - tax
    txn = db.get(Transaction, row.transaction_id) if row.transaction_id is not None else None
    if txn is not None:
        txn.amount = row.net_amount
        txn.currency = row.currency
        txn.executed_at = datetime.combine(row.received_date, time.min)
        txn.memo = row.memo
        txn.status = "VOID" if row.status == "VOID" else "POSTED"
        try:
            sync_single_trade_scope(
                db,
                owner_user_id=current_user.id,
                portfolio_id=row.portfolio_id,
                asset_id=row.asset_id,
                liability_id=None,
            )
        except TradeSyncError as exc:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    db.commit()
    db.refresh(row)
    portfolio = db.get(Portfolio, row.portfolio_id)
    asset = db.get(Asset, row.asset_id) if row.asset_id else None
    return _receipt_out(row, portfolio, asset)


@router.delete("/receipts/{receipt_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dividend_receipt(
    receipt_id: int,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> None:
    row = db.scalar(select(DividendReceipt).where(DividendReceipt.id == receipt_id, DividendReceipt.owner_user_id == current_user.id))
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dividend receipt not found")
    txn = db.get(Transaction, row.transaction_id) if row.transaction_id is not None else None
    if txn is not None:
        txn.status = "VOID"
        try:
            sync_single_trade_scope(
                db,
                owner_user_id=current_user.id,
                portfolio_id=row.portfolio_id,
                asset_id=row.asset_id,
                liability_id=None,
            )
        except TradeSyncError as exc:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    db.delete(row)
    db.commit()


@router.get("/table", response_model=DividendTableOut)
def get_dividend_table(
    display_currency: str = Query(default="KRW", min_length=3, max_length=3),
    year: int | None = Query(default=None, ge=1900, le=2200),
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> DividendTableOut:
    snapshot = get_latest_dividend_snapshot(
        db,
        owner_user_id=current_user.id,
        display_currency=display_currency.upper(),
        dividend_year=year,
    )
    if snapshot is None:
        return DividendTableOut(
            configured=False,
            display_currency=display_currency.upper(),
            dividend_year=year or datetime.now().year,
            snapshot=None,
            rows=[],
            portfolio_rows=[],
            as_of=None,
        )

    asset_rows = list(
        db.scalars(
            select(DividendSnapshotAssetRow)
            .where(DividendSnapshotAssetRow.dividend_snapshot_id == snapshot.id)
            .order_by(DividendSnapshotAssetRow.expected_annual_net_display.desc(), DividendSnapshotAssetRow.asset_name.asc())
        ).all()
    )
    portfolio_rows = list(
        db.scalars(
            select(DividendSnapshotPortfolioRow)
            .where(DividendSnapshotPortfolioRow.dividend_snapshot_id == snapshot.id)
            .order_by(DividendSnapshotPortfolioRow.expected_annual_net_display.desc(), DividendSnapshotPortfolioRow.portfolio_name.asc())
        ).all()
    )
    return DividendTableOut(
        configured=True,
        display_currency=snapshot.display_currency,
        dividend_year=snapshot.dividend_year,
        snapshot=_snapshot_out(snapshot),
        rows=[
            DividendTableRowOut(
                portfolio_id=row.portfolio_id,
                portfolio_name=row.portfolio_name,
                asset_id=row.asset_id,
                asset_name=row.asset_name,
                symbol=row.symbol,
                quantity=row.quantity,
                currency=row.dividend_currency,
                expected_annual_gross=row.expected_annual_gross_display,
                expected_annual_tax=row.expected_annual_tax_display,
                expected_annual_net=row.expected_annual_net_display,
                received_ytd_gross=row.received_ytd_gross_display,
                received_ytd_tax=row.received_ytd_tax_display,
                received_ytd_net=row.received_ytd_net_display,
                dividend_yield_pct=row.dividend_yield_pct,
                tax_rate_pct=row.tax_rate_pct,
                payment_months=row.payment_months_json or [],
                status=row.status,
            )
            for row in asset_rows
        ],
        portfolio_rows=[
            {
                "portfolio_id": row.portfolio_id,
                "portfolio_name": row.portfolio_name,
                "portfolio_type": row.portfolio_type,
                "base_currency": row.base_currency,
                "expected_annual_gross": row.expected_annual_gross_display,
                "expected_annual_tax": row.expected_annual_tax_display,
                "expected_annual_net": row.expected_annual_net_display,
                "received_ytd_gross": row.received_ytd_gross_display,
                "received_ytd_tax": row.received_ytd_tax_display,
                "received_ytd_net": row.received_ytd_net_display,
                "dividend_yield_pct": row.dividend_yield_pct,
            }
            for row in portfolio_rows
        ],
        as_of=snapshot.as_of,
    )
