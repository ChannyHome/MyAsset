from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.db import get_db
from app.models.asset import Asset
from app.models.asset_quote import AssetQuote
from app.schemas.quote import QuoteLatestOut, QuoteUpdateResult
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
        select(AssetQuote, Asset)
        .join(Asset, Asset.id == AssetQuote.asset_id)
        .order_by(AssetQuote.asset_id.asc(), AssetQuote.as_of.desc(), AssetQuote.id.desc())
    )
    if asset_ids:
        stmt = stmt.where(AssetQuote.asset_id.in_(asset_ids))

    rows = db.execute(stmt).all()
    latest_by_asset: dict[int, QuoteLatestOut] = {}
    for quote, asset in rows:
        if asset.id in latest_by_asset:
            continue
        latest_by_asset[asset.id] = QuoteLatestOut(
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
    return list(latest_by_asset.values())


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
