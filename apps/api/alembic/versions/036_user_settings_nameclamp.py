"""036 user settings name clamp

Revision ID: 036_user_settings_nameclamp
Revises: 035_portfolio_cash_accounts
Create Date: 2026-02-22 20:55:00
"""

from alembic import op
import sqlalchemy as sa


revision = "036_user_settings_nameclamp"
down_revision = "035_portfolio_cash_accounts"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "user_settings",
        sa.Column("name_clamp_enabled", sa.Boolean(), nullable=False, server_default=sa.text("1")),
    )


def downgrade() -> None:
    op.drop_column("user_settings", "name_clamp_enabled")

