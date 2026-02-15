"""008 portfolio category enum

Revision ID: 008_portfolio_category
Revises: 007_latest_quote_cashflow
Create Date: 2026-02-15 02:35:00
"""

from alembic import op
import sqlalchemy as sa


revision = "008_portfolio_category"
down_revision = "007_latest_quote_cashflow"
branch_labels = None
depends_on = None


PORTFOLIO_CATEGORY_ENUM = sa.Enum(
    "KR_STOCK",
    "US_STOCK",
    "CRYPTO",
    "REAL_ESTATE",
    "BOND",
    "CASH",
    "DEPOSIT_SAVING",
    "ETC",
    name="portfolio_category",
)


def upgrade() -> None:
    op.execute(
        """
        UPDATE portfolios
        SET category = CASE
            WHEN category IS NULL OR TRIM(category) = '' THEN NULL
            WHEN TRIM(category) = '??' THEN 'CASH'
            WHEN UPPER(TRIM(category)) IN (
                'KR_STOCK',
                'US_STOCK',
                'CRYPTO',
                'REAL_ESTATE',
                'BOND',
                'CASH',
                'DEPOSIT_SAVING',
                'ETC'
            ) THEN UPPER(TRIM(category))
            ELSE 'ETC'
        END
        """
    )

    bind = op.get_bind()
    if bind.dialect.name != "sqlite":
        op.alter_column(
            "portfolios",
            "category",
            existing_type=sa.String(length=100),
            type_=PORTFOLIO_CATEGORY_ENUM,
            existing_nullable=True,
        )


def downgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name != "sqlite":
        op.alter_column(
            "portfolios",
            "category",
            existing_type=PORTFOLIO_CATEGORY_ENUM,
            type_=sa.String(length=100),
            existing_nullable=True,
        )
