from datetime import datetime

from sqlalchemy import DateTime, Enum, JSON, String, UniqueConstraint, text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Asset(Base):
    __tablename__ = "assets"
    __table_args__ = (UniqueConstraint("asset_class", "symbol", name="uq_assets_class_symbol"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    asset_class: Mapped[str] = mapped_column(
        Enum("STOCK", "CRYPTO", "REAL_ESTATE", "DEPOSIT_SAVING", "BOND", "ETC", name="asset_class"),
        nullable=False,
        index=True,
    )
    symbol: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, server_default="KRW")
    meta_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP"),
    )
