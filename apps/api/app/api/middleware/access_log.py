import time
from datetime import datetime, timezone

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.api_access_logger import write_api_access_log
from app.core.api_audit_logger import mask_payload_bytes, write_api_audit_log
from app.core.config import settings
from app.core.security import decode_token


def _extract_user_context(request: Request) -> tuple[int | None, str | None]:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None, None

    token = auth_header.removeprefix("Bearer ").strip()
    if not token:
        return None, None

    try:
        payload = decode_token(token)
        subject = payload.get("sub")
        user_id = int(subject) if subject is not None else None
        role = payload.get("role")
        return user_id, str(role).upper() if role else None
    except Exception:
        return None, None


def _derive_resource(path: str) -> tuple[str | None, int | None]:
    segments = [segment for segment in path.split("/") if segment]
    if len(segments) < 3 or segments[0] != "api" or segments[1] != "v1":
        return None, None

    resource_type = segments[2]
    resource_id = None
    for segment in segments[3:]:
        if segment.isdigit():
            resource_id = int(segment)
            break

    return resource_type, resource_id


class ApiAccessLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.perf_counter()
        response = None
        request_body = b""
        request_body_masked = None

        try:
            request_body = await request.body()
            request_body_masked = mask_payload_bytes(
                request_body,
                request.headers.get("content-type"),
                settings.api_audit_log_max_body_chars,
            )
        except Exception:
            request_body = b""
            request_body_masked = None

        try:
            response = await call_next(request)
            return response
        finally:
            duration_ms = int(round((time.perf_counter() - start) * 1000))
            status_code = response.status_code if response is not None else 500
            timestamp_now = datetime.now(timezone.utc).replace(tzinfo=None)
            user_id, role = _extract_user_context(request)
            resource_type, resource_id = _derive_resource(request.url.path)

            response_body_masked = None
            try:
                response_body = getattr(response, "body", None) if response is not None else None
                if isinstance(response_body, (bytes, bytearray)):
                    response_body_masked = mask_payload_bytes(
                        bytes(response_body),
                        response.headers.get("content-type") if response is not None else None,
                        settings.api_audit_log_max_body_chars,
                    )
            except Exception:
                response_body_masked = None

            result = "SUCCESS" if 200 <= status_code < 400 else "ERROR"
            action_name = f"{request.method} {request.url.path}"

            file_log_entry = {
                "timestamp": timestamp_now.isoformat(),
                "action": action_name,
                "method": request.method,
                "path": request.url.path,
                "query": request.url.query,
                "status_code": status_code,
                "duration_ms": duration_ms,
                "user_id": user_id,
                "role": role,
                "client_ip": request.client.host if request.client else None,
                "user_agent": request.headers.get("User-Agent", ""),
            }
            write_api_access_log(file_log_entry)

            audit_log_entry = {
                "timestamp": timestamp_now,
                "user_id": user_id,
                "role": role,
                "method": request.method.upper(),
                "path": request.url.path,
                "query": request.url.query or None,
                "status_code": status_code,
                "duration_ms": duration_ms,
                "client_ip": request.client.host if request.client else None,
                "user_agent": request.headers.get("User-Agent", ""),
                "action_name": action_name,
                "resource_type": resource_type,
                "resource_id": resource_id,
                "result": result,
                "request_body_masked": request_body_masked,
                "response_body_masked": response_body_masked,
            }
            write_api_audit_log(audit_log_entry)
