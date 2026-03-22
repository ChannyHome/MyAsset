"""042 chat v1 tables

Revision ID: 042_chat_v1
Revises: 041_valuation_snapshot_rows
Create Date: 2026-03-22 18:50:00
"""

from alembic import op
import sqlalchemy as sa


revision = "042_chat_v1"
down_revision = "041_valuation_snapshot_rows"
branch_labels = None
depends_on = None


def upgrade() -> None:
    inspector = sa.inspect(op.get_bind())
    tables = set(inspector.get_table_names())
    bigint_pk = sa.BigInteger().with_variant(sa.Integer(), "sqlite")

    if "chat_sessions" not in tables:
        op.create_table(
            "chat_sessions",
            sa.Column("id", bigint_pk, nullable=False, autoincrement=True),
            sa.Column("owner_user_id", bigint_pk, nullable=False),
            sa.Column("household_id", bigint_pk, nullable=True),
            sa.Column("title", sa.String(length=200), nullable=False, server_default="New chat"),
            sa.Column(
                "status",
                sa.Enum("ACTIVE", "ARCHIVED", name="chat_session_status"),
                nullable=False,
                server_default="ACTIVE",
            ),
            sa.Column("model_name", sa.String(length=100), nullable=False, server_default="gpt-5.4-mini"),
            sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
            sa.Column(
                "updated_at",
                sa.DateTime(),
                nullable=False,
                server_default=sa.text("CURRENT_TIMESTAMP"),
            ),
            sa.Column("last_message_at", sa.DateTime(), nullable=True),
            sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"]),
            sa.ForeignKeyConstraint(["household_id"], ["households.id"]),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_chat_sessions_owner_user_id", "chat_sessions", ["owner_user_id"], unique=False)
        op.create_index("ix_chat_sessions_household_id", "chat_sessions", ["household_id"], unique=False)
        op.create_index("ix_chat_sessions_status", "chat_sessions", ["status"], unique=False)
        op.create_index("ix_chat_sessions_last_message_at", "chat_sessions", ["last_message_at"], unique=False)

    if "chat_messages" not in tables:
        op.create_table(
            "chat_messages",
            sa.Column("id", bigint_pk, nullable=False, autoincrement=True),
            sa.Column("session_id", bigint_pk, nullable=False),
            sa.Column(
                "role",
                sa.Enum("USER", "ASSISTANT", "SYSTEM", name="chat_message_role"),
                nullable=False,
            ),
            sa.Column("content_text", sa.Text(), nullable=False),
            sa.Column("source_cards_json", sa.JSON(), nullable=True),
            sa.Column("tool_calls_json", sa.JSON(), nullable=True),
            sa.Column("usage_json", sa.JSON(), nullable=True),
            sa.Column("latency_ms", sa.Integer(), nullable=True),
            sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
            sa.ForeignKeyConstraint(["session_id"], ["chat_sessions.id"]),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_chat_messages_session_id", "chat_messages", ["session_id"], unique=False)
        op.create_index("ix_chat_messages_role", "chat_messages", ["role"], unique=False)


def downgrade() -> None:
    inspector = sa.inspect(op.get_bind())
    tables = set(inspector.get_table_names())

    if "chat_messages" in tables:
        op.drop_index("ix_chat_messages_role", table_name="chat_messages")
        op.drop_index("ix_chat_messages_session_id", table_name="chat_messages")
        op.drop_table("chat_messages")

    if "chat_sessions" in tables:
        op.drop_index("ix_chat_sessions_last_message_at", table_name="chat_sessions")
        op.drop_index("ix_chat_sessions_status", table_name="chat_sessions")
        op.drop_index("ix_chat_sessions_household_id", table_name="chat_sessions")
        op.drop_index("ix_chat_sessions_owner_user_id", table_name="chat_sessions")
        op.drop_table("chat_sessions")
