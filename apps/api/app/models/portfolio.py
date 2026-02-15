from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, String, Text, text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Portfolio(Base):
    __tablename__ = "portfolios"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    owner_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    type: Mapped[str] = mapped_column(
        Enum("BROKER", "EXCHANGE", "BANK", "CASH", "ETC", name="portfolio_type"),
        nullable=False,
        server_default="ETC",
    )
    base_currency: Mapped[str] = mapped_column(String(3), nullable=False, server_default="KRW")
    category: Mapped[str | None] = mapped_column(
        Enum(
            "KR_STOCK",
            "US_STOCK",
            "CRYPTO",
            "REAL_ESTATE",
            "BOND",
            "CASH",
            "DEPOSIT_SAVING",
            "ETC",
            name="portfolio_category",
        ),
        nullable=True,
    )
    memo: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_included: Mapped[bool] = mapped_column(nullable=False, server_default=text("1"))
    is_hidden: Mapped[bool] = mapped_column(nullable=False, server_default=text("0"))
    cumulative_deposit_amount: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False, server_default=text("0"))
    cumulative_withdrawal_amount: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False, server_default=text("0"))
    cashflow_source_type: Mapped[str] = mapped_column(
        Enum("MANUAL", "AUTO", name="portfolio_cashflow_source_type"),
        nullable=False,
        server_default="MANUAL",
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP"),
    )
