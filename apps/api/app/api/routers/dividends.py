from datetime import date, datetime, time
from decimal import Decimal

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_min_role
from app.models.asset import Asset
from app.models.dividend import (
    AssetDividendEvent,
    AssetDividendSetting,
    AssetProviderIdentifier,
    DividendReceipt,
    DividendSnapshot,
    DividendSnapshotAssetRow,
    DividendSnapshotPortfolioRow,
    DividendUpdateRun,
)
from app.models.holding import Holding
from app.models.portfolio import Portfolio
from app.models.transaction import Transaction
from app.schemas.dividend import (
    AssetDividendHistoryOut,
    AssetDividendSettingOut,
    AssetDividendSettingUpdateIn,
    AssetProviderIdentifierIn,
    AssetProviderIdentifierOut,
    DividendEventOut,
    DividendLookupOut,
    DividendReceiptCreateIn,
    DividendReceiptOut,
    DividendReceiptPageOut,
    DividendReceiptUpdateIn,
    DividendSchedulerStatusOut,
    DividendSnapshotSummaryOut,
    DividendStatusOut,
    DividendStatusRowOut,
    DividendStatusSummaryOut,
    DividendTableOut,
    DividendTableRowOut,
    DividendUpdateJobStartOut,
    DividendUpdateJobStatusOut,
    DividendUpdateRunOut,
    DividendUpdateRunPageOut,
)
from app.services.app_settings import get_financial_income_taxable_limit_krw
from app.services.dividend_income import (
    create_dividend_receipt_transaction,
    get_latest_dividend_snapshot,
    resolve_dividend_tax_context,
)
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


def _is_auto_cash_dividend_asset(asset: Asset | None) -> bool:
    if asset is None:
        return False
    meta = asset.meta_json or {}
    text = f"{asset.name or ''} {asset.symbol or ''} {meta.get('asset_type', '')}".upper()
    return asset.asset_class == "CASH" or "CASH_AUTO" in text or "AUTO CASH" in text


def _is_auto_cash_dividend_row(row: DividendSnapshotAssetRow) -> bool:
    text = f"{row.asset_name or ''} {row.symbol or ''}".upper()
    return "CASH_AUTO" in text or "AUTO CASH" in text


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


def _identifier_out(row: AssetProviderIdentifier) -> AssetProviderIdentifierOut:
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


def _setting_out(row: AssetDividendSetting) -> AssetDividendSettingOut:
    return AssetDividendSettingOut(
        id=row.id,
        asset_id=row.asset_id,
        is_enabled=row.is_enabled,
        tax_rate_pct=row.tax_rate_pct,
        tax_country=row.tax_country,
        dividend_currency=row.dividend_currency,
        manual_annual_dividend_per_share=row.manual_annual_dividend_per_share,
        manual_frequency=row.manual_frequency,
        payment_months=row.payment_months_json or [],
        note=row.note,
        created_at=row.created_at,
        updated_at=row.updated_at,
    )


def _asset_income_kind(row: DividendSnapshotAssetRow) -> str:
    return getattr(row, "income_kind", None) or "DIVIDEND"


def _default_income_kind_for_asset(asset: Asset) -> str:
    text = f"{asset.name or ''} {asset.symbol or ''} {(asset.meta_json or {}).get('asset_type', '')}".upper()
    distribution_markers = (
        "ETF",
        "KODEX",
        "TIGER",
        "ACE",
        "KBSTAR",
        "KOSEF",
        "SOL ",
        "RISE",
        "ARIRANG",
        "PLUS",
        "SMH",
        "SPYD",
        "SWAN",
        "TIP",
        "TLT",
        "VIG",
        "VOO",
        "VTI",
        "VTV",
        "VYM",
        "XLRE",
        "XLU",
        "XLV",
        "SCHD",
        "SPY",
    )
    return "DISTRIBUTION" if asset.asset_class in {"BOND", "ETC"} or any(marker in text for marker in distribution_markers) else "DIVIDEND"


def _upsert_dividend_events(db: Session, asset: Asset, items: list[DividendEventOut], *, fallback_year: int) -> int:
    updated = 0
    for event in items:
        row = db.scalar(
            select(AssetDividendEvent).where(
                AssetDividendEvent.asset_id == asset.id,
                AssetDividendEvent.provider == event.provider,
                AssetDividendEvent.provider_event_id == event.provider_event_id,
            )
        )
        if row is None:
            row = AssetDividendEvent(
                asset_id=asset.id,
                provider=event.provider,
                provider_event_id=event.provider_event_id,
                market=event.market,
            )
            db.add(row)
        row.symbol = event.symbol or asset.symbol
        row.isin_code = event.isin_code
        row.crno = event.crno
        row.asset_name = event.asset_name or asset.name
        row.dividend_type = event.dividend_type
        row.declaration_date = event.declaration_date
        row.ex_dividend_date = event.ex_dividend_date
        row.record_date = event.record_date
        row.payment_date = event.payment_date
        row.dividend_base_date = event.dividend_base_date
        row.fiscal_year = event.fiscal_year or fallback_year
        row.dividend_currency = event.dividend_currency
        row.dividend_per_share_gross = event.dividend_per_share_gross
        row.tax_rate_pct = event.tax_rate_pct
        row.withholding_tax_amount_per_share = event.withholding_tax_amount_per_share
        row.dividend_per_share_net_estimated = event.dividend_per_share_net_estimated
        row.status = "ESTIMATED"
        row.raw_json = event.raw
        updated += 1
    return updated


def _event_out(row: AssetDividendEvent) -> DividendEventOut:
    return DividendEventOut(
        provider=row.provider,
        provider_event_id=row.provider_event_id,
        market=row.market,
        symbol=row.symbol,
        isin_code=row.isin_code,
        crno=row.crno,
        asset_name=row.asset_name,
        dividend_type=row.dividend_type,
        declaration_date=row.declaration_date,
        ex_dividend_date=row.ex_dividend_date,
        record_date=row.record_date,
        payment_date=row.payment_date,
        dividend_base_date=row.dividend_base_date,
        fiscal_year=row.fiscal_year,
        dividend_currency=row.dividend_currency,
        dividend_per_share_gross=row.dividend_per_share_gross,
        tax_rate_pct=row.tax_rate_pct,
        withholding_tax_amount_per_share=row.withholding_tax_amount_per_share,
        dividend_per_share_net_estimated=row.dividend_per_share_net_estimated,
        raw=None,
    )


def _run_out(row: DividendUpdateRun) -> DividendUpdateRunOut:
    return DividendUpdateRunOut(
        id=row.id,
        run_type=row.run_type,
        status=row.status,
        scheduled_run_at=row.scheduled_run_at,
        started_at=row.started_at,
        finished_at=row.finished_at,
        duration_seconds=row.duration_seconds,
        total_assets=row.total_assets,
        processed_assets=row.processed_assets,
        updated_count=row.updated_count,
        skipped_count=row.skipped_count,
        failed_count=row.failed_count,
        errors=row.errors_json or [],
        snapshot_collected=row.snapshot_collected,
        snapshot_error=row.snapshot_error,
        error_message=row.error_message,
        created_at=row.created_at,
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


@router.post("/assets/{asset_id}/refresh", response_model=DividendLookupOut)
def refresh_asset_dividends(
    asset_id: int,
    year: int | None = Query(default=None, ge=1900, le=2200),
    tax_rate_pct: Decimal | None = Query(default=None, ge=0, le=100),
    include_raw: bool = Query(default=False),
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> DividendLookupOut:
    asset = db.scalar(select(Asset).where(Asset.id == asset_id))
    if asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
    target_year = int(year or datetime.now().year)
    try:
        lookups = [
            fetch_dividends_for_asset(
                db,
                asset=asset,
                year=fetch_year,
                tax_rate_pct=tax_rate_pct,
            )
            for fetch_year in (target_year, target_year - 1)
        ]
    except DividendProviderError as exc:
        _raise_provider_error(exc)
    items = [item for lookup in lookups for item in lookup.items]
    _upsert_dividend_events(db, asset, items, fallback_year=target_year)
    db.commit()
    result = DividendLookupOut(
        provider=lookups[0].provider,
        source=lookups[0].source,
        market=lookups[0].market,
        symbol=asset.symbol,
        asset_id=asset.id,
        asset_name=asset.name,
        display_name=asset.name,
        currency=lookups[0].currency,
        tax_rate_pct=lookups[0].tax_rate_pct,
        total_count=sum(lookup.total_count for lookup in lookups),
        returned_count=len(items),
        year=target_year,
        items=items,
        warnings=[warning for lookup in lookups for warning in lookup.warnings],
    )
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


@router.get("/status", response_model=DividendStatusOut)
def get_dividend_status(
    display_currency: str = Query(default="KRW", min_length=3, max_length=3),
    year: int | None = Query(default=None, ge=1900, le=2200),
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> DividendStatusOut:
    target_currency = display_currency.upper()
    target_year = year or datetime.now().year
    snapshot = get_latest_dividend_snapshot(
        db,
        owner_user_id=current_user.id,
        display_currency=target_currency,
        dividend_year=target_year,
    )
    snapshot_rows: list[DividendSnapshotAssetRow] = []
    if snapshot is not None:
        snapshot_rows = list(
            db.scalars(
                select(DividendSnapshotAssetRow)
                .where(DividendSnapshotAssetRow.dividend_snapshot_id == snapshot.id)
                .order_by(
                    DividendSnapshotAssetRow.expected_annual_net_display.desc(),
                    DividendSnapshotAssetRow.asset_name.asc(),
                )
            ).all()
        )
        snapshot_rows = [row for row in snapshot_rows if not _is_auto_cash_dividend_row(row)]

    held_rows = list(
        db.execute(
            select(Holding, Asset, Portfolio)
            .join(Asset, Asset.id == Holding.asset_id)
            .outerjoin(Portfolio, Portfolio.id == Holding.portfolio_id)
            .where(
                Holding.owner_user_id == current_user.id,
                Holding.quantity != 0,
                Asset.asset_class.in_(["STOCK", "BOND", "ETC"]),
            )
        ).all()
    )
    held_rows = [(holding, asset, portfolio) for holding, asset, portfolio in held_rows if not _is_auto_cash_dividend_asset(asset)]
    held_asset_ids = {int(asset.id) for _holding, asset, _portfolio in held_rows}
    snapshot_asset_ids = {int(row.asset_id) for row in snapshot_rows if row.asset_id is not None}
    asset_ids = sorted(held_asset_ids | snapshot_asset_ids)
    assets_by_id = {
        int(asset.id): asset
        for asset in db.scalars(select(Asset).where(Asset.id.in_(asset_ids or [-1]))).all()
    }
    portfolio_ids = sorted(
        {
            int(portfolio.id)
            for _holding, _asset, portfolio in held_rows
            if portfolio is not None
        }
        | {int(row.portfolio_id) for row in snapshot_rows if row.portfolio_id is not None}
    )
    portfolios_by_id = {
        int(portfolio.id): portfolio
        for portfolio in db.scalars(select(Portfolio).where(Portfolio.id.in_(portfolio_ids or [-1]))).all()
    }

    identifiers_by_asset: dict[int, list[AssetProviderIdentifier]] = {asset_id: [] for asset_id in asset_ids}
    for ident in db.scalars(select(AssetProviderIdentifier).where(AssetProviderIdentifier.asset_id.in_(asset_ids or [-1]))).all():
        identifiers_by_asset.setdefault(int(ident.asset_id), []).append(ident)

    settings_by_asset = {
        int(row.asset_id): row
        for row in db.scalars(select(AssetDividendSetting).where(AssetDividendSetting.asset_id.in_(asset_ids or [-1]))).all()
    }

    events_by_asset: dict[int, list[AssetDividendEvent]] = {asset_id: [] for asset_id in asset_ids}
    for event in db.scalars(
        select(AssetDividendEvent)
        .where(AssetDividendEvent.asset_id.in_(asset_ids or [-1]))
        .order_by(AssetDividendEvent.payment_date.desc(), AssetDividendEvent.ex_dividend_date.desc(), AssetDividendEvent.id.desc())
    ).all():
        events_by_asset.setdefault(int(event.asset_id), []).append(event)

    rows: list[DividendStatusRowOut] = []
    for row in snapshot_rows:
        asset_id = int(row.asset_id) if row.asset_id is not None else None
        identifiers = identifiers_by_asset.get(asset_id or -1, [])
        setting = settings_by_asset.get(asset_id or -1)
        events = events_by_asset.get(asset_id or -1, [])
        asset = assets_by_id.get(asset_id or -1)
        portfolio = portfolios_by_id.get(int(row.portfolio_id or 0))
        tax_context = resolve_dividend_tax_context(
            portfolio=portfolio,
            asset=asset,
            dividend_currency=row.dividend_currency,
            setting=setting,
        )
        warnings: list[str] = []
        if not identifiers:
            warnings.append("Missing provider identifier")
        if not events and setting is None:
            warnings.append("No provider events or manual dividend setting")
        status_value = row.status
        if setting is not None and not setting.is_enabled:
            status_value = "DISABLED"
        elif not identifiers:
            status_value = "MISSING_IDENTIFIER"
        elif not events and (setting is None or setting.manual_annual_dividend_per_share is None):
            status_value = "NO_EVENTS"
        source = "PROVIDER" if events else "MANUAL" if setting and setting.manual_annual_dividend_per_share is not None else "NONE"
        rows.append(
            DividendStatusRowOut(
                portfolio_id=row.portfolio_id,
                portfolio_name=row.portfolio_name,
                asset_id=row.asset_id,
                asset_name=row.asset_name,
                symbol=row.symbol,
                income_kind=_asset_income_kind(row),
                asset_currency=row.asset_currency,
                quantity=row.quantity,
                dividend_currency=row.dividend_currency,
                expected_annual_gross=row.expected_annual_gross_display,
                expected_annual_tax=row.expected_annual_tax_display,
                expected_annual_net=row.expected_annual_net_display,
                received_ytd_gross=row.received_ytd_gross_display,
                received_ytd_tax=row.received_ytd_tax_display,
                received_ytd_net=row.received_ytd_net_display,
                dividend_yield_pct=row.dividend_yield_pct,
                tax_rate_pct=tax_context.effective_tax_rate_pct,
                tax_profile=tax_context.effective_tax_profile,
                portfolio_tax_profile=tax_context.portfolio_tax_profile,
                asset_tax_profile=tax_context.asset_tax_profile,
                effective_tax_profile=tax_context.effective_tax_profile,
                effective_tax_rate_pct=tax_context.effective_tax_rate_pct,
                taxable_included=tax_context.taxable_included,
                taxable_exclusion_reason=tax_context.taxable_exclusion_reason,
                payment_months=row.payment_months_json or [],
                estimate_method=row.estimate_method,
                confidence=row.confidence,
                missing_reason=row.missing_reason,
                confirmed_event_count=row.confirmed_event_count,
                estimated_event_count=row.estimated_event_count,
                status=status_value,
                source=source,
                provider_identifiers=[_identifier_out(ident) for ident in identifiers],
                identifier_summary=", ".join(f"{ident.provider}/{ident.identifier_type}" for ident in identifiers) or None,
                event_count=len(events),
                last_event_date=(
                    events[0].payment_date
                    or events[0].ex_dividend_date
                    or events[0].record_date
                    or events[0].dividend_base_date
                    if events
                    else None
                ),
                last_updated_at=max([item.updated_at for item in [setting, *events, *identifiers] if item is not None], default=None),
                warnings=warnings,
            )
        )

    snapshot_row_keys = {(row.portfolio_id, row.asset_id) for row in snapshot_rows}
    for holding, asset, portfolio in held_rows:
        if (holding.portfolio_id, asset.id) in snapshot_row_keys:
            continue
        identifiers = identifiers_by_asset.get(int(asset.id), [])
        setting = settings_by_asset.get(int(asset.id))
        events = events_by_asset.get(int(asset.id), [])
        status_value = "DISABLED" if setting is not None and not setting.is_enabled else "MISSING_IDENTIFIER" if not identifiers else "NO_EVENTS"
        tax_context = resolve_dividend_tax_context(
            portfolio=portfolio,
            asset=asset,
            dividend_currency=(setting.dividend_currency if setting else asset.currency),
            setting=setting,
        )
        rows.append(
            DividendStatusRowOut(
                portfolio_id=holding.portfolio_id,
                portfolio_name=portfolio.name if portfolio is not None else "Unassigned",
                asset_id=asset.id,
                asset_name=asset.name,
                symbol=asset.symbol,
                income_kind=_default_income_kind_for_asset(asset),
                asset_currency=asset.currency,
                quantity=holding.quantity,
                dividend_currency=(setting.dividend_currency if setting else asset.currency),
                expected_annual_gross=Decimal("0"),
                expected_annual_tax=Decimal("0"),
                expected_annual_net=Decimal("0"),
                received_ytd_gross=Decimal("0"),
                received_ytd_tax=Decimal("0"),
                received_ytd_net=Decimal("0"),
                dividend_yield_pct=None,
                tax_rate_pct=tax_context.effective_tax_rate_pct,
                tax_profile=tax_context.effective_tax_profile,
                portfolio_tax_profile=tax_context.portfolio_tax_profile,
                asset_tax_profile=tax_context.asset_tax_profile,
                effective_tax_profile=tax_context.effective_tax_profile,
                effective_tax_rate_pct=tax_context.effective_tax_rate_pct,
                taxable_included=tax_context.taxable_included,
                taxable_exclusion_reason=tax_context.taxable_exclusion_reason,
                payment_months=setting.payment_months_json if setting and setting.payment_months_json else [],
                estimate_method=None,
                confidence="NONE",
                missing_reason="MISSING_IDENTIFIER" if not identifiers else "NO_PROVIDER_DATA",
                confirmed_event_count=0,
                estimated_event_count=0,
                status=status_value,
                source="MANUAL" if setting and setting.manual_annual_dividend_per_share is not None else "NONE",
                provider_identifiers=[_identifier_out(ident) for ident in identifiers],
                identifier_summary=", ".join(f"{ident.provider}/{ident.identifier_type}" for ident in identifiers) or None,
                event_count=len(events),
                last_event_date=(
                    events[0].payment_date
                    or events[0].ex_dividend_date
                    or events[0].record_date
                    or events[0].dividend_base_date
                    if events
                    else None
                ),
                last_updated_at=max([item.updated_at for item in [setting, *events, *identifiers] if item is not None], default=None),
                warnings=["No dividend snapshot row for this holding"],
            )
        )

    configured_rows = [row for row in rows if row.status != "DISABLED"]
    taxable_limit_krw, _taxable_limit_source = get_financial_income_taxable_limit_krw(db)
    taxable_expected_annual_gross = sum(
        (row.expected_annual_gross for row in configured_rows if row.taxable_included),
        Decimal("0"),
    )
    taxable_expected_annual_net = sum(
        (row.expected_annual_net for row in configured_rows if row.taxable_included),
        Decimal("0"),
    )
    taxable_received_ytd = sum(
        (row.received_ytd_net for row in configured_rows if row.taxable_included),
        Decimal("0"),
    )
    excluded_pension_amount = sum(
        (row.expected_annual_gross for row in configured_rows if row.effective_tax_profile == "PENSION"),
        Decimal("0"),
    )
    excluded_isa_amount = sum(
        (row.expected_annual_gross for row in configured_rows if row.effective_tax_profile == "ISA"),
        Decimal("0"),
    )
    excluded_tax_exempt_amount = sum(
        (row.expected_annual_gross for row in configured_rows if row.effective_tax_profile == "TAX_EXEMPT"),
        Decimal("0"),
    )
    taxable_limit_decimal = Decimal(taxable_limit_krw)
    taxable_remaining_gross = max(Decimal("0"), taxable_limit_decimal - taxable_expected_annual_gross)
    taxable_usage_ratio_pct = (
        taxable_expected_annual_gross / taxable_limit_decimal * Decimal("100")
        if taxable_limit_decimal > 0
        else None
    )
    summary = DividendStatusSummaryOut(
        configured=snapshot is not None,
        display_currency=target_currency,
        dividend_year=target_year,
        snapshot=_snapshot_out(snapshot) if snapshot is not None else None,
        expected_annual_gross=snapshot.expected_annual_gross if snapshot is not None else Decimal("0"),
        expected_annual_tax=snapshot.expected_annual_tax if snapshot is not None else Decimal("0"),
        expected_annual_net=snapshot.expected_annual_net if snapshot is not None else Decimal("0"),
        received_ytd_gross=snapshot.received_ytd_gross if snapshot is not None else Decimal("0"),
        received_ytd_tax=snapshot.received_ytd_tax if snapshot is not None else Decimal("0"),
        received_ytd_net=snapshot.received_ytd_net if snapshot is not None else Decimal("0"),
        total_assets=len(rows),
        covered_assets=len([row for row in configured_rows if row.expected_annual_net > 0 or row.event_count > 0]),
        missing_identifier_assets=len([row for row in rows if row.status == "MISSING_IDENTIFIER"]),
        no_event_assets=len([row for row in rows if row.status == "NO_EVENTS"]),
        disabled_assets=len([row for row in rows if row.status == "DISABLED"]),
        taxable_limit_krw=taxable_limit_decimal,
        taxable_expected_annual_gross=taxable_expected_annual_gross,
        taxable_expected_annual_net=taxable_expected_annual_net,
        taxable_received_ytd=taxable_received_ytd,
        taxable_remaining_gross=taxable_remaining_gross,
        taxable_usage_ratio_pct=taxable_usage_ratio_pct,
        excluded_pension_amount=excluded_pension_amount,
        excluded_isa_amount=excluded_isa_amount,
        excluded_tax_exempt_amount=excluded_tax_exempt_amount,
        as_of=snapshot.as_of if snapshot is not None else None,
    )
    return DividendStatusOut(
        summary=summary,
        scheduler=DividendSchedulerStatusOut(**get_dividend_scheduler_status()),
        rows=rows,
    )


@router.get("/coverage", response_model=DividendStatusOut)
def get_dividend_coverage(
    display_currency: str = Query(default="KRW", min_length=3, max_length=3),
    year: int | None = Query(default=None, ge=1900, le=2200),
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> DividendStatusOut:
    return get_dividend_status(
        display_currency=display_currency,
        year=year,
        db=db,
        current_user=current_user,
    )


@router.get("/update-runs", response_model=DividendUpdateRunPageOut)
def list_dividend_update_runs(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> DividendUpdateRunPageOut:
    stmt = select(DividendUpdateRun)
    total = int(db.scalar(select(func.count()).select_from(stmt.subquery())) or 0)
    rows = list(
        db.scalars(
            stmt.order_by(DividendUpdateRun.created_at.desc(), DividendUpdateRun.id.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        ).all()
    )
    return DividendUpdateRunPageOut(items=[_run_out(row) for row in rows], total=total)


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
    return [_identifier_out(row) for row in db.scalars(stmt).all()]


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
    return _identifier_out(row)


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


@router.put("/assets/{asset_id}/settings", response_model=AssetDividendSettingOut)
def upsert_asset_dividend_setting(
    asset_id: int,
    payload: AssetDividendSettingUpdateIn,
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> AssetDividendSettingOut:
    asset = db.get(Asset, asset_id)
    if asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
    row = db.scalar(select(AssetDividendSetting).where(AssetDividendSetting.asset_id == asset_id))
    if row is None:
        row = AssetDividendSetting(asset_id=asset_id)
        db.add(row)
    row.is_enabled = payload.is_enabled
    row.tax_rate_pct = payload.tax_rate_pct
    row.tax_country = payload.tax_country.strip().upper() if payload.tax_country else None
    row.dividend_currency = payload.dividend_currency.upper() if payload.dividend_currency else None
    row.manual_annual_dividend_per_share = payload.manual_annual_dividend_per_share
    row.manual_frequency = payload.manual_frequency.strip().upper() if payload.manual_frequency else None
    row.payment_months_json = sorted({int(month) for month in payload.payment_months if 1 <= int(month) <= 12}) or None
    row.note = payload.note
    db.commit()
    db.refresh(row)
    return _setting_out(row)


@router.delete("/assets/{asset_id}/metadata", status_code=status.HTTP_204_NO_CONTENT)
def delete_asset_dividend_metadata(
    asset_id: int,
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> None:
    asset = db.get(Asset, asset_id)
    if asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
    setting = db.scalar(select(AssetDividendSetting).where(AssetDividendSetting.asset_id == asset_id))
    if setting is not None:
        db.delete(setting)
    for identifier in db.scalars(select(AssetProviderIdentifier).where(AssetProviderIdentifier.asset_id == asset_id)).all():
        db.delete(identifier)
    db.commit()


@router.get("/assets/{asset_id}/history", response_model=AssetDividendHistoryOut)
def get_asset_dividend_history(
    asset_id: int,
    year: int | None = Query(default=None, ge=1900, le=2200),
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> AssetDividendHistoryOut:
    asset = db.get(Asset, asset_id)
    if asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
    setting = db.scalar(select(AssetDividendSetting).where(AssetDividendSetting.asset_id == asset_id))
    identifiers = list(
        db.scalars(
            select(AssetProviderIdentifier)
            .where(AssetProviderIdentifier.asset_id == asset_id)
            .order_by(AssetProviderIdentifier.provider.asc(), AssetProviderIdentifier.identifier_type.asc())
        ).all()
    )
    events_stmt = select(AssetDividendEvent).where(AssetDividendEvent.asset_id == asset_id)
    if year is not None:
        events_stmt = events_stmt.where(
            (AssetDividendEvent.fiscal_year == year)
            | (AssetDividendEvent.payment_date >= date(year, 1, 1))
            | (AssetDividendEvent.ex_dividend_date >= date(year, 1, 1))
        )
    events = list(
        db.scalars(
            events_stmt.order_by(
                AssetDividendEvent.payment_date.desc(),
                AssetDividendEvent.ex_dividend_date.desc(),
                AssetDividendEvent.id.desc(),
            ).limit(100)
        ).all()
    )
    receipts_stmt = select(DividendReceipt).where(
        DividendReceipt.owner_user_id == current_user.id,
        DividendReceipt.asset_id == asset_id,
    )
    if year is not None:
        receipts_stmt = receipts_stmt.where(
            DividendReceipt.received_date >= date(year, 1, 1),
            DividendReceipt.received_date <= date(year, 12, 31),
        )
    receipts = list(db.scalars(receipts_stmt.order_by(DividendReceipt.received_date.desc(), DividendReceipt.id.desc()).limit(100)).all())
    portfolios = {
        row.id: row
        for row in db.scalars(select(Portfolio).where(Portfolio.id.in_([receipt.portfolio_id for receipt in receipts] or [-1]))).all()
    }
    return AssetDividendHistoryOut(
        asset_id=asset.id,
        asset_name=asset.name,
        symbol=asset.symbol,
        setting=_setting_out(setting) if setting is not None else None,
        identifiers=[_identifier_out(row) for row in identifiers],
        events=[_event_out(row) for row in events],
        receipts=[_receipt_out(row, portfolios.get(row.portfolio_id), asset) for row in receipts],
    )


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
                income_kind=_asset_income_kind(row),
                quantity=row.quantity,
                currency=row.dividend_currency,
                confirmed_annual_gross=row.confirmed_annual_gross_display,
                confirmed_annual_tax=row.confirmed_annual_tax_display,
                confirmed_annual_net=row.confirmed_annual_net_display,
                estimated_annual_gross=row.estimated_annual_gross_display,
                estimated_annual_tax=row.estimated_annual_tax_display,
                estimated_annual_net=row.estimated_annual_net_display,
                expected_annual_gross=row.expected_annual_gross_display,
                expected_annual_tax=row.expected_annual_tax_display,
                expected_annual_net=row.expected_annual_net_display,
                received_ytd_gross=row.received_ytd_gross_display,
                received_ytd_tax=row.received_ytd_tax_display,
                received_ytd_net=row.received_ytd_net_display,
                dividend_yield_pct=row.dividend_yield_pct,
                tax_rate_pct=row.tax_rate_pct,
                tax_profile=row.tax_profile,
                payment_months=row.payment_months_json or [],
                estimate_method=row.estimate_method,
                confidence=row.confidence,
                missing_reason=row.missing_reason,
                confirmed_event_count=row.confirmed_event_count,
                estimated_event_count=row.estimated_event_count,
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
                "confirmed_annual_gross": row.confirmed_annual_gross_display,
                "confirmed_annual_tax": row.confirmed_annual_tax_display,
                "confirmed_annual_net": row.confirmed_annual_net_display,
                "estimated_annual_gross": row.estimated_annual_gross_display,
                "estimated_annual_tax": row.estimated_annual_tax_display,
                "estimated_annual_net": row.estimated_annual_net_display,
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
