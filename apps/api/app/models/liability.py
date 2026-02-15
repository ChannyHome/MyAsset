from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, String, Text, text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Liability(Base):
    __tablename__ = "liabilities"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    owner_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    portfolio_id: Mapped[int | None] = mapped_column(ForeignKey("portfolios.id"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    liability_type: Mapped[str] = mapped_column(
        Enum("MORTGAGE", "CREDIT_LOAN", "CARD", "ETC", name="liability_type"),
        nullable=False,
        server_default="ETC",
    )
    currency: Mapped[str] = mapped_column(String(3), nullable=False, server_default="KRW")
    outstanding_balance: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False, server_default=text("0"))
    interest_rate: Mapped[Decimal | None] = mapped_column(Numeric(9, 6), nullable=True)
    monthly_payment: Mapped[Decimal | None] = mapped_column(Numeric(18, 2), nullable=True)
    source_type: Mapped[str] = mapped_column(
        Enum("MANUAL", "AUTO", name="liability_source_type"),
        nullable=False,
        server_default="MANUAL",
    )
    is_included: Mapped[bool] = mapped_column(nullable=False, server_default=text("1"))
    is_hidden: Mapped[bool] = mapped_column(nullable=False, server_default=text("0"))
    memo: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP"),
    )
