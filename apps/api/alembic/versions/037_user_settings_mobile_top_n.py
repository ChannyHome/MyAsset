"""037 user settings mobile top n

Revision ID: 037_user_settings_mobile_top_n
Revises: 036_user_settings_nameclamp
Create Date: 2026-02-23 09:30:00
"""

from alembic import op
import sqlalchemy as sa


revision = "037_user_settings_mobile_top_n"
down_revision = "036_user_settings_nameclamp"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    columns = {col["name"] for col in inspector.get_columns("user_settings")}
    if "mobile_allocation_top_n" not in columns:
        op.add_column(
            "user_settings",
            sa.Column(
                "mobile_allocation_top_n",
                sa.Integer(),
                nullable=False,
                server_default=sa.text("6"),
            ),
        )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    columns = {col["name"] for col in inspector.get_columns("user_settings")}
    if "mobile_allocation_top_n" in columns:
        op.drop_column("user_settings", "mobile_allocation_top_n")
