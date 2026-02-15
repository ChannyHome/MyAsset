"""010 household summary view

Revision ID: 010_household_summary_view
Revises: 009_asset_views
Create Date: 2026-02-15 04:45:00
"""

from alembic import op


revision = "010_household_summary_view"
down_revision = "009_asset_views"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("DROP VIEW IF EXISTS v_household_summary_v2")

    op.execute(
        """
        CREATE VIEW v_household_summary_v2 AS
        SELECT
            h.id AS household_id,
            h.name AS household_name,
            COUNT(DISTINCT hm.user_id) AS member_count,
            COALESCE(SUM(us.owned_assets_total), 0) AS owned_assets_total,
            COALESCE(SUM(us.liabilities_total), 0) AS liabilities_total,
            COALESCE(SUM(us.gross_assets_total), 0) AS gross_assets_total,
            COALESCE(SUM(us.net_assets_total), 0) AS net_assets_total,
            MAX(us.latest_quote_as_of) AS latest_quote_as_of
        FROM households h
        LEFT JOIN household_members hm ON hm.household_id = h.id
        LEFT JOIN v_user_summary_v2 us ON us.owner_user_id = hm.user_id
        GROUP BY h.id, h.name
        """
    )


def downgrade() -> None:
    op.execute("DROP VIEW IF EXISTS v_household_summary_v2")
