from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Numeric, String, UniqueConstraint, text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class LatestQuote(Base):
    __tablename__ = "latest_quotes"
    __table_args__ = (UniqueConstraint("asset_id", name="uq_latest_quotes_asset_id"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    asset_id: Mapped[int] = mapped_column(ForeignKey("assets.id"), nullable=False, index=True)
    price: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)
    change_value: Mapped[Decimal | None] = mapped_column(Numeric(24, 8), nullable=True)
    change_pct: Mapped[Decimal | None] = mapped_column(Numeric(12, 6), nullable=True)
    as_of: Mapped[datetime] = mapped_column(DateTime(), nullable=False, index=True)
    source: Mapped[str] = mapped_column(String(50), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP"),
    )

