"""039 snapshots

Revision ID: 039_snapshots
Revises: 038_entity_change_logs
Create Date: 2026-02-28 23:40:00
"""

from alembic import op
import sqlalchemy as sa


revision = "039_snapshots"
down_revision = "038_entity_change_logs"
branch_labels = None
depends_on = None


def upgrade() -> None:
    inspector = sa.inspect(op.get_bind())
    tables = set(inspector.get_table_names())

    if "snapshot_sets" not in tables:
        op.create_table(
            "snapshot_sets",
            sa.Column("id", sa.Integer(), nullable=False, autoincrement=True),
            sa.Column(
                "owner_user_id",
                sa.BigInteger().with_variant(sa.Integer(), "sqlite"),
                nullable=False,
            ),
            sa.Column("name", sa.String(length=200), nullable=True),
            sa.Column("source_type", sa.String(length=30), nullable=False, server_default="MANUAL"),
            sa.Column("note", sa.String(length=500), nullable=True),
            sa.Column("captured_at", sa.DateTime(), nullable=False),
            sa.Column("as_of", sa.DateTime(), nullable=False),
            sa.Column("display_currency_at_capture", sa.String(length=3), nullable=False, server_default="KRW"),
            sa.Column("fx_usd_krw_rate", sa.Numeric(24, 8), nullable=True),
            sa.Column("fx_as_of", sa.DateTime(), nullable=True),
            sa.Column("fx_source", sa.String(length=50), nullable=True),
            sa.Column("gross_assets_krw", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("gross_assets_usd", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("liabilities_krw", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("liabilities_usd", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("net_assets_krw", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("net_assets_usd", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("invested_principal_krw", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("invested_principal_usd", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column(
                "debt_adjusted_principal_krw",
                sa.Numeric(24, 8),
                nullable=False,
                server_default=sa.text("0"),
            ),
            sa.Column(
                "debt_adjusted_principal_usd",
                sa.Numeric(24, 8),
                nullable=False,
                server_default=sa.text("0"),
            ),
            sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
            sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"]),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(
            "ix_snapshot_sets_owner_captured",
            "snapshot_sets",
            ["owner_user_id", "captured_at"],
            unique=False,
        )

    if "snapshot_portfolio_rows" not in tables:
        op.create_table(
            "snapshot_portfolio_rows",
            sa.Column("id", sa.Integer(), nullable=False, autoincrement=True),
            sa.Column("snapshot_id", sa.Integer(), nullable=False),
            sa.Column("portfolio_id", sa.Integer(), nullable=True),
            sa.Column("portfolio_name", sa.String(length=255), nullable=False),
            sa.Column("portfolio_type", sa.String(length=50), nullable=True),
            sa.Column("base_currency", sa.String(length=3), nullable=True),
            sa.Column("gross_assets_krw", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("gross_assets_usd", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("liabilities_krw", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("liabilities_usd", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("net_assets_krw", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("net_assets_usd", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("invested_principal_krw", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("invested_principal_usd", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column(
                "debt_adjusted_principal_krw",
                sa.Numeric(24, 8),
                nullable=False,
                server_default=sa.text("0"),
            ),
            sa.Column(
                "debt_adjusted_principal_usd",
                sa.Numeric(24, 8),
                nullable=False,
                server_default=sa.text("0"),
            ),
            sa.Column("portfolio_profit_krw", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("portfolio_profit_usd", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("return_pct", sa.Numeric(24, 8), nullable=True),
            sa.Column("net_contribution_krw", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("net_contribution_usd", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.ForeignKeyConstraint(["snapshot_id"], ["snapshot_sets.id"]),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(
            "ix_snapshot_portfolio_rows_snapshot_portfolio",
            "snapshot_portfolio_rows",
            ["snapshot_id", "portfolio_id"],
            unique=False,
        )
        op.create_index(
            "ix_snapshot_portfolio_rows_snapshot_gross",
            "snapshot_portfolio_rows",
            ["snapshot_id", "gross_assets_krw"],
            unique=False,
        )

    if "snapshot_holding_rows" not in tables:
        op.create_table(
            "snapshot_holding_rows",
            sa.Column("id", sa.Integer(), nullable=False, autoincrement=True),
            sa.Column("snapshot_id", sa.Integer(), nullable=False),
            sa.Column("portfolio_id", sa.Integer(), nullable=True),
            sa.Column("portfolio_name", sa.String(length=255), nullable=False),
            sa.Column("asset_id", sa.Integer(), nullable=True),
            sa.Column("asset_name", sa.String(length=255), nullable=False),
            sa.Column("symbol", sa.String(length=32), nullable=True),
            sa.Column("asset_class", sa.String(length=50), nullable=False),
            sa.Column("asset_currency", sa.String(length=3), nullable=False),
            sa.Column("quantity", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("current_price", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("current_price_currency", sa.String(length=3), nullable=False),
            sa.Column("avg_cost", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("avg_cost_currency", sa.String(length=3), nullable=False),
            sa.Column("evaluated_krw", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("evaluated_usd", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("cost_basis_krw", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("cost_basis_usd", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("profit_krw", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("profit_usd", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("return_pct", sa.Numeric(24, 8), nullable=True),
            sa.Column("quote_as_of", sa.DateTime(), nullable=True),
            sa.Column("quote_source", sa.String(length=50), nullable=True),
            sa.ForeignKeyConstraint(["snapshot_id"], ["snapshot_sets.id"]),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(
            "ix_snapshot_holding_rows_snapshot_portfolio",
            "snapshot_holding_rows",
            ["snapshot_id", "portfolio_id"],
            unique=False,
        )
        op.create_index(
            "ix_snapshot_holding_rows_snapshot_asset",
            "snapshot_holding_rows",
            ["snapshot_id", "asset_id"],
            unique=False,
        )
        op.create_index(
            "ix_snapshot_holding_rows_snapshot_eval",
            "snapshot_holding_rows",
            ["snapshot_id", "evaluated_krw"],
            unique=False,
        )

    if "snapshot_liability_rows" not in tables:
        op.create_table(
            "snapshot_liability_rows",
            sa.Column("id", sa.Integer(), nullable=False, autoincrement=True),
            sa.Column("snapshot_id", sa.Integer(), nullable=False),
            sa.Column("portfolio_id", sa.Integer(), nullable=True),
            sa.Column("portfolio_name", sa.String(length=255), nullable=False),
            sa.Column("liability_id", sa.Integer(), nullable=True),
            sa.Column("liability_name", sa.String(length=255), nullable=False),
            sa.Column("liability_type", sa.String(length=50), nullable=False),
            sa.Column("balance", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("balance_currency", sa.String(length=3), nullable=False),
            sa.Column("balance_krw", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("balance_usd", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.ForeignKeyConstraint(["snapshot_id"], ["snapshot_sets.id"]),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(
            "ix_snapshot_liability_rows_snapshot_portfolio",
            "snapshot_liability_rows",
            ["snapshot_id", "portfolio_id"],
            unique=False,
        )
        op.create_index(
            "ix_snapshot_liability_rows_snapshot_balance",
            "snapshot_liability_rows",
            ["snapshot_id", "balance_krw"],
            unique=False,
        )


def downgrade() -> None:
    inspector = sa.inspect(op.get_bind())
    tables = set(inspector.get_table_names())

    if "snapshot_liability_rows" in tables:
        op.drop_index("ix_snapshot_liability_rows_snapshot_balance", table_name="snapshot_liability_rows")
        op.drop_index("ix_snapshot_liability_rows_snapshot_portfolio", table_name="snapshot_liability_rows")
        op.drop_table("snapshot_liability_rows")

    if "snapshot_holding_rows" in tables:
        op.drop_index("ix_snapshot_holding_rows_snapshot_eval", table_name="snapshot_holding_rows")
        op.drop_index("ix_snapshot_holding_rows_snapshot_asset", table_name="snapshot_holding_rows")
        op.drop_index("ix_snapshot_holding_rows_snapshot_portfolio", table_name="snapshot_holding_rows")
        op.drop_table("snapshot_holding_rows")

    if "snapshot_portfolio_rows" in tables:
        op.drop_index("ix_snapshot_portfolio_rows_snapshot_gross", table_name="snapshot_portfolio_rows")
        op.drop_index("ix_snapshot_portfolio_rows_snapshot_portfolio", table_name="snapshot_portfolio_rows")
        op.drop_table("snapshot_portfolio_rows")

    if "snapshot_sets" in tables:
        op.drop_index("ix_snapshot_sets_owner_captured", table_name="snapshot_sets")
        op.drop_table("snapshot_sets")
