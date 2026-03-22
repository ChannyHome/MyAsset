from __future__ import annotations

from dataclasses import dataclass
from time import perf_counter
from typing import Any

import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.app_secret import AppSecret
from app.models.user import User
from app.schemas.chat import OpenAIAdminConfigOut, OpenAIAdminTestOut
from app.services.app_settings import get_openai_enabled, set_openai_enabled
from app.services.secret_vault import encrypt_secret, mask_secret, resolve_secret_value

OPENAI_PROVIDER = "OPENAI"
OPENAI_API_KEY_NAME = "API_KEY"
OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses"


class OpenAIConfigError(RuntimeError):
    pass


class OpenAIRequestError(OpenAIConfigError):
    def __init__(
        self,
        detail: str,
        *,
        status_code: int | None = None,
        error_code: str | None = None,
        error_category: str | None = None,
        hint: str | None = None,
    ) -> None:
        super().__init__(detail)
        self.detail = detail
        self.status_code = status_code
        self.error_code = error_code
        self.error_category = error_category
        self.hint = hint


@dataclass
class ResolvedOpenAIConfig:
    enabled: bool
    enabled_source: str
    api_key: str | None
    source: str
    default_model: str
    heavy_model: str
    project_id: str | None
    organization_id: str | None
    timeout_seconds: float
    reasoning_effort_default: str
    reasoning_effort_heavy: str


@dataclass
class OpenAIResponseResult:
    model_name: str
    output_text: str
    usage: dict[str, Any] | None
    latency_ms: int
    raw_response: dict[str, Any]


def _resolve_openai_api_key(db: Session) -> tuple[str | None, str]:
    return resolve_secret_value(
        db=db,
        provider=OPENAI_PROVIDER,
        key_name=OPENAI_API_KEY_NAME,
        env_fallback=settings.openai_api_key,
    )


def resolve_openai_config(db: Session) -> ResolvedOpenAIConfig:
    enabled, enabled_source = get_openai_enabled(db)
    api_key, source = _resolve_openai_api_key(db)
    return ResolvedOpenAIConfig(
        enabled=enabled,
        enabled_source=enabled_source,
        api_key=api_key,
        source=source,
        default_model=settings.openai_default_model,
        heavy_model=settings.openai_heavy_model,
        project_id=(settings.openai_project_id or "").strip() or None,
        organization_id=(settings.openai_organization_id or "").strip() or None,
        timeout_seconds=float(settings.openai_timeout_seconds or 45.0),
        reasoning_effort_default=settings.openai_reasoning_effort_default,
        reasoning_effort_heavy=settings.openai_reasoning_effort_heavy,
    )


def build_openai_admin_config(db: Session) -> OpenAIAdminConfigOut:
    config = resolve_openai_config(db)
    masked_api_key = mask_secret(config.api_key) if config.api_key else None
    return OpenAIAdminConfigOut(
        enabled=config.enabled,
        enabled_source=config.enabled_source,
        source=config.source,  # type: ignore[arg-type]
        masked_api_key=masked_api_key,
        default_model=config.default_model,
        heavy_model=config.heavy_model,
        project_id=config.project_id,
        organization_id=config.organization_id,
        timeout_seconds=config.timeout_seconds,
    )


def _upsert_openai_api_key(db: Session, *, current_user: User, api_key: str) -> None:
    normalized = api_key.strip()
    if not normalized:
        raise ValueError("api_key is required")
    encrypted = encrypt_secret(normalized)
    row = db.scalar(
        select(AppSecret).where(
            AppSecret.provider == OPENAI_PROVIDER,
            AppSecret.key_name == OPENAI_API_KEY_NAME,
        )
    )
    if row is None:
        row = AppSecret(
            provider=OPENAI_PROVIDER,
            key_name=OPENAI_API_KEY_NAME,
            encrypted_value=encrypted,
            description="OpenAI API key for Chat v1",
            is_active=True,
            created_by_user_id=current_user.id,
            updated_by_user_id=current_user.id,
        )
        db.add(row)
    else:
        row.encrypted_value = encrypted
        row.is_active = True
        row.updated_by_user_id = current_user.id
    db.flush()


def disable_openai_api_key(db: Session, *, current_user: User) -> None:
    row = db.scalar(
        select(AppSecret).where(
            AppSecret.provider == OPENAI_PROVIDER,
            AppSecret.key_name == OPENAI_API_KEY_NAME,
        )
    )
    if row is None:
        return
    row.is_active = False
    row.updated_by_user_id = current_user.id
    db.flush()


def update_openai_admin_config(
    db: Session,
    *,
    current_user: User,
    enabled: bool | None,
    api_key: str | None,
    disable_api_key: bool,
) -> OpenAIAdminConfigOut:
    if enabled is not None:
        set_openai_enabled(db, enabled)
    if api_key is not None:
        _upsert_openai_api_key(db, current_user=current_user, api_key=api_key)
    if disable_api_key:
        disable_openai_api_key(db, current_user=current_user)
    db.commit()
    return build_openai_admin_config(db)


def _extract_output_text(payload: dict[str, Any]) -> str:
    output_text = payload.get("output_text")
    if isinstance(output_text, str) and output_text.strip():
        return output_text.strip()

    parts: list[str] = []
    for item in payload.get("output", []) or []:
        if not isinstance(item, dict):
            continue
        for content in item.get("content", []) or []:
            if not isinstance(content, dict):
                continue
            text_value = content.get("text")
            if isinstance(text_value, str) and text_value.strip():
                parts.append(text_value.strip())
    return "\n\n".join(parts).strip()


def _classify_openai_http_error(response: httpx.Response) -> OpenAIRequestError:
    status_code = response.status_code
    error_code: str | None = None
    error_type: str | None = None
    message = response.text
    try:
        payload = response.json()
    except ValueError:
        payload = None
    if isinstance(payload, dict):
        error_obj = payload.get("error")
        if isinstance(error_obj, dict):
            error_code = str(error_obj.get("code") or "").strip() or None
            error_type = str(error_obj.get("type") or "").strip() or None
            raw_message = error_obj.get("message")
            if isinstance(raw_message, str) and raw_message.strip():
                message = raw_message.strip()
    lowered = f"{error_code or ''} {error_type or ''} {message}".lower()
    error_category = "unknown"
    hint: str | None = None
    if status_code == 429:
        if any(token in lowered for token in ("insufficient_quota", "quota", "billing", "credit", "credits")):
            error_category = "quota"
            hint = "OpenAI quota/credits may be exhausted. Check billing, credits, and project spend limits."
        elif "project" in lowered or "organization" in lowered:
            error_category = "project_limit"
            hint = "The API key may be tied to a restricted project or mismatched project/organization headers."
        else:
            error_category = "rate_limit"
            hint = "OpenAI rate limit was reached. Wait briefly and retry, or review project rate limits."
    elif status_code in {401, 403}:
        error_category = "config"
        hint = "Check whether the API key is valid and whether the selected project/organization is allowed."
    detail = f"OpenAI request failed ({status_code}): {message}"
    return OpenAIRequestError(
        detail,
        status_code=status_code,
        error_code=error_code or error_type,
        error_category=error_category,
        hint=hint,
    )


def call_openai_responses(
    db: Session,
    *,
    system_prompt: str,
    user_prompt: str,
    model_name: str | None = None,
    reasoning_effort: str | None = None,
) -> OpenAIResponseResult:
    config = resolve_openai_config(db)
    if not config.enabled:
        raise OpenAIConfigError("OpenAI chat is disabled")
    if not config.api_key:
        raise OpenAIConfigError("OpenAI API key is not configured")

    headers = {
        "Authorization": f"Bearer {config.api_key}",
        "Content-Type": "application/json",
    }
    if config.project_id:
        headers["OpenAI-Project"] = config.project_id
    if config.organization_id:
        headers["OpenAI-Organization"] = config.organization_id

    payload = {
        "model": model_name or config.default_model,
        "reasoning": {"effort": reasoning_effort or config.reasoning_effort_default},
        "input": [
            {
                "role": "system",
                "content": [{"type": "input_text", "text": system_prompt}],
            },
            {
                "role": "user",
                "content": [{"type": "input_text", "text": user_prompt}],
            },
        ],
    }

    started = perf_counter()
    try:
        response = httpx.post(
            OPENAI_RESPONSES_URL,
            headers=headers,
            json=payload,
            timeout=config.timeout_seconds,
        )
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        raise _classify_openai_http_error(exc.response) from exc
    except httpx.HTTPError as exc:
        raise OpenAIConfigError(f"OpenAI request failed: {exc}") from exc
    latency_ms = int((perf_counter() - started) * 1000)
    data = response.json()
    text = _extract_output_text(data)
    if not text:
        raise OpenAIConfigError("OpenAI response did not include output text")

    return OpenAIResponseResult(
        model_name=str(data.get("model") or payload["model"]),
        output_text=text,
        usage=data.get("usage") if isinstance(data.get("usage"), dict) else None,
        latency_ms=latency_ms,
        raw_response=data,
    )


def test_openai_connection(db: Session) -> OpenAIAdminTestOut:
    config = resolve_openai_config(db)
    try:
        result = call_openai_responses(
            db,
            system_prompt="Reply with exactly: OK",
            user_prompt="OK",
            model_name=config.default_model,
            reasoning_effort=config.reasoning_effort_default,
        )
        return OpenAIAdminTestOut(
            ok=True,
            source=config.source,  # type: ignore[arg-type]
            model_name=result.model_name,
            latency_ms=result.latency_ms,
            output_text=result.output_text,
            detail=None,
        )
    except Exception as exc:
        if isinstance(exc, OpenAIRequestError):
            return OpenAIAdminTestOut(
                ok=False,
                source=config.source,  # type: ignore[arg-type]
                model_name=config.default_model,
                latency_ms=0,
                output_text=None,
                detail=exc.detail,
                status_code=exc.status_code,
                error_code=exc.error_code,
                error_category=exc.error_category,  # type: ignore[arg-type]
                hint=exc.hint,
            )
        return OpenAIAdminTestOut(
            ok=False,
            source=config.source,  # type: ignore[arg-type]
            model_name=config.default_model,
            latency_ms=0,
            output_text=None,
            detail=str(exc),
            status_code=None,
            error_code=None,
            error_category="config" if isinstance(exc, OpenAIConfigError) else "unknown",
            hint="Check OpenAI key storage, project headers, and network connectivity." if isinstance(exc, OpenAIConfigError) else None,
        )
