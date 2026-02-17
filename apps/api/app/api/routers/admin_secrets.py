from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import require_min_role
from app.core.db import get_db
from app.models.app_secret import AppSecret
from app.models.user import User
from app.schemas.app_secret import AppSecretCreate, AppSecretOut, AppSecretUpdate
from app.services.secret_vault import decrypt_secret, encrypt_secret, mask_secret

router = APIRouter(prefix="/admin/secrets", tags=["admin-secrets"])


def _normalize_provider(value: str) -> str:
    normalized = value.strip().upper()
    if not normalized:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="provider is required")
    return normalized


def _normalize_key_name(value: str) -> str:
    normalized = value.strip().upper()
    if not normalized:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="key_name is required")
    return normalized


def _build_out(row: AppSecret) -> AppSecretOut:
    try:
        masked = mask_secret(decrypt_secret(row.encrypted_value))
    except Exception:
        masked = "(unavailable)"

    return AppSecretOut(
        id=row.id,
        provider=row.provider,
        key_name=row.key_name,
        masked_value=masked,
        description=row.description,
        is_active=row.is_active,
        created_by_user_id=row.created_by_user_id,
        updated_by_user_id=row.updated_by_user_id,
        created_at=row.created_at,
        updated_at=row.updated_at,
    )


@router.get("", response_model=list[AppSecretOut])
def list_app_secrets(
    provider: str | None = Query(default=None, min_length=1, max_length=50),
    key_name: str | None = Query(default=None, min_length=1, max_length=100),
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_min_role("ADMIN")),
) -> list[AppSecretOut]:
    stmt = select(AppSecret)
    if provider:
        stmt = stmt.where(AppSecret.provider == _normalize_provider(provider))
    if key_name:
        stmt = stmt.where(AppSecret.key_name == _normalize_key_name(key_name))
    stmt = stmt.order_by(AppSecret.provider.asc(), AppSecret.key_name.asc(), AppSecret.id.asc())

    rows = list(db.scalars(stmt).all())
    return [_build_out(row) for row in rows]


@router.post("", response_model=AppSecretOut, status_code=status.HTTP_201_CREATED)
def create_app_secret(
    payload: AppSecretCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_min_role("ADMIN")),
) -> AppSecretOut:
    provider = _normalize_provider(payload.provider)
    key_name = _normalize_key_name(payload.key_name)

    existing = db.scalar(
        select(AppSecret).where(
            AppSecret.provider == provider,
            AppSecret.key_name == key_name,
        )
    )
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Secret already exists")

    try:
        encrypted = encrypt_secret(payload.secret_value)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    row = AppSecret(
        provider=provider,
        key_name=key_name,
        encrypted_value=encrypted,
        description=(payload.description or "").strip() or None,
        is_active=True,
        created_by_user_id=current_user.id,
        updated_by_user_id=current_user.id,
    )
    db.add(row)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or duplicate secret") from exc
    db.refresh(row)
    return _build_out(row)


@router.patch("/{secret_id}", response_model=AppSecretOut)
def update_app_secret(
    secret_id: int,
    payload: AppSecretUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_min_role("ADMIN")),
) -> AppSecretOut:
    row = db.scalar(select(AppSecret).where(AppSecret.id == secret_id))
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Secret not found")

    if payload.secret_value is not None:
        try:
            row.encrypted_value = encrypt_secret(payload.secret_value)
        except ValueError as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    if payload.description is not None:
        row.description = payload.description.strip() or None
    if payload.is_active is not None:
        row.is_active = payload.is_active

    row.updated_by_user_id = current_user.id

    db.commit()
    db.refresh(row)
    return _build_out(row)


@router.delete("/{secret_id}", response_model=AppSecretOut)
def deactivate_app_secret(
    secret_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_min_role("ADMIN")),
) -> AppSecretOut:
    row = db.scalar(select(AppSecret).where(AppSecret.id == secret_id))
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Secret not found")

    row.is_active = False
    row.updated_by_user_id = current_user.id

    db.commit()
    db.refresh(row)
    return _build_out(row)
