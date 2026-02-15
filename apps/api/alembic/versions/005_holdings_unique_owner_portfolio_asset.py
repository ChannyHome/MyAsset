"""005 holdings unique owner portfolio asset

Revision ID: 005_holding_unique
Revises: 004_dashboard_media_valuation
Create Date: 2026-02-14 20:00:00
"""

from alembic import op
import sqlalchemy as sa


revision = "005_holding_unique"
down_revision = "004_dashboard_media_valuation"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    unique_constraints = inspector.get_unique_constraints("holdings")
    if any(item.get("name") == "uq_holdings_owner_portfolio_asset" for item in unique_constraints):
        return

    duplicates = conn.execute(
        sa.text(
            """
            SELECT owner_user_id, portfolio_id, asset_id, COUNT(*) AS cnt
            FROM holdings
            GROUP BY owner_user_id, portfolio_id, asset_id
            HAVING COUNT(*) > 1
            """
        )
    ).fetchall()
    if duplicates:
        raise RuntimeError(
            "Cannot add uq_holdings_owner_portfolio_asset. "
            "Duplicate holdings exist for same owner/portfolio/asset. "
            "Please deduplicate holdings first."
        )

    op.create_unique_constraint(
        "uq_holdings_owner_portfolio_asset",
        "holdings",
        ["owner_user_id", "portfolio_id", "asset_id"],
    )


def downgrade() -> None:
    op.drop_constraint(
        "uq_holdings_owner_portfolio_asset",
        "holdings",
        type_="unique",
    )
