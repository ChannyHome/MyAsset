"""041 valuation snapshot detail rows

Revision ID: 041_valuation_snapshot_rows
Revises: 040_txn_balance_set
Create Date: 2026-03-14 23:40:00
"""

from alembic import op
import sqlalchemy as sa


revision = "041_valuation_snapshot_rows"
down_revision = "040_txn_balance_set"
branch_labels = None
depends_on = None


def upgrade() -> None:
    inspector = sa.inspect(op.get_bind())
    tables = set(inspector.get_table_names())

    if "valuation_snapshot_portfolio_rows" not in tables:
        op.create_table(
            "valuation_snapshot_portfolio_rows",
            sa.Column("id", sa.Integer(), nullable=False, autoincrement=True),
            sa.Column(
                "valuation_snapshot_id",
                sa.BigInteger().with_variant(sa.Integer(), "sqlite"),
                nullable=False,
            ),
            sa.Column("portfolio_id", sa.Integer(), nullable=True),
            sa.Column("portfolio_name", sa.String(length=255), nullable=False),
            sa.Column("portfolio_type", sa.String(length=50), nullable=True),
            sa.Column("base_currency", sa.String(length=3), nullable=True),
            sa.Column("gross_assets_total", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("liabilities_total", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("net_assets_total", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column(
                "invested_principal_total",
                sa.Numeric(24, 8),
                nullable=False,
                server_default=sa.text("0"),
            ),
            sa.Column(
                "debt_adjusted_principal_total",
                sa.Numeric(24, 8),
                nullable=False,
                server_default=sa.text("0"),
            ),
            sa.Column(
                "net_contribution_total",
                sa.Numeric(24, 8),
                nullable=False,
                server_default=sa.text("0"),
            ),
            sa.Column("portfolio_profit_total", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("return_pct", sa.Numeric(24, 8), nullable=True),
            sa.ForeignKeyConstraint(
                ["valuation_snapshot_id"],
                ["valuation_snapshots.id"],
            ),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(
            "ix_valuation_snapshot_portfolio_rows_snapshot_portfolio",
            "valuation_snapshot_portfolio_rows",
            ["valuation_snapshot_id", "portfolio_id"],
            unique=False,
        )
        op.create_index(
            "ix_valuation_snapshot_portfolio_rows_snapshot_gross",
            "valuation_snapshot_portfolio_rows",
            ["valuation_snapshot_id", "gross_assets_total"],
            unique=False,
        )

    if "valuation_snapshot_holding_rows" not in tables:
        op.create_table(
            "valuation_snapshot_holding_rows",
            sa.Column("id", sa.Integer(), nullable=False, autoincrement=True),
            sa.Column(
                "valuation_snapshot_id",
                sa.BigInteger().with_variant(sa.Integer(), "sqlite"),
                nullable=False,
            ),
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
            sa.Column("evaluated_amount", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("cost_basis_total", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("profit_total", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("return_pct", sa.Numeric(24, 8), nullable=True),
            sa.Column("quote_as_of", sa.DateTime(), nullable=True),
            sa.Column("quote_source", sa.String(length=50), nullable=True),
            sa.ForeignKeyConstraint(
                ["valuation_snapshot_id"],
                ["valuation_snapshots.id"],
            ),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(
            "ix_valuation_snapshot_holding_rows_snapshot_portfolio",
            "valuation_snapshot_holding_rows",
            ["valuation_snapshot_id", "portfolio_id"],
            unique=False,
        )
        op.create_index(
            "ix_valuation_snapshot_holding_rows_snapshot_asset",
            "valuation_snapshot_holding_rows",
            ["valuation_snapshot_id", "asset_id"],
            unique=False,
        )
        op.create_index(
            "ix_valuation_snapshot_holding_rows_snapshot_eval",
            "valuation_snapshot_holding_rows",
            ["valuation_snapshot_id", "evaluated_amount"],
            unique=False,
        )

    if "valuation_snapshot_liability_rows" not in tables:
        op.create_table(
            "valuation_snapshot_liability_rows",
            sa.Column("id", sa.Integer(), nullable=False, autoincrement=True),
            sa.Column(
                "valuation_snapshot_id",
                sa.BigInteger().with_variant(sa.Integer(), "sqlite"),
                nullable=False,
            ),
            sa.Column("portfolio_id", sa.Integer(), nullable=True),
            sa.Column("portfolio_name", sa.String(length=255), nullable=False),
            sa.Column("liability_id", sa.Integer(), nullable=True),
            sa.Column("liability_name", sa.String(length=255), nullable=False),
            sa.Column("liability_type", sa.String(length=50), nullable=False),
            sa.Column("balance", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("balance_currency", sa.String(length=3), nullable=False),
            sa.Column("balance_total", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.ForeignKeyConstraint(
                ["valuation_snapshot_id"],
                ["valuation_snapshots.id"],
            ),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(
            "ix_valuation_snapshot_liability_rows_snapshot_portfolio",
            "valuation_snapshot_liability_rows",
            ["valuation_snapshot_id", "portfolio_id"],
            unique=False,
        )
        op.create_index(
            "ix_valuation_snapshot_liability_rows_snapshot_balance",
            "valuation_snapshot_liability_rows",
            ["valuation_snapshot_id", "balance_total"],
            unique=False,
        )


def downgrade() -> None:
    inspector = sa.inspect(op.get_bind())
    tables = set(inspector.get_table_names())

    if "valuation_snapshot_liability_rows" in tables:
        op.drop_index(
            "ix_valuation_snapshot_liability_rows_snapshot_balance",
            table_name="valuation_snapshot_liability_rows",
        )
        op.drop_index(
            "ix_valuation_snapshot_liability_rows_snapshot_portfolio",
            table_name="valuation_snapshot_liability_rows",
        )
        op.drop_table("valuation_snapshot_liability_rows")

    if "valuation_snapshot_holding_rows" in tables:
        op.drop_index(
            "ix_valuation_snapshot_holding_rows_snapshot_eval",
            table_name="valuation_snapshot_holding_rows",
        )
        op.drop_index(
            "ix_valuation_snapshot_holding_rows_snapshot_asset",
            table_name="valuation_snapshot_holding_rows",
        )
        op.drop_index(
            "ix_valuation_snapshot_holding_rows_snapshot_portfolio",
            table_name="valuation_snapshot_holding_rows",
        )
        op.drop_table("valuation_snapshot_holding_rows")

    if "valuation_snapshot_portfolio_rows" in tables:
        op.drop_index(
            "ix_valuation_snapshot_portfolio_rows_snapshot_gross",
            table_name="valuation_snapshot_portfolio_rows",
        )
        op.drop_index(
            "ix_valuation_snapshot_portfolio_rows_snapshot_portfolio",
            table_name="valuation_snapshot_portfolio_rows",
        )
        op.drop_table("valuation_snapshot_portfolio_rows")
