from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Numeric, String, text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class SnapshotSet(Base):
    __tablename__ = "snapshot_sets"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    owner_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    source_type: Mapped[str] = mapped_column(String(30), nullable=False, server_default="MANUAL")
    note: Mapped[str | None] = mapped_column(String(500), nullable=True)
    captured_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, index=True)
    as_of: Mapped[datetime] = mapped_column(DateTime(), nullable=False)
    display_currency_at_capture: Mapped[str] = mapped_column(String(3), nullable=False, server_default="KRW")
    fx_usd_krw_rate: Mapped[Decimal | None] = mapped_column(Numeric(24, 8), nullable=True)
    fx_as_of: Mapped[datetime | None] = mapped_column(DateTime(), nullable=True)
    fx_source: Mapped[str | None] = mapped_column(String(50), nullable=True)
    gross_assets_krw: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    gross_assets_usd: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    liabilities_krw: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    liabilities_usd: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    net_assets_krw: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    net_assets_usd: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    invested_principal_krw: Mapped[Decimal] = mapped_column(
        Numeric(24, 8), nullable=False, server_default=text("0")
    )
    invested_principal_usd: Mapped[Decimal] = mapped_column(
        Numeric(24, 8), nullable=False, server_default=text("0")
    )
    debt_adjusted_principal_krw: Mapped[Decimal] = mapped_column(
        Numeric(24, 8), nullable=False, server_default=text("0")
    )
    debt_adjusted_principal_usd: Mapped[Decimal] = mapped_column(
        Numeric(24, 8), nullable=False, server_default=text("0")
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))


class SnapshotPortfolioRow(Base):
    __tablename__ = "snapshot_portfolio_rows"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    snapshot_id: Mapped[int] = mapped_column(ForeignKey("snapshot_sets.id"), nullable=False, index=True)
    portfolio_id: Mapped[int | None] = mapped_column(nullable=True, index=True)
    portfolio_name: Mapped[str] = mapped_column(String(255), nullable=False)
    portfolio_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    base_currency: Mapped[str | None] = mapped_column(String(3), nullable=True)
    gross_assets_krw: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    gross_assets_usd: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    liabilities_krw: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    liabilities_usd: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    net_assets_krw: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    net_assets_usd: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    invested_principal_krw: Mapped[Decimal] = mapped_column(
        Numeric(24, 8), nullable=False, server_default=text("0")
    )
    invested_principal_usd: Mapped[Decimal] = mapped_column(
        Numeric(24, 8), nullable=False, server_default=text("0")
    )
    debt_adjusted_principal_krw: Mapped[Decimal] = mapped_column(
        Numeric(24, 8), nullable=False, server_default=text("0")
    )
    debt_adjusted_principal_usd: Mapped[Decimal] = mapped_column(
        Numeric(24, 8), nullable=False, server_default=text("0")
    )
    portfolio_profit_krw: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    portfolio_profit_usd: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    return_pct: Mapped[Decimal | None] = mapped_column(Numeric(24, 8), nullable=True)
    net_contribution_krw: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    net_contribution_usd: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))


class SnapshotHoldingRow(Base):
    __tablename__ = "snapshot_holding_rows"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    snapshot_id: Mapped[int] = mapped_column(ForeignKey("snapshot_sets.id"), nullable=False, index=True)
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
    evaluated_krw: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    evaluated_usd: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    cost_basis_krw: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    cost_basis_usd: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    profit_krw: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    profit_usd: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    return_pct: Mapped[Decimal | None] = mapped_column(Numeric(24, 8), nullable=True)
    quote_as_of: Mapped[datetime | None] = mapped_column(DateTime(), nullable=True)
    quote_source: Mapped[str | None] = mapped_column(String(50), nullable=True)


class SnapshotLiabilityRow(Base):
    __tablename__ = "snapshot_liability_rows"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    snapshot_id: Mapped[int] = mapped_column(ForeignKey("snapshot_sets.id"), nullable=False, index=True)
    portfolio_id: Mapped[int | None] = mapped_column(nullable=True, index=True)
    portfolio_name: Mapped[str] = mapped_column(String(255), nullable=False)
    liability_id: Mapped[int | None] = mapped_column(nullable=True, index=True)
    liability_name: Mapped[str] = mapped_column(String(255), nullable=False)
    liability_type: Mapped[str] = mapped_column(String(50), nullable=False)
    balance: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    balance_currency: Mapped[str] = mapped_column(String(3), nullable=False)
    balance_krw: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    balance_usd: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
