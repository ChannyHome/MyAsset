from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, JSON, String, UniqueConstraint, text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Asset(Base):
    __tablename__ = "assets"
    __table_args__ = (UniqueConstraint("asset_class", "symbol", "exchange_code", name="uq_assets_class_symbol_exchange"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    asset_class: Mapped[str] = mapped_column(
        Enum("STOCK", "CRYPTO", "REAL_ESTATE", "DEPOSIT_SAVING", "BOND", "ETC", name="asset_class"),
        nullable=False,
        index=True,
    )
    symbol: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, server_default="KRW")
    quote_mode: Mapped[str] = mapped_column(
        Enum("AUTO", "MANUAL", name="asset_quote_mode"),
        nullable=False,
        server_default="AUTO",
    )
    exchange_code: Mapped[str] = mapped_column(String(20), nullable=False, server_default="GLOBAL", index=True)
    is_trade_supported: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("1"))
    meta_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP"),
    )
