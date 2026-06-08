from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    BigInteger,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


bigint_pk = BigInteger().with_variant(Integer(), "sqlite")
bigint_fk = BigInteger().with_variant(Integer(), "sqlite")


class AssetProviderIdentifier(Base):
    __tablename__ = "asset_provider_identifiers"
    __table_args__ = (
        UniqueConstraint(
            "asset_id",
            "provider",
            "identifier_type",
            name="uq_asset_provider_identifier",
        ),
    )

    id: Mapped[int] = mapped_column(bigint_pk, primary_key=True, autoincrement=True)
    asset_id: Mapped[int] = mapped_column(bigint_fk, ForeignKey("assets.id"), nullable=False, index=True)
    provider: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    identifier_type: Mapped[str] = mapped_column(String(50), nullable=False)
    identifier_value: Mapped[str] = mapped_column(String(255), nullable=False)
    market: Mapped[str | None] = mapped_column(String(20), nullable=True)
    is_primary: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("1"))
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP"),
    )


class AssetDividendSetting(Base):
    __tablename__ = "asset_dividend_settings"

    id: Mapped[int] = mapped_column(bigint_pk, primary_key=True, autoincrement=True)
    asset_id: Mapped[int] = mapped_column(bigint_fk, ForeignKey("assets.id"), nullable=False, unique=True, index=True)
    is_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("1"))
    tax_rate_pct: Mapped[Decimal | None] = mapped_column(Numeric(9, 4), nullable=True)
    tax_country: Mapped[str | None] = mapped_column(String(10), nullable=True)
    dividend_currency: Mapped[str | None] = mapped_column(String(3), nullable=True)
    manual_annual_dividend_per_share: Mapped[Decimal | None] = mapped_column(Numeric(24, 8), nullable=True)
    manual_frequency: Mapped[str | None] = mapped_column(String(30), nullable=True)
    payment_months_json: Mapped[list[int] | None] = mapped_column(JSON, nullable=True)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP"),
    )


class AssetDividendEvent(Base):
    __tablename__ = "asset_dividend_events"
    __table_args__ = (
        UniqueConstraint(
            "asset_id",
            "provider",
            "provider_event_id",
            name="uq_asset_dividend_event_provider",
        ),
    )

    id: Mapped[int] = mapped_column(bigint_pk, primary_key=True, autoincrement=True)
    asset_id: Mapped[int] = mapped_column(bigint_fk, ForeignKey("assets.id"), nullable=False, index=True)
    provider: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    provider_event_id: Mapped[str] = mapped_column(String(255), nullable=False)
    market: Mapped[str] = mapped_column(String(20), nullable=False)
    symbol: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    isin_code: Mapped[str | None] = mapped_column(String(32), nullable=True)
    crno: Mapped[str | None] = mapped_column(String(32), nullable=True)
    asset_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    dividend_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    declaration_date: Mapped[date | None] = mapped_column(Date(), nullable=True)
    ex_dividend_date: Mapped[date | None] = mapped_column(Date(), nullable=True)
    record_date: Mapped[date | None] = mapped_column(Date(), nullable=True)
    payment_date: Mapped[date | None] = mapped_column(Date(), nullable=True, index=True)
    dividend_base_date: Mapped[date | None] = mapped_column(Date(), nullable=True)
    fiscal_year: Mapped[int | None] = mapped_column(Integer, nullable=True, index=True)
    dividend_currency: Mapped[str] = mapped_column(String(3), nullable=False, server_default="KRW")
    dividend_per_share_gross: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    tax_rate_pct: Mapped[Decimal] = mapped_column(Numeric(9, 4), nullable=False, server_default=text("0"))
    withholding_tax_amount_per_share: Mapped[Decimal] = mapped_column(
        Numeric(24, 8),
        nullable=False,
        server_default=text("0"),
    )
    dividend_per_share_net_estimated: Mapped[Decimal] = mapped_column(
        Numeric(24, 8),
        nullable=False,
        server_default=text("0"),
    )
    status: Mapped[str] = mapped_column(String(30), nullable=False, server_default="ESTIMATED")
    raw_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP"),
    )


class DividendReceipt(Base):
    __tablename__ = "dividend_receipts"

    id: Mapped[int] = mapped_column(bigint_pk, primary_key=True, autoincrement=True)
    owner_user_id: Mapped[int] = mapped_column(bigint_fk, ForeignKey("users.id"), nullable=False, index=True)
    portfolio_id: Mapped[int] = mapped_column(bigint_fk, ForeignKey("portfolios.id"), nullable=False, index=True)
    asset_id: Mapped[int | None] = mapped_column(bigint_fk, ForeignKey("assets.id"), nullable=True, index=True)
    transaction_id: Mapped[int | None] = mapped_column(bigint_fk, ForeignKey("transactions.id"), nullable=True, unique=True)
    received_date: Mapped[date] = mapped_column(Date(), nullable=False, index=True)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, server_default="KRW")
    gross_amount: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    withholding_tax: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    net_amount: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    tax_rate_pct: Mapped[Decimal | None] = mapped_column(Numeric(9, 4), nullable=True)
    tax_country: Mapped[str | None] = mapped_column(String(10), nullable=True)
    status: Mapped[str] = mapped_column(String(30), nullable=False, server_default="POSTED")
    source_type: Mapped[str] = mapped_column(String(30), nullable=False, server_default="MANUAL")
    memo: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP"),
    )


class DividendSnapshot(Base):
    __tablename__ = "dividend_snapshots"
    __table_args__ = (
        UniqueConstraint(
            "scope_type",
            "scope_id",
            "display_currency",
            "dividend_year",
            "snapshot_date",
            name="uq_dividend_snapshot_scope_date",
        ),
    )

    id: Mapped[int] = mapped_column(bigint_pk, primary_key=True, autoincrement=True)
    owner_user_id: Mapped[int | None] = mapped_column(bigint_fk, ForeignKey("users.id"), nullable=True, index=True)
    scope_type: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    scope_id: Mapped[int] = mapped_column(bigint_fk, nullable=False, index=True)
    display_currency: Mapped[str] = mapped_column(String(3), nullable=False, server_default="KRW")
    dividend_year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    snapshot_date: Mapped[date] = mapped_column(Date(), nullable=False, index=True)
    as_of: Mapped[datetime] = mapped_column(DateTime(), nullable=False)
    expected_annual_gross: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    expected_annual_tax: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    expected_annual_net: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    received_ytd_gross: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    received_ytd_tax: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    received_ytd_net: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    source: Mapped[str] = mapped_column(String(50), nullable=False, server_default="DIVIDEND_UPDATE")
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))


class DividendSnapshotAssetRow(Base):
    __tablename__ = "dividend_snapshot_asset_rows"

    id: Mapped[int] = mapped_column(bigint_pk, primary_key=True, autoincrement=True)
    dividend_snapshot_id: Mapped[int] = mapped_column(
        bigint_fk,
        ForeignKey("dividend_snapshots.id"),
        nullable=False,
        index=True,
    )
    portfolio_id: Mapped[int | None] = mapped_column(bigint_fk, ForeignKey("portfolios.id"), nullable=True, index=True)
    portfolio_name: Mapped[str] = mapped_column(String(255), nullable=False)
    asset_id: Mapped[int | None] = mapped_column(bigint_fk, ForeignKey("assets.id"), nullable=True, index=True)
    asset_name: Mapped[str] = mapped_column(String(255), nullable=False)
    symbol: Mapped[str | None] = mapped_column(String(64), nullable=True)
    income_kind: Mapped[str] = mapped_column(String(20), nullable=False, server_default="DIVIDEND")
    asset_currency: Mapped[str] = mapped_column(String(3), nullable=False)
    quantity: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    current_value: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    dividend_currency: Mapped[str] = mapped_column(String(3), nullable=False)
    expected_annual_gross: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    expected_annual_tax: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    expected_annual_net: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    expected_annual_gross_display: Mapped[Decimal] = mapped_column(
        Numeric(24, 8),
        nullable=False,
        server_default=text("0"),
    )
    expected_annual_tax_display: Mapped[Decimal] = mapped_column(
        Numeric(24, 8),
        nullable=False,
        server_default=text("0"),
    )
    expected_annual_net_display: Mapped[Decimal] = mapped_column(
        Numeric(24, 8),
        nullable=False,
        server_default=text("0"),
    )
    received_ytd_gross_display: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    received_ytd_tax_display: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    received_ytd_net_display: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    confirmed_annual_gross_display: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    confirmed_annual_tax_display: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    confirmed_annual_net_display: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    estimated_annual_gross_display: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    estimated_annual_tax_display: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    estimated_annual_net_display: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    dividend_yield_pct: Mapped[Decimal | None] = mapped_column(Numeric(12, 6), nullable=True)
    tax_rate_pct: Mapped[Decimal | None] = mapped_column(Numeric(9, 4), nullable=True)
    tax_profile: Mapped[str | None] = mapped_column(String(30), nullable=True)
    payment_months_json: Mapped[list[int] | None] = mapped_column(JSON, nullable=True)
    estimate_method: Mapped[str | None] = mapped_column(String(50), nullable=True)
    confidence: Mapped[str | None] = mapped_column(String(20), nullable=True)
    missing_reason: Mapped[str | None] = mapped_column(String(100), nullable=True)
    confirmed_event_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    estimated_event_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    status: Mapped[str] = mapped_column(String(30), nullable=False, server_default="NO_EVENTS")


class DividendSnapshotPortfolioRow(Base):
    __tablename__ = "dividend_snapshot_portfolio_rows"

    id: Mapped[int] = mapped_column(bigint_pk, primary_key=True, autoincrement=True)
    dividend_snapshot_id: Mapped[int] = mapped_column(
        bigint_fk,
        ForeignKey("dividend_snapshots.id"),
        nullable=False,
        index=True,
    )
    portfolio_id: Mapped[int | None] = mapped_column(bigint_fk, ForeignKey("portfolios.id"), nullable=True, index=True)
    portfolio_name: Mapped[str] = mapped_column(String(255), nullable=False)
    portfolio_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    base_currency: Mapped[str | None] = mapped_column(String(3), nullable=True)
    expected_annual_gross_display: Mapped[Decimal] = mapped_column(
        Numeric(24, 8),
        nullable=False,
        server_default=text("0"),
    )
    expected_annual_tax_display: Mapped[Decimal] = mapped_column(
        Numeric(24, 8),
        nullable=False,
        server_default=text("0"),
    )
    expected_annual_net_display: Mapped[Decimal] = mapped_column(
        Numeric(24, 8),
        nullable=False,
        server_default=text("0"),
    )
    received_ytd_gross_display: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    received_ytd_tax_display: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    received_ytd_net_display: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    confirmed_annual_gross_display: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    confirmed_annual_tax_display: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    confirmed_annual_net_display: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    estimated_annual_gross_display: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    estimated_annual_tax_display: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    estimated_annual_net_display: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    dividend_yield_pct: Mapped[Decimal | None] = mapped_column(Numeric(12, 6), nullable=True)


class DividendUpdateRun(Base):
    __tablename__ = "dividend_update_runs"

    id: Mapped[int] = mapped_column(bigint_pk, primary_key=True, autoincrement=True)
    run_type: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    scheduled_run_at: Mapped[datetime | None] = mapped_column(DateTime(), nullable=True, index=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(), nullable=True, index=True)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(), nullable=True, index=True)
    duration_seconds: Mapped[Decimal | None] = mapped_column(Numeric(12, 3), nullable=True)
    total_assets: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    processed_assets: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    updated_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    skipped_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    failed_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    errors_json: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    snapshot_collected: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("0"))
    snapshot_error: Mapped[str | None] = mapped_column(Text, nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
