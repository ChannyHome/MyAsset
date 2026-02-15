"""007 latest quotes and portfolio cashflow metadata

Revision ID: 007_latest_quote_cashflow
Revises: 006_app_settings
Create Date: 2026-02-15 02:10:00
"""

from alembic import op
import sqlalchemy as sa


revision = "007_latest_quote_cashflow"
down_revision = "006_app_settings"
branch_labels = None
depends_on = None


ID_TYPE = sa.BigInteger().with_variant(sa.Integer(), "sqlite")


def upgrade() -> None:
    op.create_table(
        "latest_quotes",
        sa.Column("id", ID_TYPE, primary_key=True, autoincrement=True),
        sa.Column("asset_id", ID_TYPE, nullable=False),
        sa.Column("price", sa.Numeric(24, 8), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("change_value", sa.Numeric(24, 8), nullable=True),
        sa.Column("change_pct", sa.Numeric(12, 6), nullable=True),
        sa.Column("as_of", sa.DateTime(), nullable=False),
        sa.Column("source", sa.String(length=50), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["asset_id"], ["assets.id"], name="fk_latest_quotes_asset", ondelete="CASCADE", onupdate="CASCADE"),
        sa.UniqueConstraint("asset_id", name="uq_latest_quotes_asset_id"),
    )
    op.create_index("ix_latest_quotes_asset_id_asof", "latest_quotes", ["asset_id", "as_of"], unique=False)

    op.add_column("portfolios", sa.Column("category", sa.String(length=100), nullable=True))
    op.add_column("portfolios", sa.Column("memo", sa.Text(), nullable=True))
    op.add_column("portfolios", sa.Column("cumulative_deposit_amount", sa.Numeric(18, 2), nullable=False, server_default=sa.text("0")))
    op.add_column("portfolios", sa.Column("cumulative_withdrawal_amount", sa.Numeric(18, 2), nullable=False, server_default=sa.text("0")))
    op.add_column(
        "portfolios",
        sa.Column(
            "cashflow_source_type",
            sa.Enum("MANUAL", "AUTO", name="portfolio_cashflow_source_type"),
            nullable=False,
            server_default="MANUAL",
        ),
    )


def downgrade() -> None:
    op.drop_column("portfolios", "cashflow_source_type")
    op.drop_column("portfolios", "cumulative_withdrawal_amount")
    op.drop_column("portfolios", "cumulative_deposit_amount")
    op.drop_column("portfolios", "memo")
    op.drop_column("portfolios", "category")

    op.drop_index("ix_latest_quotes_asset_id_asof", table_name="latest_quotes")
    op.drop_table("latest_quotes")

