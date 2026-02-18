from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, String, Text, UniqueConstraint, text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Holding(Base):
    __tablename__ = "holdings"
    __table_args__ = (
        UniqueConstraint(
            "owner_user_id",
            "portfolio_id",
            "asset_id",
            name="uq_holdings_owner_portfolio_asset",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    owner_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    portfolio_id: Mapped[int | None] = mapped_column(ForeignKey("portfolios.id"), nullable=True, index=True)
    asset_id: Mapped[int] = mapped_column(ForeignKey("assets.id"), nullable=False, index=True)
    quantity: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    avg_price: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    avg_price_currency: Mapped[str] = mapped_column(String(3), nullable=False, server_default="KRW")
    invested_amount: Mapped[Decimal | None] = mapped_column(Numeric(18, 2), nullable=True)
    invested_amount_currency: Mapped[str] = mapped_column(String(3), nullable=False, server_default="KRW")
    source_type: Mapped[str] = mapped_column(
        Enum("MANUAL", "AUTO", name="holding_source_type"),
        nullable=False,
        server_default="MANUAL",
    )
    is_hidden: Mapped[bool] = mapped_column(nullable=False, server_default=text("0"))
    memo: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP"),
    )
