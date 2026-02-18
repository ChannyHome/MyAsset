from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import Date, DateTime, Enum, Numeric, String, UniqueConstraint, text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class ValuationSnapshot(Base):
    __tablename__ = "valuation_snapshots"
    __table_args__ = (
        UniqueConstraint(
            "scope_type",
            "scope_id",
            "display_currency",
            "snapshot_date",
            name="uq_valuation_scope_date",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    scope_type: Mapped[str] = mapped_column(
        Enum("USER", "HOUSEHOLD", name="valuation_scope_type"),
        nullable=False,
        index=True,
    )
    scope_id: Mapped[int] = mapped_column(nullable=False, index=True)
    display_currency: Mapped[str] = mapped_column(String(3), nullable=False, server_default="KRW")
    snapshot_date: Mapped[date] = mapped_column(Date(), nullable=False, index=True)
    assets_total: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False, server_default=text("0"))
    liabilities_total: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False, server_default=text("0"))
    net_worth_total: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False, server_default=text("0"))
    as_of: Mapped[datetime] = mapped_column(DateTime(), nullable=False)
    source: Mapped[str] = mapped_column(String(50), nullable=False, server_default="SYSTEM")
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
