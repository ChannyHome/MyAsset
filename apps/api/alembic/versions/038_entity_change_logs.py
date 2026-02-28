"""038 entity change logs

Revision ID: 038_entity_change_logs
Revises: 037_user_settings_mobile_top_n
Create Date: 2026-02-28 21:10:00
"""

from alembic import op
import sqlalchemy as sa


revision = "038_entity_change_logs"
down_revision = "037_user_settings_mobile_top_n"
branch_labels = None
depends_on = None


def upgrade() -> None:
    inspector = sa.inspect(op.get_bind())
    if "entity_change_logs" in inspector.get_table_names():
        return

    op.create_table(
        "entity_change_logs",
        sa.Column("id", sa.Integer(), nullable=False, autoincrement=True),
        sa.Column("entity_type", sa.String(length=30), nullable=False),
        sa.Column("entity_id", sa.Integer(), nullable=False),
        sa.Column("owner_user_id", sa.Integer(), nullable=False),
        sa.Column("action", sa.String(length=30), nullable=False),
        sa.Column("before_json", sa.Text(), nullable=True),
        sa.Column("after_json", sa.Text(), nullable=True),
        sa.Column("changed_fields_json", sa.Text(), nullable=True),
        sa.Column("reason", sa.String(length=255), nullable=True),
        sa.Column("actor_user_id", sa.Integer(), nullable=True),
        sa.Column("actor_email", sa.String(length=255), nullable=True),
        sa.Column("request_id", sa.String(length=100), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_entity_change_logs_created_at", "entity_change_logs", ["created_at"], unique=False)
    op.create_index(
        "ix_entity_change_logs_entity_created",
        "entity_change_logs",
        ["entity_type", "entity_id", "created_at"],
        unique=False,
    )
    op.create_index(
        "ix_entity_change_logs_owner_created",
        "entity_change_logs",
        ["owner_user_id", "created_at"],
        unique=False,
    )
    op.create_index(
        "ix_entity_change_logs_actor_created",
        "entity_change_logs",
        ["actor_user_id", "created_at"],
        unique=False,
    )


def downgrade() -> None:
    inspector = sa.inspect(op.get_bind())
    if "entity_change_logs" not in inspector.get_table_names():
        return
    op.drop_index("ix_entity_change_logs_actor_created", table_name="entity_change_logs")
    op.drop_index("ix_entity_change_logs_owner_created", table_name="entity_change_logs")
    op.drop_index("ix_entity_change_logs_entity_created", table_name="entity_change_logs")
    op.drop_index("ix_entity_change_logs_created_at", table_name="entity_change_logs")
    op.drop_table("entity_change_logs")
