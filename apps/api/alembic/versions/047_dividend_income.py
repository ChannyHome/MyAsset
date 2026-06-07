"""047 dividend income

Revision ID: 047_dividend_income
Revises: 046_drop_legacy_snapshots
Create Date: 2026-06-07 00:00:00
"""

from alembic import op
import sqlalchemy as sa


revision = "047_dividend_income"
down_revision = "046_drop_legacy_snapshots"
branch_labels = None
depends_on = None


def _insert_default_setting(key: str, value: str) -> None:
    bind = op.get_bind()
    app_settings = sa.table(
        "app_settings",
        sa.column("key", sa.String(100)),
        sa.column("value", sa.Text()),
    )
    exists = bind.execute(sa.select(sa.literal(1)).select_from(app_settings).where(app_settings.c.key == key)).first()
    if exists is None:
        bind.execute(app_settings.insert().values(key=key, value=value))


def upgrade() -> None:
    op.create_table(
        "asset_provider_identifiers",
        sa.Column("id", sa.BigInteger(), nullable=False, autoincrement=True),
        sa.Column("asset_id", sa.BigInteger(), nullable=False),
        sa.Column("provider", sa.String(length=50), nullable=False),
        sa.Column("identifier_type", sa.String(length=50), nullable=False),
        sa.Column("identifier_value", sa.String(length=255), nullable=False),
        sa.Column("market", sa.String(length=20), nullable=True),
        sa.Column("is_primary", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["asset_id"], ["assets.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("asset_id", "provider", "identifier_type", name="uq_asset_provider_identifier"),
    )
    op.create_index("ix_asset_provider_identifiers_asset_id", "asset_provider_identifiers", ["asset_id"])
    op.create_index("ix_asset_provider_identifiers_provider", "asset_provider_identifiers", ["provider"])

    op.create_table(
        "asset_dividend_settings",
        sa.Column("id", sa.BigInteger(), nullable=False, autoincrement=True),
        sa.Column("asset_id", sa.BigInteger(), nullable=False),
        sa.Column("is_enabled", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.Column("tax_rate_pct", sa.Numeric(9, 4), nullable=True),
        sa.Column("tax_country", sa.String(length=10), nullable=True),
        sa.Column("dividend_currency", sa.String(length=3), nullable=True),
        sa.Column("manual_annual_dividend_per_share", sa.Numeric(24, 8), nullable=True),
        sa.Column("manual_frequency", sa.String(length=30), nullable=True),
        sa.Column("payment_months_json", sa.JSON(), nullable=True),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["asset_id"], ["assets.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("asset_id"),
    )
    op.create_index("ix_asset_dividend_settings_asset_id", "asset_dividend_settings", ["asset_id"])

    op.create_table(
        "asset_dividend_events",
        sa.Column("id", sa.BigInteger(), nullable=False, autoincrement=True),
        sa.Column("asset_id", sa.BigInteger(), nullable=False),
        sa.Column("provider", sa.String(length=50), nullable=False),
        sa.Column("provider_event_id", sa.String(length=255), nullable=False),
        sa.Column("market", sa.String(length=20), nullable=False),
        sa.Column("symbol", sa.String(length=64), nullable=True),
        sa.Column("isin_code", sa.String(length=32), nullable=True),
        sa.Column("crno", sa.String(length=32), nullable=True),
        sa.Column("asset_name", sa.String(length=255), nullable=True),
        sa.Column("dividend_type", sa.String(length=100), nullable=True),
        sa.Column("declaration_date", sa.Date(), nullable=True),
        sa.Column("ex_dividend_date", sa.Date(), nullable=True),
        sa.Column("record_date", sa.Date(), nullable=True),
        sa.Column("payment_date", sa.Date(), nullable=True),
        sa.Column("dividend_base_date", sa.Date(), nullable=True),
        sa.Column("fiscal_year", sa.Integer(), nullable=True),
        sa.Column("dividend_currency", sa.String(length=3), nullable=False, server_default="KRW"),
        sa.Column("dividend_per_share_gross", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("tax_rate_pct", sa.Numeric(9, 4), nullable=False, server_default=sa.text("0")),
        sa.Column(
            "withholding_tax_amount_per_share",
            sa.Numeric(24, 8),
            nullable=False,
            server_default=sa.text("0"),
        ),
        sa.Column(
            "dividend_per_share_net_estimated",
            sa.Numeric(24, 8),
            nullable=False,
            server_default=sa.text("0"),
        ),
        sa.Column("status", sa.String(length=30), nullable=False, server_default="ESTIMATED"),
        sa.Column("raw_json", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["asset_id"], ["assets.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("asset_id", "provider", "provider_event_id", name="uq_asset_dividend_event_provider"),
    )
    op.create_index("ix_asset_dividend_events_asset_id", "asset_dividend_events", ["asset_id"])
    op.create_index("ix_asset_dividend_events_provider", "asset_dividend_events", ["provider"])
    op.create_index("ix_asset_dividend_events_symbol", "asset_dividend_events", ["symbol"])
    op.create_index("ix_asset_dividend_events_payment_date", "asset_dividend_events", ["payment_date"])
    op.create_index("ix_asset_dividend_events_fiscal_year", "asset_dividend_events", ["fiscal_year"])

    op.create_table(
        "dividend_receipts",
        sa.Column("id", sa.BigInteger(), nullable=False, autoincrement=True),
        sa.Column("owner_user_id", sa.BigInteger(), nullable=False),
        sa.Column("portfolio_id", sa.BigInteger(), nullable=False),
        sa.Column("asset_id", sa.BigInteger(), nullable=True),
        sa.Column("transaction_id", sa.BigInteger(), nullable=True),
        sa.Column("received_date", sa.Date(), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False, server_default="KRW"),
        sa.Column("gross_amount", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("withholding_tax", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("net_amount", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("tax_rate_pct", sa.Numeric(9, 4), nullable=True),
        sa.Column("tax_country", sa.String(length=10), nullable=True),
        sa.Column("status", sa.String(length=30), nullable=False, server_default="POSTED"),
        sa.Column("source_type", sa.String(length=30), nullable=False, server_default="MANUAL"),
        sa.Column("memo", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["asset_id"], ["assets.id"]),
        sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["portfolio_id"], ["portfolios.id"]),
        sa.ForeignKeyConstraint(["transaction_id"], ["transactions.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("transaction_id"),
    )
    op.create_index("ix_dividend_receipts_owner_user_id", "dividend_receipts", ["owner_user_id"])
    op.create_index("ix_dividend_receipts_portfolio_id", "dividend_receipts", ["portfolio_id"])
    op.create_index("ix_dividend_receipts_asset_id", "dividend_receipts", ["asset_id"])
    op.create_index("ix_dividend_receipts_received_date", "dividend_receipts", ["received_date"])

    op.create_table(
        "dividend_snapshots",
        sa.Column("id", sa.BigInteger(), nullable=False, autoincrement=True),
        sa.Column("owner_user_id", sa.BigInteger(), nullable=True),
        sa.Column("scope_type", sa.String(length=20), nullable=False),
        sa.Column("scope_id", sa.BigInteger(), nullable=False),
        sa.Column("display_currency", sa.String(length=3), nullable=False, server_default="KRW"),
        sa.Column("dividend_year", sa.Integer(), nullable=False),
        sa.Column("snapshot_date", sa.Date(), nullable=False),
        sa.Column("as_of", sa.DateTime(), nullable=False),
        sa.Column("expected_annual_gross", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("expected_annual_tax", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("expected_annual_net", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("received_ytd_gross", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("received_ytd_tax", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("received_ytd_net", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("source", sa.String(length=50), nullable=False, server_default="DIVIDEND_UPDATE"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "scope_type",
            "scope_id",
            "display_currency",
            "dividend_year",
            "snapshot_date",
            name="uq_dividend_snapshot_scope_date",
        ),
    )
    op.create_index("ix_dividend_snapshots_owner_user_id", "dividend_snapshots", ["owner_user_id"])
    op.create_index("ix_dividend_snapshots_scope_type", "dividend_snapshots", ["scope_type"])
    op.create_index("ix_dividend_snapshots_scope_id", "dividend_snapshots", ["scope_id"])
    op.create_index("ix_dividend_snapshots_dividend_year", "dividend_snapshots", ["dividend_year"])
    op.create_index("ix_dividend_snapshots_snapshot_date", "dividend_snapshots", ["snapshot_date"])

    op.create_table(
        "dividend_snapshot_asset_rows",
        sa.Column("id", sa.BigInteger(), nullable=False, autoincrement=True),
        sa.Column("dividend_snapshot_id", sa.BigInteger(), nullable=False),
        sa.Column("portfolio_id", sa.BigInteger(), nullable=True),
        sa.Column("portfolio_name", sa.String(length=255), nullable=False),
        sa.Column("asset_id", sa.BigInteger(), nullable=True),
        sa.Column("asset_name", sa.String(length=255), nullable=False),
        sa.Column("symbol", sa.String(length=64), nullable=True),
        sa.Column("asset_currency", sa.String(length=3), nullable=False),
        sa.Column("quantity", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("current_value", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("dividend_currency", sa.String(length=3), nullable=False),
        sa.Column("expected_annual_gross", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("expected_annual_tax", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("expected_annual_net", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("expected_annual_gross_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("expected_annual_tax_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("expected_annual_net_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("received_ytd_gross_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("received_ytd_tax_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("received_ytd_net_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("dividend_yield_pct", sa.Numeric(12, 6), nullable=True),
        sa.Column("tax_rate_pct", sa.Numeric(9, 4), nullable=True),
        sa.Column("payment_months_json", sa.JSON(), nullable=True),
        sa.Column("status", sa.String(length=30), nullable=False, server_default="NO_EVENTS"),
        sa.ForeignKeyConstraint(["asset_id"], ["assets.id"]),
        sa.ForeignKeyConstraint(["dividend_snapshot_id"], ["dividend_snapshots.id"]),
        sa.ForeignKeyConstraint(["portfolio_id"], ["portfolios.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_dividend_snapshot_asset_rows_dividend_snapshot_id", "dividend_snapshot_asset_rows", ["dividend_snapshot_id"])
    op.create_index("ix_dividend_snapshot_asset_rows_portfolio_id", "dividend_snapshot_asset_rows", ["portfolio_id"])
    op.create_index("ix_dividend_snapshot_asset_rows_asset_id", "dividend_snapshot_asset_rows", ["asset_id"])

    op.create_table(
        "dividend_snapshot_portfolio_rows",
        sa.Column("id", sa.BigInteger(), nullable=False, autoincrement=True),
        sa.Column("dividend_snapshot_id", sa.BigInteger(), nullable=False),
        sa.Column("portfolio_id", sa.BigInteger(), nullable=True),
        sa.Column("portfolio_name", sa.String(length=255), nullable=False),
        sa.Column("portfolio_type", sa.String(length=50), nullable=True),
        sa.Column("base_currency", sa.String(length=3), nullable=True),
        sa.Column("expected_annual_gross_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("expected_annual_tax_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("expected_annual_net_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("received_ytd_gross_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("received_ytd_tax_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("received_ytd_net_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("dividend_yield_pct", sa.Numeric(12, 6), nullable=True),
        sa.ForeignKeyConstraint(["dividend_snapshot_id"], ["dividend_snapshots.id"]),
        sa.ForeignKeyConstraint(["portfolio_id"], ["portfolios.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_dividend_snapshot_portfolio_rows_dividend_snapshot_id",
        "dividend_snapshot_portfolio_rows",
        ["dividend_snapshot_id"],
    )
    op.create_index("ix_dividend_snapshot_portfolio_rows_portfolio_id", "dividend_snapshot_portfolio_rows", ["portfolio_id"])

    op.create_table(
        "dividend_update_runs",
        sa.Column("id", sa.BigInteger(), nullable=False, autoincrement=True),
        sa.Column("run_type", sa.String(length=20), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("scheduled_run_at", sa.DateTime(), nullable=True),
        sa.Column("started_at", sa.DateTime(), nullable=True),
        sa.Column("finished_at", sa.DateTime(), nullable=True),
        sa.Column("duration_seconds", sa.Numeric(12, 3), nullable=True),
        sa.Column("total_assets", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("processed_assets", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("updated_count", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("skipped_count", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("failed_count", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("errors_json", sa.JSON(), nullable=True),
        sa.Column("snapshot_collected", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column("snapshot_error", sa.Text(), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_dividend_update_runs_run_type", "dividend_update_runs", ["run_type"])
    op.create_index("ix_dividend_update_runs_status", "dividend_update_runs", ["status"])
    op.create_index("ix_dividend_update_runs_scheduled_run_at", "dividend_update_runs", ["scheduled_run_at"])
    op.create_index("ix_dividend_update_runs_started_at", "dividend_update_runs", ["started_at"])
    op.create_index("ix_dividend_update_runs_finished_at", "dividend_update_runs", ["finished_at"])

    _insert_default_setting("dividend_auto_update_enabled", "1")
    _insert_default_setting("dividend_update_interval_hours", "24")
    _insert_default_setting("dividend_scheduler_misfire_grace_seconds", "3600")


def downgrade() -> None:
    bind = op.get_bind()
    app_settings = sa.table("app_settings", sa.column("key", sa.String(100)))
    bind.execute(
        app_settings.delete().where(
            app_settings.c.key.in_(
                [
                    "dividend_auto_update_enabled",
                    "dividend_update_interval_hours",
                    "dividend_scheduler_misfire_grace_seconds",
                ]
            )
        )
    )

    op.drop_table("dividend_update_runs")
    op.drop_table("dividend_snapshot_portfolio_rows")
    op.drop_table("dividend_snapshot_asset_rows")
    op.drop_table("dividend_snapshots")
    op.drop_table("dividend_receipts")
    op.drop_table("asset_dividend_events")
    op.drop_table("asset_dividend_settings")
    op.drop_table("asset_provider_identifiers")
