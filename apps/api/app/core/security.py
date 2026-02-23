from datetime import UTC, datetime, timedelta

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")



def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)



def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)



def _create_token(*, subject: str, token_type: str, expires_minutes: int) -> str:
    expire_at = datetime.now(UTC) + timedelta(minutes=expires_minutes)
    payload = {"sub": subject, "exp": expire_at, "typ": token_type}
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def create_access_token(subject: str, expires_minutes: int | None = None) -> str:
    expire_minutes = expires_minutes or settings.jwt_access_token_expire_minutes
    return _create_token(subject=subject, token_type="access", expires_minutes=expire_minutes)


def create_refresh_token(subject: str, expires_minutes: int | None = None) -> str:
    expire_minutes = expires_minutes or settings.jwt_refresh_token_expire_minutes
    return _create_token(subject=subject, token_type="refresh", expires_minutes=expire_minutes)


def decode_token(token: str, expected_token_type: str = "access") -> dict:
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except JWTError as exc:
        raise ValueError("invalid token") from exc

    token_type = payload.get("typ")
    # Backward compatibility for old access tokens minted before "typ" claim existed.
    if token_type is None and expected_token_type == "access":
        return payload

    if token_type != expected_token_type:
        raise ValueError("invalid token type")
    return payload
