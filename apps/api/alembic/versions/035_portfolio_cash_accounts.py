"""035 portfolio cash accounts

Revision ID: 035_portfolio_cash_accounts
Revises: 034_txn_loan_interest
Create Date: 2026-02-21 21:20:00
"""

from alembic import op
import sqlalchemy as sa


revision = "035_portfolio_cash_accounts"
down_revision = "034_txn_loan_interest"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bigint = sa.BigInteger().with_variant(sa.Integer(), "sqlite")
    op.create_table(
        "portfolio_cash_accounts",
        sa.Column("id", bigint, primary_key=True, autoincrement=True),
        sa.Column("owner_user_id", bigint, nullable=False),
        sa.Column("portfolio_id", bigint, nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("asset_id", bigint, nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["portfolio_id"], ["portfolios.id"]),
        sa.ForeignKeyConstraint(["asset_id"], ["assets.id"]),
        sa.UniqueConstraint(
            "portfolio_id",
            "currency",
            name="uq_portfolio_cash_accounts_portfolio_currency",
        ),
    )
    op.create_index(
        "ix_portfolio_cash_accounts_owner_user_id",
        "portfolio_cash_accounts",
        ["owner_user_id"],
        unique=False,
    )
    op.create_index(
        "ix_portfolio_cash_accounts_portfolio_id",
        "portfolio_cash_accounts",
        ["portfolio_id"],
        unique=False,
    )
    op.create_index(
        "ix_portfolio_cash_accounts_currency",
        "portfolio_cash_accounts",
        ["currency"],
        unique=False,
    )
    op.create_index(
        "ix_portfolio_cash_accounts_asset_id",
        "portfolio_cash_accounts",
        ["asset_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_portfolio_cash_accounts_asset_id", table_name="portfolio_cash_accounts")
    op.drop_index("ix_portfolio_cash_accounts_currency", table_name="portfolio_cash_accounts")
    op.drop_index("ix_portfolio_cash_accounts_portfolio_id", table_name="portfolio_cash_accounts")
    op.drop_index("ix_portfolio_cash_accounts_owner_user_id", table_name="portfolio_cash_accounts")
    op.drop_table("portfolio_cash_accounts")
