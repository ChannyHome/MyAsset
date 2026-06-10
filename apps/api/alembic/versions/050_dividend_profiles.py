"""050 dividend profiles

Revision ID: 050_dividend_profiles
Revises: 049_dividend_tax
Create Date: 2026-06-10
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision = "050_dividend_profiles"
down_revision = "049_dividend_tax"
branch_labels = None
depends_on = None


def _table_exists(table_name: str) -> bool:
    bind = op.get_bind()
    return table_name in inspect(bind).get_table_names()


def _columns(table_name: str) -> set[str]:
    bind = op.get_bind()
    if not _table_exists(table_name):
        return set()
    return {column["name"] for column in inspect(bind).get_columns(table_name)}


def _add_column_if_missing(table_name: str, column: sa.Column) -> None:
    if column.name not in _columns(table_name):
        op.add_column(table_name, column)


def _drop_column_if_exists(table_name: str, column_name: str) -> None:
    if column_name in _columns(table_name):
        op.drop_column(table_name, column_name)


def upgrade() -> None:
    if _table_exists("asset_dividend_settings") and not _table_exists("asset_dividend_profiles"):
        op.rename_table("asset_dividend_settings", "asset_dividend_profiles")

    _add_column_if_missing(
        "asset_dividend_profiles",
        sa.Column("income_kind", sa.String(length=20), nullable=False, server_default="DIVIDEND"),
    )
    _add_column_if_missing(
        "asset_dividend_profiles",
        sa.Column("provider_strategy", sa.String(length=30), nullable=False, server_default="AUTO"),
    )
    _add_column_if_missing("asset_dividend_profiles", sa.Column("primary_provider", sa.String(length=50), nullable=True))
    _add_column_if_missing("asset_dividend_profiles", sa.Column("monthly_amounts_json", sa.JSON(), nullable=True))
    _add_column_if_missing("asset_dividend_profiles", sa.Column("forecast_method", sa.String(length=50), nullable=True))
    _add_column_if_missing(
        "asset_dividend_profiles",
        sa.Column("coverage_status", sa.String(length=50), nullable=False, server_default="NEEDS_REFRESH"),
    )
    _add_column_if_missing("asset_dividend_profiles", sa.Column("last_provider_checked_at", sa.DateTime(), nullable=True))
    _add_column_if_missing("asset_dividend_profiles", sa.Column("last_success_at", sa.DateTime(), nullable=True))
    _add_column_if_missing("asset_dividend_profiles", sa.Column("last_error", sa.Text(), nullable=True))


def downgrade() -> None:
    for column_name in (
        "last_error",
        "last_success_at",
        "last_provider_checked_at",
        "coverage_status",
        "forecast_method",
        "monthly_amounts_json",
        "primary_provider",
        "provider_strategy",
        "income_kind",
    ):
        _drop_column_if_exists("asset_dividend_profiles", column_name)

    if _table_exists("asset_dividend_profiles") and not _table_exists("asset_dividend_settings"):
        op.rename_table("asset_dividend_profiles", "asset_dividend_settings")
