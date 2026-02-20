"""034 add LOAN_INTEREST transaction type

Revision ID: 034_txn_loan_interest
Revises: 033_kpi_term_aliases
Create Date: 2026-02-20 22:35:00
"""

from alembic import op


revision = "034_txn_loan_interest"
down_revision = "033_kpi_term_aliases"
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
            'LOAN_BORROW',
            'LOAN_REPAY',
            'LOAN_INTEREST'
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
            'ADJUSTMENT',
            'LOAN_BORROW',
            'LOAN_REPAY'
        ) NOT NULL
        """
    )

