from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.db import get_db
from app.models.asset import Asset
from app.schemas.asset import AssetCreate, AssetOut, AssetUpdate
from app.services.user_seed import SeedUser

router = APIRouter(prefix="/assets", tags=["assets"])


@router.get("", response_model=list[AssetOut])
def list_assets(
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(get_current_user),
) -> list[Asset]:
    stmt = select(Asset).order_by(Asset.id.desc())
    return list(db.scalars(stmt).all())


@router.post("", response_model=AssetOut, status_code=status.HTTP_201_CREATED)
def create_asset(
    payload: AssetCreate,
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(get_current_user),
) -> Asset:
    asset_data = payload.model_dump()
    asset_data["asset_class"] = asset_data["asset_class"].upper()
    asset_data["currency"] = asset_data["currency"].upper()
    asset_data["exchange_code"] = asset_data["exchange_code"].upper()
    if "quote_mode" not in payload.model_fields_set and asset_data["asset_class"] not in {"STOCK", "CRYPTO"}:
        asset_data["quote_mode"] = "MANUAL"

    asset = Asset(**asset_data)
    db.add(asset)
    try:
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
    _current_user: SeedUser = Depends(get_current_user),
) -> Asset:
    asset = db.scalar(select(Asset).where(Asset.id == asset_id))
    if asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")

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
    _current_user: SeedUser = Depends(get_current_user),
) -> Response:
    asset = db.scalar(select(Asset).where(Asset.id == asset_id))
    if asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")

    db.delete(asset)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
