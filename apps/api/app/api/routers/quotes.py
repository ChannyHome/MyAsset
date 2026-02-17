from datetime import UTC, datetime

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_min_role
from app.core.db import get_db
from app.models.asset import Asset
from app.models.asset_quote import AssetQuote
from app.models.fx_rate import FxRate
from app.models.latest_quote import LatestQuote
from app.schemas.quote import (
    FxRateLatestOut,
    ManualQuoteUpsertIn,
    QuoteLatestOut,
    QuoteUpdateJobStartOut,
    QuoteUpdateJobStatusOut,
)
from app.services.quote_update_jobs import (
    create_quote_update_job,
    get_active_quote_update_job,
    get_quote_update_job,
    run_quote_update_job,
)
from app.services.quote_updater import (
    get_latest_usd_krw_rate,
    refresh_quote_for_asset_id,
    refresh_usd_krw_rate,
)
from app.services.user_seed import SeedUser

router = APIRouter(prefix="/quotes", tags=["quotes"])


@router.get("/latest", response_model=list[QuoteLatestOut])
def get_latest_quotes(
    asset_ids: list[int] = Query(default_factory=list),
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(get_current_user),
) -> list[QuoteLatestOut]:
    stmt = (
        select(LatestQuote, Asset)
        .join(Asset, Asset.id == LatestQuote.asset_id)
        .order_by(LatestQuote.asset_id.asc())
    )
    if asset_ids:
        stmt = stmt.where(LatestQuote.asset_id.in_(asset_ids))

    rows = db.execute(stmt).all()
    return [
        QuoteLatestOut(
            asset_id=asset.id,
            symbol=asset.symbol,
            name=asset.name,
            price=quote.price,
            currency=quote.currency,
            change_value=quote.change_value,
            change_pct=quote.change_pct,
            as_of=quote.as_of,
            source=quote.source,
        )
        for quote, asset in rows
    ]


@router.post("/update-now", response_model=QuoteUpdateJobStartOut, status_code=status.HTTP_202_ACCEPTED)
def update_quotes_now(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> QuoteUpdateJobStartOut:
    _ = db  # keep dependency lifecycle explicit
    active = get_active_quote_update_job()
    if active is not None:
        return QuoteUpdateJobStartOut(
            job_id=active.job_id,
            status=active.status,
            created_at=active.created_at,
            total_assets=active.total_assets,
        )

    job = create_quote_update_job()
    background_tasks.add_task(run_quote_update_job, job.job_id)
    return QuoteUpdateJobStartOut(
        job_id=job.job_id,
        status=job.status,
        created_at=job.created_at,
        total_assets=job.total_assets,
    )


@router.get("/fx/usd-krw/latest", response_model=FxRateLatestOut)
def get_latest_usd_krw_fx(
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(get_current_user),
) -> FxRateLatestOut:
    row: FxRate | None = get_latest_usd_krw_rate(db)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="USD/KRW FX rate is unavailable")

    return FxRateLatestOut(
        base_currency=row.base_currency,
        quote_currency=row.quote_currency,
        rate=row.rate,
        as_of=row.as_of,
        source=row.source,
    )


@router.get("/update-jobs/{job_id}", response_model=QuoteUpdateJobStatusOut)
def get_quote_update_job_status(
    job_id: str,
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> QuoteUpdateJobStatusOut:
    _ = db  # keep dependency lifecycle explicit
    job = get_quote_update_job(job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quote update job not found")

    fx_rate = None
    if job.fx_rate is not None and job.fx_base_currency and job.fx_quote_currency and job.fx_as_of and job.fx_source:
        fx_rate = FxRateLatestOut(
            base_currency=job.fx_base_currency,
            quote_currency=job.fx_quote_currency,
            rate=job.fx_rate,
            as_of=job.fx_as_of,
            source=job.fx_source,
        )

    return QuoteUpdateJobStatusOut(
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
        fx_updated=job.fx_updated,
        fx_rate=fx_rate,
        fx_error=job.fx_error,
    )


@router.post("/fx/usd-krw/test", response_model=FxRateLatestOut)
def test_usd_krw_fx(
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> FxRateLatestOut:
    row, error = refresh_usd_krw_rate(db)
    if error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)
    if row is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="USD/KRW FX rate is unavailable")

    return FxRateLatestOut(
        base_currency=row.base_currency,
        quote_currency=row.quote_currency,
        rate=row.rate,
        as_of=row.as_of,
        source=row.source,
    )


@router.post("/test/{asset_id}", response_model=QuoteLatestOut)
def test_quote_for_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> QuoteLatestOut:
    latest_quote, error_message = refresh_quote_for_asset_id(db, asset_id)
    if error_message:
        if error_message == "Asset not found":
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=error_message)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_message)
    if latest_quote is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Latest quote is unavailable")

    asset = db.scalar(select(Asset).where(Asset.id == asset_id))
    if asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")

    return QuoteLatestOut(
        asset_id=asset.id,
        symbol=asset.symbol,
        name=asset.name,
        price=latest_quote.price,
        currency=latest_quote.currency,
        change_value=latest_quote.change_value,
        change_pct=latest_quote.change_pct,
        as_of=latest_quote.as_of,
        source=latest_quote.source,
    )


@router.post("/manual", response_model=QuoteLatestOut, status_code=status.HTTP_201_CREATED)
def upsert_manual_quote(
    payload: ManualQuoteUpsertIn,
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> QuoteLatestOut:
    asset = db.scalar(select(Asset).where(Asset.id == payload.asset_id))
    if asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")

    as_of = payload.as_of or datetime.now(UTC).replace(tzinfo=None)
    currency = payload.currency.upper()
    source = (payload.source or "MANUAL").strip().upper()
    if not source:
        source = "MANUAL"

    db.add(
        AssetQuote(
            asset_id=asset.id,
            price=payload.price,
            currency=currency,
            change_value=None,
            change_pct=None,
            as_of=as_of,
            source=source,
        )
    )

    latest_quote = db.scalar(select(LatestQuote).where(LatestQuote.asset_id == asset.id))
    if latest_quote is None:
        latest_quote = LatestQuote(
            asset_id=asset.id,
            price=payload.price,
            currency=currency,
            change_value=None,
            change_pct=None,
            as_of=as_of,
            source=source,
        )
        db.add(latest_quote)
    else:
        latest_quote.price = payload.price
        latest_quote.currency = currency
        latest_quote.change_value = None
        latest_quote.change_pct = None
        latest_quote.as_of = as_of
        latest_quote.source = source

    db.commit()

    return QuoteLatestOut(
        asset_id=asset.id,
        symbol=asset.symbol,
        name=asset.name,
        price=latest_quote.price,
        currency=latest_quote.currency,
        change_value=latest_quote.change_value,
        change_pct=latest_quote.change_pct,
        as_of=latest_quote.as_of,
        source=latest_quote.source,
    )

