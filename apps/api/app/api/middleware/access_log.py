import time
from datetime import datetime, timezone

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.api_access_logger import write_api_access_log
from app.core.config import settings
from app.core.security import decode_token


def _extract_user_id(request: Request) -> int | None:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None

    token = auth_header.removeprefix("Bearer ").strip()
    if not token:
        return None

    try:
        payload = decode_token(token)
        subject = payload.get("sub")
        return int(subject) if subject is not None else None
    except Exception:
        return None


class ApiAccessLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.perf_counter()
        response = None

        try:
            response = await call_next(request)
            return response
        finally:
            if not settings.api_access_log_enabled:
                pass
            else:
                duration_ms = round((time.perf_counter() - start) * 1000, 3)
                status_code = response.status_code if response is not None else 500

                log_entry = {
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "action": f"{request.method} {request.url.path}",
                    "method": request.method,
                    "path": request.url.path,
                    "query": request.url.query,
                    "status_code": status_code,
                    "duration_ms": duration_ms,
                    "user_id": _extract_user_id(request),
                    "client_ip": request.client.host if request.client else None,
                    "user_agent": request.headers.get("User-Agent", ""),
                }
                write_api_access_log(log_entry)
