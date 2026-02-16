from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_min_role
from app.core.db import get_db
from app.models.asset import Asset
from app.models.asset_quote import AssetQuote
from app.models.latest_quote import LatestQuote
from app.schemas.quote import ManualQuoteUpsertIn, QuoteLatestOut, QuoteUpdateResult
from app.services.quote_updater import refresh_quotes_for_supported_assets
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


@router.post("/update-now", response_model=QuoteUpdateResult)
def update_quotes_now(
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> QuoteUpdateResult:
    summary = refresh_quotes_for_supported_assets(db)
    return QuoteUpdateResult(
        updated_count=summary.updated_count,
        skipped_count=summary.skipped_count,
        failed_count=summary.failed_count,
        errors=summary.errors,
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

