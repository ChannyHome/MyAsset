"""024 app secrets vault table

Revision ID: 024_app_secrets
Revises: 023_portfolio_drop_networth
Create Date: 2026-02-17 16:30:00
"""

from alembic import op
import sqlalchemy as sa


revision = "024_app_secrets"
down_revision = "023_portfolio_drop_networth"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "app_secrets",
        sa.Column("id", sa.BigInteger(), nullable=False),
        sa.Column("provider", sa.String(length=50), nullable=False),
        sa.Column("key_name", sa.String(length=100), nullable=False),
        sa.Column("encrypted_value", sa.Text(), nullable=False),
        sa.Column("description", sa.String(length=255), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.Column("created_by_user_id", sa.BigInteger(), nullable=True),
        sa.Column("updated_by_user_id", sa.BigInteger(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["created_by_user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["updated_by_user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("provider", "key_name", name="uq_app_secrets_provider_key"),
    )
    op.create_index("ix_app_secrets_provider", "app_secrets", ["provider"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_app_secrets_provider", table_name="app_secrets")
    op.drop_table("app_secrets")
