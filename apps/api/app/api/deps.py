from typing import Callable

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.security import decode_token
from app.models.user import User

bearer_scheme = HTTPBearer(auto_error=False)

_ROLE_LEVELS = {
    "GUEST": 0,
    "USER": 1,
    "SUPERUSER": 1,
    "MAINTAINER": 2,
    "ADMIN": 3,
}


def _role_level(role: str | None) -> int:
    if role is None:
        return -1
    return _ROLE_LEVELS.get(role.upper(), -1)


def get_current_user_any(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    try:
        payload = decode_token(credentials.credentials)
        subject = payload.get("sub", "")
        user_id = int(subject)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc

    user = db.scalar(select(User).where(User.id == user_id))
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    if not user.is_active or user.status != "ACTIVE":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is inactive")

    return user


def get_current_user(current_user: User = Depends(get_current_user_any)) -> User:
    if _role_level(current_user.role) < _role_level("USER"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Guest cannot access this resource")
    return current_user


def require_min_role(min_role: str) -> Callable:
    min_level = _role_level(min_role)

    def _dependency(current_user: User = Depends(get_current_user_any)) -> User:
        if min_level < 0:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Invalid role guard")
        if _role_level(current_user.role) < min_level:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role")
        return current_user

    return _dependency