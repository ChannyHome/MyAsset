"""032 trade liability link

Revision ID: 032_trade_liability_link
Revises: 031_seed_release_note_trade
Create Date: 2026-02-20 00:10:00
"""

from alembic import op
import sqlalchemy as sa


revision = "032_trade_liability_link"
down_revision = "031_seed_release_note_trade"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "transactions",
        sa.Column("liability_id", sa.BigInteger(), nullable=True),
    )
    op.create_index("ix_transactions_liability_id", "transactions", ["liability_id"], unique=False)
    op.create_index(
        "ix_transactions_liability_executed",
        "transactions",
        ["liability_id", "executed_at"],
        unique=False,
    )
    op.create_foreign_key(
        "fk_transactions_liability_id",
        "transactions",
        "liabilities",
        ["liability_id"],
        ["id"],
    )
    op.execute(
        """
        ALTER TABLE transactions
        MODIFY COLUMN txn_type ENUM(
            'BUY',
            'SELL',
            'DEPOSIT',
            'WITHDRAW',
            'DIVIDEND',
            'FEE',
            'ADJUSTMENT',
            'LOAN_BORROW',
            'LOAN_REPAY'
        ) NOT NULL
        """
    )


def downgrade() -> None:
    op.execute(
        """
        ALTER TABLE transactions
        MODIFY COLUMN txn_type ENUM(
            'BUY',
            'SELL',
            'DEPOSIT',
            'WITHDRAW',
            'DIVIDEND',
            'FEE',
            'ADJUSTMENT'
        ) NOT NULL
        """
    )
    op.drop_constraint("fk_transactions_liability_id", "transactions", type_="foreignkey")
    op.drop_index("ix_transactions_liability_executed", table_name="transactions")
    op.drop_index("ix_transactions_liability_id", table_name="transactions")
    op.drop_column("transactions", "liability_id")

