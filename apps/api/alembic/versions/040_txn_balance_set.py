"""040 add BALANCE_SET transaction type

Revision ID: 040_txn_balance_set
Revises: 039_snapshots
Create Date: 2026-03-14 22:45:00
"""

from alembic import op


revision = "040_txn_balance_set"
down_revision = "039_snapshots"
branch_labels = None
depends_on = None


def upgrade() -> None:
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
            'BALANCE_SET',
            'LOAN_BORROW',
            'LOAN_REPAY',
            'LOAN_INTEREST'
        ) NOT NULL
        """
    )


def downgrade() -> None:
    op.execute(
        """
        UPDATE transactions
        SET txn_type = 'ADJUSTMENT'
        WHERE txn_type = 'BALANCE_SET'
        """
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
            'LOAN_REPAY',
            'LOAN_INTEREST'
        ) NOT NULL
        """
    )
