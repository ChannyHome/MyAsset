"""003 liabilities quotes market

Revision ID: 003_liabilities_quotes_market
Revises: 002_portfolio_asset_holding
Create Date: 2026-02-14 19:10:00
"""

from alembic import op
import sqlalchemy as sa


revision = "003_liabilities_quotes_market"
down_revision = "002_portfolio_asset_holding"
branch_labels = None
depends_on = None


ID_TYPE = sa.BigInteger().with_variant(sa.Integer(), "sqlite")


def upgrade() -> None:
    op.create_table(
        "liabilities",
        sa.Column("id", ID_TYPE, primary_key=True, autoincrement=True),
        sa.Column("owner_user_id", ID_TYPE, nullable=False),
        sa.Column("portfolio_id", ID_TYPE, nullable=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column(
            "liability_type",
            sa.Enum("MORTGAGE", "CREDIT_LOAN", "CARD", "ETC", name="liability_type"),
            nullable=False,
            server_default="ETC",
        ),
        sa.Column("currency", sa.String(length=3), nullable=False, server_default="KRW"),
        sa.Column("outstanding_balance", sa.Numeric(18, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("interest_rate", sa.Numeric(9, 6), nullable=True),
        sa.Column("monthly_payment", sa.Numeric(18, 2), nullable=True),
        sa.Column(
            "source_type",
            sa.Enum("MANUAL", "AUTO", name="liability_source_type"),
            nullable=False,
            server_default="MANUAL",
        ),
        sa.Column("is_included", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.Column("is_hidden", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column("memo", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"], name="fk_liabilities_owner", ondelete="RESTRICT", onupdate="CASCADE"),
        sa.ForeignKeyConstraint(["portfolio_id"], ["portfolios.id"], name="fk_liabilities_portfolio", ondelete="SET NULL", onupdate="CASCADE"),
    )
    op.create_index("ix_liabilities_owner_user_id", "liabilities", ["owner_user_id"], unique=False)
    op.create_index("ix_liabilities_portfolio_id", "liabilities", ["portfolio_id"], unique=False)

    op.create_table(
        "asset_quotes",
        sa.Column("id", ID_TYPE, primary_key=True, autoincrement=True),
        sa.Column("asset_id", ID_TYPE, nullable=False),
        sa.Column("price", sa.Numeric(24, 8), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("change_value", sa.Numeric(24, 8), nullable=True),
        sa.Column("change_pct", sa.Numeric(12, 6), nullable=True),
        sa.Column("as_of", sa.DateTime(), nullable=False),
        sa.Column("source", sa.String(length=50), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["asset_id"], ["assets.id"], name="fk_asset_quotes_asset", ondelete="CASCADE", onupdate="CASCADE"),
    )
    op.create_index("ix_asset_quotes_asset_asof", "asset_quotes", ["asset_id", "as_of"], unique=False)

    op.create_table(
        "fx_rates",
        sa.Column("id", ID_TYPE, primary_key=True, autoincrement=True),
        sa.Column("base_currency", sa.String(length=3), nullable=False),
        sa.Column("quote_currency", sa.String(length=3), nullable=False),
        sa.Column("rate", sa.Numeric(24, 8), nullable=False),
        sa.Column("as_of", sa.DateTime(), nullable=False),
        sa.Column("source", sa.String(length=50), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
    )
    op.create_index("ix_fx_rates_pair_asof", "fx_rates", ["base_currency", "quote_currency", "as_of"], unique=False)

    op.create_table(
        "market_symbols",
        sa.Column("symbol", sa.String(length=32), primary_key=True),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column(
            "type",
            sa.Enum("INDEX", "CRYPTO", "FX", "COMMODITY", name="market_symbol_type"),
            nullable=False,
            server_default="INDEX",
        ),
        sa.Column("currency", sa.String(length=3), nullable=False, server_default="USD"),
    )

    op.create_table(
        "market_quotes",
        sa.Column("id", ID_TYPE, primary_key=True, autoincrement=True),
        sa.Column("symbol", sa.String(length=32), nullable=False),
        sa.Column("last_price", sa.Numeric(24, 8), nullable=False),
        sa.Column("change_value", sa.Numeric(24, 8), nullable=True),
        sa.Column("change_pct", sa.Numeric(12, 6), nullable=True),
        sa.Column("as_of", sa.DateTime(), nullable=False),
        sa.Column("source", sa.String(length=50), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["symbol"], ["market_symbols.symbol"], name="fk_market_quotes_symbol", ondelete="CASCADE", onupdate="CASCADE"),
    )
    op.create_index("ix_market_quotes_symbol_asof", "market_quotes", ["symbol", "as_of"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_market_quotes_symbol_asof", table_name="market_quotes")
    op.drop_table("market_quotes")
    op.drop_table("market_symbols")

    op.drop_index("ix_fx_rates_pair_asof", table_name="fx_rates")
    op.drop_table("fx_rates")

    op.drop_index("ix_asset_quotes_asset_asof", table_name="asset_quotes")
    op.drop_table("asset_quotes")

    op.drop_index("ix_liabilities_portfolio_id", table_name="liabilities")
    op.drop_index("ix_liabilities_owner_user_id", table_name="liabilities")
    op.drop_table("liabilities")