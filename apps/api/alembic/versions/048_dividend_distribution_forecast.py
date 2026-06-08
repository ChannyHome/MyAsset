"""048 dividend distribution forecast

Revision ID: 048_dividend_forecast
Revises: 047_dividend_income
Create Date: 2026-06-08
"""

from alembic import op
import sqlalchemy as sa


revision = "048_dividend_forecast"
down_revision = "047_dividend_income"
branch_labels = None
depends_on = None


def _columns(table_name: str) -> set[str]:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    return {column["name"] for column in inspector.get_columns(table_name)}


def _add_column_if_missing(table_name: str, column: sa.Column) -> None:
    if column.name not in _columns(table_name):
        op.add_column(table_name, column)


def _drop_column_if_exists(table_name: str, column_name: str) -> None:
    if column_name in _columns(table_name):
        op.drop_column(table_name, column_name)


def upgrade() -> None:
    _add_column_if_missing("portfolios", sa.Column("dividend_tax_profile", sa.String(length=30), nullable=True))
    _add_column_if_missing("portfolios", sa.Column("dividend_tax_rate_pct", sa.Numeric(9, 4), nullable=True))

    _add_column_if_missing("dividend_snapshot_asset_rows", sa.Column("income_kind", sa.String(length=20), nullable=False, server_default="DIVIDEND"))
    _add_column_if_missing("dividend_snapshot_asset_rows", sa.Column("confirmed_annual_gross_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")))
    _add_column_if_missing("dividend_snapshot_asset_rows", sa.Column("confirmed_annual_tax_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")))
    _add_column_if_missing("dividend_snapshot_asset_rows", sa.Column("confirmed_annual_net_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")))
    _add_column_if_missing("dividend_snapshot_asset_rows", sa.Column("estimated_annual_gross_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")))
    _add_column_if_missing("dividend_snapshot_asset_rows", sa.Column("estimated_annual_tax_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")))
    _add_column_if_missing("dividend_snapshot_asset_rows", sa.Column("estimated_annual_net_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")))
    _add_column_if_missing("dividend_snapshot_asset_rows", sa.Column("tax_profile", sa.String(length=30), nullable=True))
    _add_column_if_missing("dividend_snapshot_asset_rows", sa.Column("estimate_method", sa.String(length=50), nullable=True))
    _add_column_if_missing("dividend_snapshot_asset_rows", sa.Column("confidence", sa.String(length=20), nullable=True))
    _add_column_if_missing("dividend_snapshot_asset_rows", sa.Column("missing_reason", sa.String(length=100), nullable=True))
    _add_column_if_missing("dividend_snapshot_asset_rows", sa.Column("confirmed_event_count", sa.Integer(), nullable=False, server_default=sa.text("0")))
    _add_column_if_missing("dividend_snapshot_asset_rows", sa.Column("estimated_event_count", sa.Integer(), nullable=False, server_default=sa.text("0")))

    _add_column_if_missing("dividend_snapshot_portfolio_rows", sa.Column("confirmed_annual_gross_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")))
    _add_column_if_missing("dividend_snapshot_portfolio_rows", sa.Column("confirmed_annual_tax_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")))
    _add_column_if_missing("dividend_snapshot_portfolio_rows", sa.Column("confirmed_annual_net_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")))
    _add_column_if_missing("dividend_snapshot_portfolio_rows", sa.Column("estimated_annual_gross_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")))
    _add_column_if_missing("dividend_snapshot_portfolio_rows", sa.Column("estimated_annual_tax_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")))
    _add_column_if_missing("dividend_snapshot_portfolio_rows", sa.Column("estimated_annual_net_display", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")))


def downgrade() -> None:
    _drop_column_if_exists("dividend_snapshot_portfolio_rows", "estimated_annual_net_display")
    _drop_column_if_exists("dividend_snapshot_portfolio_rows", "estimated_annual_tax_display")
    _drop_column_if_exists("dividend_snapshot_portfolio_rows", "estimated_annual_gross_display")
    _drop_column_if_exists("dividend_snapshot_portfolio_rows", "confirmed_annual_net_display")
    _drop_column_if_exists("dividend_snapshot_portfolio_rows", "confirmed_annual_tax_display")
    _drop_column_if_exists("dividend_snapshot_portfolio_rows", "confirmed_annual_gross_display")

    _drop_column_if_exists("dividend_snapshot_asset_rows", "estimated_event_count")
    _drop_column_if_exists("dividend_snapshot_asset_rows", "confirmed_event_count")
    _drop_column_if_exists("dividend_snapshot_asset_rows", "missing_reason")
    _drop_column_if_exists("dividend_snapshot_asset_rows", "confidence")
    _drop_column_if_exists("dividend_snapshot_asset_rows", "estimate_method")
    _drop_column_if_exists("dividend_snapshot_asset_rows", "tax_profile")
    _drop_column_if_exists("dividend_snapshot_asset_rows", "estimated_annual_net_display")
    _drop_column_if_exists("dividend_snapshot_asset_rows", "estimated_annual_tax_display")
    _drop_column_if_exists("dividend_snapshot_asset_rows", "estimated_annual_gross_display")
    _drop_column_if_exists("dividend_snapshot_asset_rows", "confirmed_annual_net_display")
    _drop_column_if_exists("dividend_snapshot_asset_rows", "confirmed_annual_tax_display")
    _drop_column_if_exists("dividend_snapshot_asset_rows", "confirmed_annual_gross_display")
    _drop_column_if_exists("dividend_snapshot_asset_rows", "income_kind")

    _drop_column_if_exists("portfolios", "dividend_tax_rate_pct")
    _drop_column_if_exists("portfolios", "dividend_tax_profile")
