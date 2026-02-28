from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_min_role
from app.core.db import get_db
from app.models.asset import Asset
from app.models.latest_quote import LatestQuote
from app.schemas.asset import (
    AssetCreate,
    AssetOut,
    AssetTablePageOut,
    AssetTableRowOut,
    AssetTableSortBy,
    AssetUpdate,
    SortOrder,
)
from app.services.entity_change_log import (
    EntityLogInput,
    actor_from_user,
    snapshot_asset,
    write_entity_change_log,
)
from app.services.user_seed import SeedUser

router = APIRouter(prefix="/assets", tags=["assets"])


@router.get("", response_model=list[AssetOut])
def list_assets(
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(get_current_user),
) -> list[Asset]:
    stmt = select(Asset).order_by(Asset.id.desc())
    return list(db.scalars(stmt).all())


@router.get("/table", response_model=AssetTablePageOut)
def list_assets_table(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=200),
    sort_by: AssetTableSortBy = Query(default=AssetTableSortBy.UPDATED_AT),
    sort_order: SortOrder = Query(default=SortOrder.DESC),
    q: str | None = Query(default=None, min_length=1, max_length=100),
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(get_current_user),
) -> AssetTablePageOut:
    query_text = q.strip() if q else None

    filters = []
    if query_text:
        like = f"%{query_text}%"
        filters.append(
            or_(
                Asset.name.ilike(like),
                Asset.symbol.ilike(like),
                Asset.asset_class.ilike(like),
                Asset.exchange_code.ilike(like),
                Asset.currency.ilike(like),
            )
        )

    count_stmt = select(func.count()).select_from(Asset)
    if filters:
        count_stmt = count_stmt.where(*filters)
    total = int(db.scalar(count_stmt) or 0)

    sort_column_map = {
        AssetTableSortBy.ID: Asset.id,
        AssetTableSortBy.NAME: Asset.name,
        AssetTableSortBy.SYMBOL: Asset.symbol,
        AssetTableSortBy.PRICE: LatestQuote.price,
        AssetTableSortBy.CURRENCY: Asset.currency,
        AssetTableSortBy.ASSET_CLASS: Asset.asset_class,
        AssetTableSortBy.UPDATED_AT: Asset.updated_at,
        AssetTableSortBy.QUOTE_MODE: Asset.quote_mode,
        AssetTableSortBy.QUOTE_AS_OF: LatestQuote.as_of,
        AssetTableSortBy.EXCHANGE_CODE: Asset.exchange_code,
        AssetTableSortBy.SOURCE: LatestQuote.source,
        AssetTableSortBy.TRADE: Asset.is_trade_supported,
    }
    sort_column = sort_column_map[sort_by]
    order_expr = sort_column.asc() if sort_order == SortOrder.ASC else sort_column.desc()

    stmt = (
        select(Asset, LatestQuote)
        .outerjoin(LatestQuote, LatestQuote.asset_id == Asset.id)
    )
    if filters:
        stmt = stmt.where(*filters)

    stmt = stmt.order_by(order_expr, Asset.id.desc()).offset((page - 1) * page_size).limit(page_size)
    rows = db.execute(stmt).all()

    items = [
        AssetTableRowOut(
            id=asset.id,
            asset_class=asset.asset_class,
            symbol=asset.symbol,
            name=asset.name,
            currency=asset.currency,
            quote_mode=asset.quote_mode,
            exchange_code=asset.exchange_code,
            is_trade_supported=asset.is_trade_supported,
            meta_json=asset.meta_json,
            created_at=asset.created_at,
            updated_at=asset.updated_at,
            quote_price=quote.price if quote else None,
            quote_currency=quote.currency if quote else None,
            quote_as_of=quote.as_of if quote else None,
            quote_source=quote.source if quote else None,
        )
        for asset, quote in rows
    ]

    return AssetTablePageOut(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order,
        q=query_text,
    )


@router.post("", response_model=AssetOut, status_code=status.HTTP_201_CREATED)
def create_asset(
    payload: AssetCreate,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> Asset:
    actor_user_id, actor_email = actor_from_user(current_user)
    asset_data = payload.model_dump()
    asset_data["asset_class"] = asset_data["asset_class"].upper()
    asset_data["currency"] = asset_data["currency"].upper()
    asset_data["exchange_code"] = asset_data["exchange_code"].upper()
    if "quote_mode" not in payload.model_fields_set and asset_data["asset_class"] not in {"STOCK", "CRYPTO"}:
        asset_data["quote_mode"] = "MANUAL"

    asset = Asset(**asset_data)
    db.add(asset)
    try:
        db.flush()
        write_entity_change_log(
            db,
            EntityLogInput(
                entity_type="ASSET",
                entity_id=asset.id,
                owner_user_id=current_user.id,
                action="CREATE",
                before=None,
                after=snapshot_asset(asset),
                reason=None,
                actor_user_id=actor_user_id,
                actor_email=actor_email,
            ),
        )
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or duplicate asset") from exc
    db.refresh(asset)
    return asset


@router.patch("/{asset_id}", response_model=AssetOut)
def update_asset(
    asset_id: int,
    payload: AssetUpdate,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> Asset:
    asset = db.scalar(select(Asset).where(Asset.id == asset_id))
    if asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
    actor_user_id, actor_email = actor_from_user(current_user)
    before_snapshot = snapshot_asset(asset)

    updates = payload.model_dump(exclude_unset=True)
    if "asset_class" in updates and updates["asset_class"] is not None:
        updates["asset_class"] = updates["asset_class"].upper()
    if "currency" in updates and updates["currency"] is not None:
        updates["currency"] = updates["currency"].upper()
    if "exchange_code" in updates and updates["exchange_code"] is not None:
        updates["exchange_code"] = updates["exchange_code"].upper()

    for key, value in updates.items():
        setattr(asset, key, value)

    try:
        db.flush()
        write_entity_change_log(
            db,
            EntityLogInput(
                entity_type="ASSET",
                entity_id=asset.id,
                owner_user_id=current_user.id,
                action="UPDATE_HARD",
                before=before_snapshot,
                after=snapshot_asset(asset),
                reason=None,
                actor_user_id=actor_user_id,
                actor_email=actor_email,
            ),
        )
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or duplicate asset") from exc
    db.refresh(asset)
    return asset


@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> Response:
    asset = db.scalar(select(Asset).where(Asset.id == asset_id))
    if asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
    actor_user_id, actor_email = actor_from_user(current_user)
    before_snapshot = snapshot_asset(asset)

    db.delete(asset)
    write_entity_change_log(
        db,
        EntityLogInput(
            entity_type="ASSET",
            entity_id=asset_id,
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
