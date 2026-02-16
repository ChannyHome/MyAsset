from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, String, text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(nullable=False, server_default=text("1"))
    role: Mapped[str] = mapped_column(
        Enum("ADMIN", "MAINTAINER", "SUPERUSER", "USER", "GUEST", name="user_role"),
        nullable=False,
        server_default="USER",
    )
    status: Mapped[str] = mapped_column(
        Enum("ACTIVE", "SUSPENDED", "DEACTIVATED", name="user_status"),
        nullable=False,
        server_default="ACTIVE",
    )
    must_change_password: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("0"))
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP"),
    )