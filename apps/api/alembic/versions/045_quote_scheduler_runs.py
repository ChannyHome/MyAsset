"""045 quote scheduler runs

Revision ID: 045_quote_scheduler_runs
Revises: 044_user_rebalance
Create Date: 2026-04-19 00:00:00.000000
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision: str = "045_quote_scheduler_runs"
down_revision: str | None = "044_user_rebalance"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)
    if "quote_scheduler_runs" in inspector.get_table_names():
        return

    op.create_table(
        "quote_scheduler_runs",
        sa.Column("id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("run_type", sa.Enum("AUTO", "MANUAL", name="quote_scheduler_run_type"), nullable=False),
        sa.Column(
            "status",
            sa.Enum(
                "STARTED",
                "COMPLETED",
                "COMPLETED_WITH_WARNINGS",
                "FAILED",
                "MISSED",
                "MAX_INSTANCES",
                name="quote_scheduler_run_status",
            ),
            nullable=False,
        ),
        sa.Column("scheduled_run_at", sa.DateTime(), nullable=True),
        sa.Column("started_at", sa.DateTime(), nullable=True),
        sa.Column("finished_at", sa.DateTime(), nullable=True),
        sa.Column("duration_seconds", sa.Numeric(12, 3), nullable=True),
        sa.Column("updated_count", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("skipped_count", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("failed_count", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("errors_json", sa.JSON(), nullable=True),
        sa.Column("fx_updated", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column("fx_error", sa.Text(), nullable=True),
        sa.Column("snapshot_collected", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column("snapshot_error", sa.Text(), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
    )
    op.create_index("ix_quote_scheduler_runs_run_type", "quote_scheduler_runs", ["run_type"])
    op.create_index("ix_quote_scheduler_runs_status", "quote_scheduler_runs", ["status"])
    op.create_index("ix_quote_scheduler_runs_scheduled_run_at", "quote_scheduler_runs", ["scheduled_run_at"])
    op.create_index("ix_quote_scheduler_runs_started_at", "quote_scheduler_runs", ["started_at"])
    op.create_index("ix_quote_scheduler_runs_finished_at", "quote_scheduler_runs", ["finished_at"])


def downgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)
    if "quote_scheduler_runs" not in inspector.get_table_names():
        return

    op.drop_index("ix_quote_scheduler_runs_finished_at", table_name="quote_scheduler_runs")
    op.drop_index("ix_quote_scheduler_runs_started_at", table_name="quote_scheduler_runs")
    op.drop_index("ix_quote_scheduler_runs_scheduled_run_at", table_name="quote_scheduler_runs")
    op.drop_index("ix_quote_scheduler_runs_status", table_name="quote_scheduler_runs")
    op.drop_index("ix_quote_scheduler_runs_run_type", table_name="quote_scheduler_runs")
    op.drop_table("quote_scheduler_runs")
