from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, Numeric, String, text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class UserSetting(Base):
    __tablename__ = "user_settings"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    # Keep as plain nullable ID in ORM mapping.
    # DB-level FK can still exist, but this avoids requiring a Dashboard model mapping.
    home_dashboard_id: Mapped[int | None] = mapped_column(nullable=True)
    default_scope_type: Mapped[str] = mapped_column(
        Enum("USER", "HOUSEHOLD", name="default_scope_type"),
        nullable=False,
        server_default="HOUSEHOLD",
    )
    default_scope_id: Mapped[int | None] = mapped_column(nullable=True)
    hide_values: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("0"))
    name_clamp_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("1"))
    mobile_allocation_top_n: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("6"))
    hide_small_assets: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("0"))
    small_asset_threshold: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False, server_default=text("100000"))
    display_currency: Mapped[str] = mapped_column(String(3), nullable=False, server_default="KRW")
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP"),
    )
