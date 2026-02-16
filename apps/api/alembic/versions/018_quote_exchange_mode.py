"""018 add quote mode and exchange code columns

Revision ID: 018_quote_exchange_mode
Revises: 017_rbac_signup_base
Create Date: 2026-02-17 02:30:00
"""

from alembic import op
import sqlalchemy as sa


revision = "018_quote_exchange_mode"
down_revision = "017_rbac_signup_base"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "assets",
        sa.Column(
            "quote_mode",
            sa.Enum("AUTO", "MANUAL", name="asset_quote_mode"),
            nullable=False,
            server_default="AUTO",
        ),
    )
    op.add_column(
        "assets",
        sa.Column("exchange_code", sa.String(length=20), nullable=False, server_default="GLOBAL"),
    )
    op.add_column(
        "assets",
        sa.Column("is_trade_supported", sa.Boolean(), nullable=False, server_default=sa.text("1")),
    )
    op.create_index("ix_assets_exchange_code", "assets", ["exchange_code"], unique=False)

    op.add_column("portfolios", sa.Column("exchange_code", sa.String(length=20), nullable=True))
    op.create_index("ix_portfolios_exchange_code", "portfolios", ["exchange_code"], unique=False)

    op.execute("UPDATE assets SET quote_mode='MANUAL' WHERE asset_class IN ('REAL_ESTATE','DEPOSIT_SAVING','BOND','ETC')")
    op.execute("UPDATE assets SET exchange_code='UPBIT' WHERE asset_class='CRYPTO' AND currency='KRW'")
    op.execute(
        """
        UPDATE assets
        SET exchange_code=UPPER(JSON_UNQUOTE(JSON_EXTRACT(meta_json, '$.exchange_code')))
        WHERE JSON_EXTRACT(meta_json, '$.exchange_code') IS NOT NULL
        """
    )
    op.execute(
        """
        UPDATE portfolios
        SET exchange_code='UPBIT'
        WHERE category='CRYPTO' AND (exchange_code IS NULL OR exchange_code='')
        """
    )

    op.drop_constraint("uq_assets_class_symbol", "assets", type_="unique")
    op.create_unique_constraint(
        "uq_assets_class_symbol_exchange",
        "assets",
        ["asset_class", "symbol", "exchange_code"],
    )


def downgrade() -> None:
    op.drop_constraint("uq_assets_class_symbol_exchange", "assets", type_="unique")
    op.create_unique_constraint("uq_assets_class_symbol", "assets", ["asset_class", "symbol"])

    op.drop_index("ix_portfolios_exchange_code", table_name="portfolios")
    op.drop_column("portfolios", "exchange_code")

    op.drop_index("ix_assets_exchange_code", table_name="assets")
    op.drop_column("assets", "is_trade_supported")
    op.drop_column("assets", "exchange_code")
    op.drop_column("assets", "quote_mode")
