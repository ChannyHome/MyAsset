"""043 goal targets

Revision ID: 043_goal_targets
Revises: 042_chat_v1
Create Date: 2026-03-22 23:40:00
"""

from alembic import op
import sqlalchemy as sa


revision = "043_goal_targets"
down_revision = "042_chat_v1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    inspector = sa.inspect(op.get_bind())
    tables = set(inspector.get_table_names())
    bigint_pk = sa.BigInteger().with_variant(sa.Integer(), "sqlite")
    if "goal_targets" not in tables:
        op.create_table(
            "goal_targets",
            sa.Column("id", bigint_pk, nullable=False, autoincrement=True),
            sa.Column("owner_user_id", bigint_pk, nullable=False),
            sa.Column(
                "scope_type",
                sa.Enum("USER", "HOUSEHOLD", name="goal_target_scope_type"),
                nullable=False,
            ),
            sa.Column("scope_id", bigint_pk, nullable=False),
            sa.Column("amount_currency", sa.String(length=3), nullable=False, server_default="KRW"),
            sa.Column("target_amount", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("annual_return_rate_pct", sa.Numeric(9, 4), nullable=False, server_default=sa.text("0")),
            sa.Column("monthly_invest_amount", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
            sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
            sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
            sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"]),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("owner_user_id", "scope_type", "scope_id", name="uq_goal_target_owner_scope"),
        )
        op.create_index("ix_goal_targets_owner_user_id", "goal_targets", ["owner_user_id"], unique=False)
        op.create_index("ix_goal_targets_scope_type", "goal_targets", ["scope_type"], unique=False)
        op.create_index("ix_goal_targets_scope_id", "goal_targets", ["scope_id"], unique=False)


def downgrade() -> None:
    inspector = sa.inspect(op.get_bind())
    tables = set(inspector.get_table_names())

    if "goal_targets" in tables:
        op.drop_index("ix_goal_targets_scope_id", table_name="goal_targets")
        op.drop_index("ix_goal_targets_scope_type", table_name="goal_targets")
        op.drop_index("ix_goal_targets_owner_user_id", table_name="goal_targets")
        op.drop_table("goal_targets")
