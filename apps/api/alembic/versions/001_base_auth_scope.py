"""001 base auth scope

Revision ID: 001_base_auth_scope
Revises:
Create Date: 2026-02-14 16:30:00
"""

from alembic import op
import sqlalchemy as sa


revision = "001_base_auth_scope"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.BigInteger().with_variant(sa.Integer(), "sqlite"), primary_key=True, autoincrement=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("display_name", sa.String(length=100), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP(6)")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP(6)")),
        sa.UniqueConstraint("email", name="uq_users_email"),
    )

    op.create_table(
        "households",
        sa.Column("id", sa.BigInteger().with_variant(sa.Integer(), "sqlite"), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP(6)")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP(6)")),
    )

    op.create_table(
        "household_members",
        sa.Column("household_id", sa.BigInteger().with_variant(sa.Integer(), "sqlite"), nullable=False),
        sa.Column("user_id", sa.BigInteger().with_variant(sa.Integer(), "sqlite"), nullable=False),
        sa.Column("role", sa.Enum("OWNER", "MEMBER", name="household_member_role"), nullable=False, server_default="MEMBER"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP(6)")),
        sa.ForeignKeyConstraint(["household_id"], ["households.id"], name="fk_hm_household"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name="fk_hm_user"),
        sa.PrimaryKeyConstraint("household_id", "user_id"),
    )
    op.create_index("ix_household_members_user_id", "household_members", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_household_members_user_id", table_name="household_members")
    op.drop_table("household_members")
    op.drop_table("households")
    op.drop_table("users")