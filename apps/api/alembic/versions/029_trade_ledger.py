"""029 trade ledger

Revision ID: 029_trade_ledger
Revises: 028_api_audit_logs
Create Date: 2026-02-19 17:10:00
"""

from alembic import op
import sqlalchemy as sa


revision = "029_trade_ledger"
down_revision = "028_api_audit_logs"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "transactions",
        sa.Column("id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("owner_user_id", sa.BigInteger(), nullable=False),
        sa.Column("portfolio_id", sa.BigInteger(), nullable=False),
        sa.Column("asset_id", sa.BigInteger(), nullable=True),
        sa.Column(
            "txn_type",
            sa.Enum(
                "BUY",
                "SELL",
                "DEPOSIT",
                "WITHDRAW",
                "DIVIDEND",
                "FEE",
                "ADJUSTMENT",
                name="transaction_type",
            ),
            nullable=False,
        ),
        sa.Column("quantity", sa.Numeric(24, 8), nullable=True),
        sa.Column("unit_price", sa.Numeric(24, 8), nullable=True),
        sa.Column("amount", sa.Numeric(18, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("currency", sa.String(length=3), nullable=False, server_default="KRW"),
        sa.Column(
            "amount_in_portfolio_currency",
            sa.Numeric(18, 2),
            nullable=False,
            server_default=sa.text("0"),
        ),
        sa.Column("fx_rate_used", sa.Numeric(24, 8), nullable=True),
        sa.Column("fx_as_of", sa.DateTime(), nullable=True),
        sa.Column("fx_source", sa.String(length=50), nullable=True),
        sa.Column("executed_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("memo", sa.Text(), nullable=True),
        sa.Column(
            "source_type",
            sa.Enum("MANUAL", "AUTO", name="transaction_source_type"),
            nullable=False,
            server_default="MANUAL",
        ),
        sa.Column(
            "status",
            sa.Enum("POSTED", "VOID", name="transaction_status"),
            nullable=False,
            server_default="POSTED",
        ),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["portfolio_id"], ["portfolios.id"]),
        sa.ForeignKeyConstraint(["asset_id"], ["assets.id"]),
    )

    op.create_index("ix_transactions_owner_executed", "transactions", ["owner_user_id", "executed_at"], unique=False)
    op.create_index("ix_transactions_portfolio_executed", "transactions", ["portfolio_id", "executed_at"], unique=False)
    op.create_index("ix_transactions_asset_executed", "transactions", ["asset_id", "executed_at"], unique=False)
    op.create_index("ix_transactions_type_executed", "transactions", ["txn_type", "executed_at"], unique=False)
    op.create_index("ix_transactions_status_executed", "transactions", ["status", "executed_at"], unique=False)
    op.create_index("ix_transactions_portfolio_id", "transactions", ["portfolio_id"], unique=False)
    op.create_index("ix_transactions_asset_id", "transactions", ["asset_id"], unique=False)
    op.create_index("ix_transactions_owner_user_id", "transactions", ["owner_user_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_transactions_owner_user_id", table_name="transactions")
    op.drop_index("ix_transactions_asset_id", table_name="transactions")
    op.drop_index("ix_transactions_portfolio_id", table_name="transactions")
    op.drop_index("ix_transactions_status_executed", table_name="transactions")
    op.drop_index("ix_transactions_type_executed", table_name="transactions")
    op.drop_index("ix_transactions_asset_executed", table_name="transactions")
    op.drop_index("ix_transactions_portfolio_executed", table_name="transactions")
    op.drop_index("ix_transactions_owner_executed", table_name="transactions")
    op.drop_table("transactions")

