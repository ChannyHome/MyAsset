"""017 rbac and signup base columns

Revision ID: 017_rbac_signup_base
Revises: 016_minus_debt_views
Create Date: 2026-02-16 23:40:00
"""

from alembic import op
import sqlalchemy as sa


revision = "017_rbac_signup_base"
down_revision = "016_minus_debt_views"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "role",
            sa.Enum("ADMIN", "MAINTAINER", "SUPERUSER", "USER", "GUEST", name="user_role"),
            nullable=False,
            server_default="USER",
        ),
    )
    op.add_column(
        "users",
        sa.Column(
            "status",
            sa.Enum("ACTIVE", "SUSPENDED", "DEACTIVATED", name="user_status"),
            nullable=False,
            server_default="ACTIVE",
        ),
    )
    op.add_column(
        "users",
        sa.Column("must_change_password", sa.Boolean(), nullable=False, server_default=sa.text("0")),
    )

    op.execute("UPDATE users SET role='USER', status='ACTIVE', must_change_password=0")
    op.execute("UPDATE users SET role='ADMIN' WHERE LOWER(email)='me@myasset.local'")


def downgrade() -> None:
    op.drop_column("users", "must_change_password")
    op.drop_column("users", "status")
    op.drop_column("users", "role")