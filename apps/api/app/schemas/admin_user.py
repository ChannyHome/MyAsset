from datetime import datetime

from pydantic import BaseModel, Field


class AdminUserOut(BaseModel):
    id: int
    email: str
    display_name: str
    role: str
    status: str
    is_active: bool
    must_change_password: bool
    created_at: datetime
    updated_at: datetime


class AdminUserRoleUpdateIn(BaseModel):
    role: str = Field(pattern="^(ADMIN|MAINTAINER|SUPERUSER|USER|GUEST)$")


class AdminUserStatusUpdateIn(BaseModel):
    status: str = Field(pattern="^(ACTIVE|SUSPENDED|DEACTIVATED)$")
    successor_user_id: int | None = None


class AdminUserPasswordResetIn(BaseModel):
    temporary_password: str | None = Field(default=None, min_length=8, max_length=128)


class AdminUserPasswordResetOut(BaseModel):
    user_id: int
    temporary_password: str
    must_change_password: bool