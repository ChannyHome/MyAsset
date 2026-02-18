"""028 api audit logs

Revision ID: 028_api_audit_logs
Revises: 027_seed_release_note_20260218
Create Date: 2026-02-18 15:20:00
"""

from alembic import op
import sqlalchemy as sa


revision = "028_api_audit_logs"
down_revision = "027_seed_release_note_20260218"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "api_audit_logs",
        sa.Column("id", sa.BigInteger(), nullable=False),
        sa.Column("timestamp", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("user_id", sa.BigInteger(), nullable=True),
        sa.Column("role", sa.String(length=20), nullable=True),
        sa.Column("method", sa.String(length=10), nullable=False),
        sa.Column("path", sa.String(length=512), nullable=False),
        sa.Column("query", sa.Text(), nullable=True),
        sa.Column("status_code", sa.Integer(), nullable=False),
        sa.Column("duration_ms", sa.Integer(), nullable=False),
        sa.Column("client_ip", sa.String(length=64), nullable=True),
        sa.Column("user_agent", sa.String(length=512), nullable=True),
        sa.Column("action_name", sa.String(length=255), nullable=True),
        sa.Column("resource_type", sa.String(length=100), nullable=True),
        sa.Column("resource_id", sa.BigInteger(), nullable=True),
        sa.Column("result", sa.String(length=20), nullable=True),
        sa.Column("request_body_masked", sa.Text(), nullable=True),
        sa.Column("response_body_masked", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_api_audit_logs_timestamp", "api_audit_logs", ["timestamp"], unique=False)
    op.create_index("ix_api_audit_logs_user_timestamp", "api_audit_logs", ["user_id", "timestamp"], unique=False)
    op.create_index("ix_api_audit_logs_path_timestamp", "api_audit_logs", ["path", "timestamp"], unique=False)
    op.create_index("ix_api_audit_logs_status_timestamp", "api_audit_logs", ["status_code", "timestamp"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_api_audit_logs_status_timestamp", table_name="api_audit_logs")
    op.drop_index("ix_api_audit_logs_path_timestamp", table_name="api_audit_logs")
    op.drop_index("ix_api_audit_logs_user_timestamp", table_name="api_audit_logs")
    op.drop_index("ix_api_audit_logs_timestamp", table_name="api_audit_logs")
    op.drop_table("api_audit_logs")
