"""002 portfolio asset holding

Revision ID: 002_portfolio_asset_holding
Revises: 001_base_auth_scope
Create Date: 2026-02-14 17:00:00
"""

from alembic import op
import sqlalchemy as sa


revision = "002_portfolio_asset_holding"
down_revision = "001_base_auth_scope"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "portfolios",
        sa.Column("id", sa.BigInteger().with_variant(sa.Integer(), "sqlite"), primary_key=True, autoincrement=True),
        sa.Column("owner_user_id", sa.BigInteger().with_variant(sa.Integer(), "sqlite"), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("type", sa.Enum("BROKER", "EXCHANGE", "BANK", "CASH", "ETC", name="portfolio_type"), nullable=False, server_default="ETC"),
        sa.Column("base_currency", sa.String(length=3), nullable=False, server_default="KRW"),
        sa.Column("is_included", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.Column("is_hidden", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"], name="fk_portfolios_owner"),
    )
    op.create_index("ix_portfolios_owner_user_id", "portfolios", ["owner_user_id"], unique=False)

    op.create_table(
        "assets",
        sa.Column("id", sa.BigInteger().with_variant(sa.Integer(), "sqlite"), primary_key=True, autoincrement=True),
        sa.Column(
            "asset_class",
            sa.Enum("STOCK", "CRYPTO", "REAL_ESTATE", "DEPOSIT_SAVING", "BOND", "ETC", name="asset_class"),
            nullable=False,
        ),
        sa.Column("symbol", sa.String(length=64), nullable=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False, server_default="KRW"),
        sa.Column("meta_json", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.UniqueConstraint("asset_class", "symbol", name="uq_assets_class_symbol"),
    )
    op.create_index("ix_assets_class", "assets", ["asset_class"], unique=False)
    op.create_index("ix_assets_symbol", "assets", ["symbol"], unique=False)

    op.create_table(
        "holdings",
        sa.Column("id", sa.BigInteger().with_variant(sa.Integer(), "sqlite"), primary_key=True, autoincrement=True),
        sa.Column("owner_user_id", sa.BigInteger().with_variant(sa.Integer(), "sqlite"), nullable=False),
        sa.Column("portfolio_id", sa.BigInteger().with_variant(sa.Integer(), "sqlite"), nullable=True),
        sa.Column("asset_id", sa.BigInteger().with_variant(sa.Integer(), "sqlite"), nullable=False),
        sa.Column("quantity", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("avg_price", sa.Numeric(24, 8), nullable=False, server_default=sa.text("0")),
        sa.Column("invested_amount", sa.Numeric(18, 2), nullable=True),
        sa.Column("source_type", sa.Enum("MANUAL", "AUTO", name="holding_source_type"), nullable=False, server_default="MANUAL"),
        sa.Column("is_hidden", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column("memo", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"], name="fk_holdings_owner"),
        sa.ForeignKeyConstraint(["portfolio_id"], ["portfolios.id"], name="fk_holdings_portfolio"),
        sa.ForeignKeyConstraint(["asset_id"], ["assets.id"], name="fk_holdings_asset"),
    )
    op.create_index("ix_holdings_owner_user_id", "holdings", ["owner_user_id"], unique=False)
    op.create_index("ix_holdings_portfolio_id", "holdings", ["portfolio_id"], unique=False)
    op.create_index("ix_holdings_asset_id", "holdings", ["asset_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_holdings_asset_id", table_name="holdings")
    op.drop_index("ix_holdings_portfolio_id", table_name="holdings")
    op.drop_index("ix_holdings_owner_user_id", table_name="holdings")
    op.drop_table("holdings")

    op.drop_index("ix_assets_symbol", table_name="assets")
    op.drop_index("ix_assets_class", table_name="assets")
    op.drop_table("assets")

    op.drop_index("ix_portfolios_owner_user_id", table_name="portfolios")
    op.drop_table("portfolios")
