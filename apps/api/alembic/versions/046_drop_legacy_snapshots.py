"""046 drop legacy snapshots

Revision ID: 046_drop_legacy_snapshots
Revises: 045_quote_scheduler_runs
Create Date: 2026-06-07 00:00:00
"""

from alembic import op
import sqlalchemy as sa


revision = "046_drop_legacy_snapshots"
down_revision = "045_quote_scheduler_runs"
branch_labels = None
depends_on = None


def upgrade() -> None:
    inspector = sa.inspect(op.get_bind())
    tables = set(inspector.get_table_names())

    if "snapshot_liability_rows" in tables:
        op.drop_table("snapshot_liability_rows")

    if "snapshot_holding_rows" in tables:
        op.drop_table("snapshot_holding_rows")

    if "snapshot_portfolio_rows" in tables:
        op.drop_table("snapshot_portfolio_rows")

    if "snapshot_sets" in tables:
        op.drop_table("snapshot_sets")


def downgrade() -> None:
    # Legacy snapshot tables were intentionally retired in favor of
    # valuation_snapshots. Restore from a DB backup if old captured data is
    # required; the application no longer serves these tables.
    pass
