from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    BigInteger,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Numeric,
    String,
    UniqueConstraint,
    text,
)
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

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    scope_type: Mapped[str] = mapped_column(
        Enum("USER", "HOUSEHOLD", name="valuation_scope_type"),
        nullable=False,
        index=True,
    )
    scope_id: Mapped[int] = mapped_column(BigInteger, nullable=False, index=True)
    display_currency: Mapped[str] = mapped_column(String(3), nullable=False, server_default="KRW")
    snapshot_date: Mapped[date] = mapped_column(Date(), nullable=False, index=True)
    assets_total: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False, server_default=text("0"))
    liabilities_total: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False, server_default=text("0"))
    net_worth_total: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False, server_default=text("0"))
    as_of: Mapped[datetime] = mapped_column(DateTime(), nullable=False)
    source: Mapped[str] = mapped_column(String(50), nullable=False, server_default="SYSTEM")
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))


class ValuationSnapshotPortfolioRow(Base):
    __tablename__ = "valuation_snapshot_portfolio_rows"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    valuation_snapshot_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("valuation_snapshots.id"),
        nullable=False,
        index=True,
    )
    portfolio_id: Mapped[int | None] = mapped_column(nullable=True, index=True)
    portfolio_name: Mapped[str] = mapped_column(String(255), nullable=False)
    portfolio_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    base_currency: Mapped[str | None] = mapped_column(String(3), nullable=True)
    gross_assets_total: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    liabilities_total: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    net_assets_total: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    invested_principal_total: Mapped[Decimal] = mapped_column(
        Numeric(24, 8), nullable=False, server_default=text("0")
    )
    debt_adjusted_principal_total: Mapped[Decimal] = mapped_column(
        Numeric(24, 8), nullable=False, server_default=text("0")
    )
    net_contribution_total: Mapped[Decimal] = mapped_column(
        Numeric(24, 8), nullable=False, server_default=text("0")
    )
    portfolio_profit_total: Mapped[Decimal] = mapped_column(
        Numeric(24, 8), nullable=False, server_default=text("0")
    )
    return_pct: Mapped[Decimal | None] = mapped_column(Numeric(24, 8), nullable=True)


class ValuationSnapshotHoldingRow(Base):
    __tablename__ = "valuation_snapshot_holding_rows"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    valuation_snapshot_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("valuation_snapshots.id"),
        nullable=False,
        index=True,
    )
    portfolio_id: Mapped[int | None] = mapped_column(nullable=True, index=True)
    portfolio_name: Mapped[str] = mapped_column(String(255), nullable=False)
    asset_id: Mapped[int | None] = mapped_column(nullable=True, index=True)
    asset_name: Mapped[str] = mapped_column(String(255), nullable=False)
    symbol: Mapped[str | None] = mapped_column(String(32), nullable=True)
    asset_class: Mapped[str] = mapped_column(String(50), nullable=False)
    asset_currency: Mapped[str] = mapped_column(String(3), nullable=False)
    quantity: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    current_price: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    current_price_currency: Mapped[str] = mapped_column(String(3), nullable=False)
    avg_cost: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    avg_cost_currency: Mapped[str] = mapped_column(String(3), nullable=False)
    evaluated_amount: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    cost_basis_total: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    profit_total: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    return_pct: Mapped[Decimal | None] = mapped_column(Numeric(24, 8), nullable=True)
    quote_as_of: Mapped[datetime | None] = mapped_column(DateTime(), nullable=True)
    quote_source: Mapped[str | None] = mapped_column(String(50), nullable=True)


class ValuationSnapshotLiabilityRow(Base):
    __tablename__ = "valuation_snapshot_liability_rows"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    valuation_snapshot_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("valuation_snapshots.id"),
        nullable=False,
        index=True,
    )
    portfolio_id: Mapped[int | None] = mapped_column(nullable=True, index=True)
    portfolio_name: Mapped[str] = mapped_column(String(255), nullable=False)
    liability_id: Mapped[int | None] = mapped_column(nullable=True, index=True)
    liability_name: Mapped[str] = mapped_column(String(255), nullable=False)
    liability_type: Mapped[str] = mapped_column(String(50), nullable=False)
    balance: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    balance_currency: Mapped[str] = mapped_column(String(3), nullable=False)
    balance_total: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
