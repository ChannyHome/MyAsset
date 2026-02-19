"""030 trade auto apply flags

Revision ID: 030_trade_auto_apply_flags
Revises: 029_trade_ledger
Create Date: 2026-02-19 18:05:00
"""

from alembic import op
import sqlalchemy as sa


revision = "030_trade_auto_apply_flags"
down_revision = "029_trade_ledger"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "transactions",
        sa.Column("auto_apply_cash_holding", sa.Boolean(), nullable=False, server_default=sa.text("1")),
    )
    op.add_column(
        "transactions",
        sa.Column("auto_apply_portfolio_cashflow", sa.Boolean(), nullable=False, server_default=sa.text("1")),
    )


def downgrade() -> None:
    op.drop_column("transactions", "auto_apply_portfolio_cashflow")
    op.drop_column("transactions", "auto_apply_cash_holding")

