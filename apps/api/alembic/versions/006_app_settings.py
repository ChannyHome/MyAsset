"""006 app settings

Revision ID: 006_app_settings
Revises: 005_holding_unique
Create Date: 2026-02-15 00:20:00
"""

from alembic import op
import sqlalchemy as sa


revision = "006_app_settings"
down_revision = "005_holding_unique"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "app_settings",
        sa.Column("key", sa.String(length=100), nullable=False),
        sa.Column("value", sa.Text(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.PrimaryKeyConstraint("key"),
    )


def downgrade() -> None:
    op.drop_table("app_settings")
