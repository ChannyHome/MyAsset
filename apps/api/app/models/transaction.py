from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Numeric, String, Text, text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    owner_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    portfolio_id: Mapped[int] = mapped_column(ForeignKey("portfolios.id"), nullable=False, index=True)
    asset_id: Mapped[int | None] = mapped_column(ForeignKey("assets.id"), nullable=True, index=True)
    txn_type: Mapped[str] = mapped_column(
        Enum(
            "BUY",
            "SELL",
            "DEPOSIT",
            "WITHDRAW",
            "DIVIDEND",
            "FEE",
            "ADJUSTMENT",
            name="transaction_type",
        ),
        nullable=False,
    )
    quantity: Mapped[Decimal | None] = mapped_column(Numeric(24, 8), nullable=True)
    unit_price: Mapped[Decimal | None] = mapped_column(Numeric(24, 8), nullable=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False, server_default=text("0"))
    currency: Mapped[str] = mapped_column(String(3), nullable=False, server_default="KRW")
    amount_in_portfolio_currency: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False, server_default=text("0"))
    fx_rate_used: Mapped[Decimal | None] = mapped_column(Numeric(24, 8), nullable=True)
    fx_as_of: Mapped[datetime | None] = mapped_column(DateTime(), nullable=True)
    fx_source: Mapped[str | None] = mapped_column(String(50), nullable=True)
    executed_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    memo: Mapped[str | None] = mapped_column(Text, nullable=True)
    source_type: Mapped[str] = mapped_column(
        Enum("MANUAL", "AUTO", name="transaction_source_type"),
        nullable=False,
        server_default="MANUAL",
    )
    auto_apply_cash_holding: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("1"),
    )
    auto_apply_portfolio_cashflow: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        server_default=text("1"),
    )
    status: Mapped[str] = mapped_column(
        Enum("POSTED", "VOID", name="transaction_status"),
        nullable=False,
        server_default="POSTED",
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP"),
    )
