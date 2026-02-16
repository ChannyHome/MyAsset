from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.db import get_db
from app.models.asset import Asset
from app.models.asset_quote import AssetQuote
from app.models.holding import Holding
from app.models.latest_quote import LatestQuote
from app.schemas.quote import QuoteLatestOut, QuoteUpdateResult, RealEstateManualQuoteUpsertIn
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
    _current_user: SeedUser = Depends(get_current_user),
) -> QuoteUpdateResult:
    summary = refresh_quotes_for_supported_assets(db)
    return QuoteUpdateResult(
        updated_count=summary.updated_count,
        skipped_count=summary.skipped_count,
        failed_count=summary.failed_count,
        errors=summary.errors,
    )


@router.post("/manual/real-estate", response_model=QuoteLatestOut, status_code=status.HTTP_201_CREATED)
def upsert_manual_real_estate_quote(
    payload: RealEstateManualQuoteUpsertIn,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> QuoteLatestOut:
    asset = db.scalar(select(Asset).where(Asset.id == payload.asset_id))
    if asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
    if asset.asset_class != "REAL_ESTATE":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Asset class must be REAL_ESTATE")

    owned_holding_exists = db.scalar(
        select(Holding.id)
        .where(
            Holding.owner_user_id == current_user.id,
            Holding.asset_id == payload.asset_id,
        )
        .limit(1)
    )
    if owned_holding_exists is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can update quotes for your own holdings only")

    as_of = payload.as_of or datetime.now(UTC).replace(tzinfo=None)
    currency = payload.currency.upper()
    source = "MANUAL_REAL_ESTATE"

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

