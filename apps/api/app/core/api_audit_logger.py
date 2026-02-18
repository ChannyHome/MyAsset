import json
from typing import Any

from sqlalchemy import select

from app.core.config import settings
from app.core.db import get_session_maker
from app.models.api_audit_log import ApiAuditLog
from app.models.user import User

_MASKED_VALUE = "***MASKED***"
_SENSITIVE_KEYWORDS = (
    "password",
    "token",
    "secret",
    "api_key",
    "apikey",
    "authorization",
    "cookie",
)
_BINARY_CONTENT_TYPE_PREFIXES = (
    "multipart/form-data",
    "application/octet-stream",
    "application/pdf",
    "image/",
    "audio/",
    "video/",
)


def _is_sensitive_key(key: str) -> bool:
    lowered = key.lower()
    return any(token in lowered for token in _SENSITIVE_KEYWORDS)


def _mask_value(value: Any) -> Any:
    if isinstance(value, dict):
        masked: dict[str, Any] = {}
        for key, inner in value.items():
            if _is_sensitive_key(str(key)):
                masked[str(key)] = _MASKED_VALUE
            else:
                masked[str(key)] = _mask_value(inner)
        return masked
    if isinstance(value, list):
        return [_mask_value(item) for item in value]
    return value


def _truncate_text(value: str, max_chars: int) -> str:
    if max_chars <= 0 or len(value) <= max_chars:
        return value
    return f"{value[:max_chars]}...(truncated)"


def _is_binary_content_type(content_type: str | None) -> bool:
    if not content_type:
        return False
    lowered = content_type.lower()
    return any(lowered.startswith(prefix) for prefix in _BINARY_CONTENT_TYPE_PREFIXES)


def mask_payload_bytes(body: bytes | None, content_type: str | None, max_chars: int | None = None) -> str | None:
    if not body:
        return None
    if _is_binary_content_type(content_type):
        return None

    text = body.decode("utf-8", errors="replace").strip()
    if not text:
        return None

    max_len = max_chars if max_chars is not None else settings.api_audit_log_max_body_chars
    try:
        parsed = json.loads(text)
        masked = _mask_value(parsed)
        serialized = json.dumps(masked, ensure_ascii=False, default=str)
        return _truncate_text(serialized, max_len)
    except Exception:
        return _truncate_text(text, max_len)


def write_api_audit_log(entry: dict[str, Any]) -> None:
    if not settings.api_audit_log_enabled:
        return

    session = get_session_maker()()
    try:
        row = ApiAuditLog(**entry)
        if row.user_id is not None and not row.role:
            role = session.scalar(select(User.role).where(User.id == row.user_id))
            if role:
                row.role = str(role)
        session.add(row)
        session.commit()
    except Exception:
        session.rollback()
    finally:
        session.close()
