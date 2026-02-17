import base64
import hashlib

from cryptography.fernet import Fernet, InvalidToken
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.app_secret import AppSecret


def _build_fernet() -> Fernet:
    raw = (settings.app_secrets_master_key or "").strip()
    if not raw:
        raise ValueError("APP_SECRETS_MASTER_KEY is not configured")

    # If key is not in Fernet format, derive a stable Fernet key from passphrase.
    try:
        key = raw.encode("utf-8")
        if len(key) != 44:
            raise ValueError
        return Fernet(key)
    except Exception:
        digest = hashlib.sha256(raw.encode("utf-8")).digest()
        derived = base64.urlsafe_b64encode(digest)
        return Fernet(derived)


def encrypt_secret(plain_text: str) -> str:
    if not plain_text:
        raise ValueError("secret value is required")
    fernet = _build_fernet()
    return fernet.encrypt(plain_text.encode("utf-8")).decode("utf-8")


def decrypt_secret(cipher_text: str) -> str:
    fernet = _build_fernet()
    try:
        return fernet.decrypt(cipher_text.encode("utf-8")).decode("utf-8")
    except InvalidToken as exc:
        raise ValueError("Invalid secret token or wrong master key") from exc


def mask_secret(plain_text: str) -> str:
    length = len(plain_text)
    if length <= 4:
        return "*" * length
    if length <= 8:
        return plain_text[:2] + "*" * (length - 4) + plain_text[-2:]
    return plain_text[:3] + "*" * (length - 5) + plain_text[-2:]


def get_active_secret_value(db: Session, provider: str, key_name: str) -> str | None:
    normalized_provider = (provider or "").strip().upper()
    normalized_key_name = (key_name or "").strip().upper()
    if not normalized_provider or not normalized_key_name:
        return None

    stmt = (
        select(AppSecret)
        .where(
            AppSecret.provider == normalized_provider,
            AppSecret.key_name == normalized_key_name,
            AppSecret.is_active.is_(True),
        )
        .order_by(AppSecret.updated_at.desc(), AppSecret.id.desc())
    )
    row = db.scalar(stmt)
    if row is None:
        return None

    try:
        return decrypt_secret(row.encrypted_value).strip()
    except Exception:
        return None


def resolve_secret_value(
    db: Session,
    provider: str,
    key_name: str,
    env_fallback: str = "",
) -> tuple[str | None, str]:
    db_value = get_active_secret_value(db=db, provider=provider, key_name=key_name)
    if db_value:
        return db_value, "db"

    env_value = (env_fallback or "").strip()
    if env_value:
        return env_value, "env"

    return None, "none"
