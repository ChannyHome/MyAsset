"""025 holdings avg/invested currency columns

Revision ID: 025_hold_ccy_cols
Revises: 024_app_secrets
Create Date: 2026-02-18 16:40:00
"""

from alembic import op
import sqlalchemy as sa


revision = "025_hold_ccy_cols"
down_revision = "024_app_secrets"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "holdings",
        sa.Column("avg_price_currency", sa.String(length=3), nullable=False, server_default="KRW"),
    )
    op.add_column(
        "holdings",
        sa.Column("invested_amount_currency", sa.String(length=3), nullable=False, server_default="KRW"),
    )

    # Backfill existing rows explicitly to preserve current data behavior.
    op.execute(
        """
        UPDATE holdings
        SET avg_price_currency = 'KRW',
            invested_amount_currency = 'KRW'
        WHERE avg_price_currency IS NULL
           OR invested_amount_currency IS NULL
           OR avg_price_currency = ''
           OR invested_amount_currency = ''
        """
    )


def downgrade() -> None:
    op.drop_column("holdings", "invested_amount_currency")
    op.drop_column("holdings", "avg_price_currency")

