"""044 user settings asset rebalance threshold

Revision ID: 044_user_rebalance
Revises: 043_goal_targets
Create Date: 2026-03-23 00:00:00.000000
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision: str = "044_user_rebalance"
down_revision: str | None = "043_goal_targets"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)
    columns = {col["name"] for col in inspector.get_columns("user_settings")}
    if "asset_rebalance_threshold_pct" not in columns:
        op.add_column(
            "user_settings",
            sa.Column(
                "asset_rebalance_threshold_pct",
                sa.Integer(),
                nullable=False,
                server_default=sa.text("10"),
            ),
        )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)
    columns = {col["name"] for col in inspector.get_columns("user_settings")}
    if "asset_rebalance_threshold_pct" in columns:
        op.drop_column("user_settings", "asset_rebalance_threshold_pct")
