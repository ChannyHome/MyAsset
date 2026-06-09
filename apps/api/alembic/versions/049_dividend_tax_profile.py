"""049 dividend tax profile

Revision ID: 049_dividend_tax
Revises: 048_dividend_forecast
Create Date: 2026-06-09
"""

from alembic import op
import sqlalchemy as sa


revision = "049_dividend_tax"
down_revision = "048_dividend_forecast"
branch_labels = None
depends_on = None


def _columns(table_name: str) -> set[str]:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    return {column["name"] for column in inspector.get_columns(table_name)}


def _add_column_if_missing(table_name: str, column: sa.Column) -> None:
    if column.name not in _columns(table_name):
        op.add_column(table_name, column)


def _drop_column_if_exists(table_name: str, column_name: str) -> None:
    if column_name in _columns(table_name):
        op.drop_column(table_name, column_name)


def upgrade() -> None:
    portfolio_columns = _columns("portfolios")
    _add_column_if_missing("portfolios", sa.Column("tax_profile", sa.String(length=30), nullable=True))
    _add_column_if_missing("portfolios", sa.Column("dividend_tax_rate_pct", sa.Numeric(9, 4), nullable=True))

    bind = op.get_bind()
    if "dividend_tax_profile" in portfolio_columns:
        bind.execute(sa.text("UPDATE portfolios SET tax_profile = dividend_tax_profile WHERE tax_profile IS NULL AND dividend_tax_profile IS NOT NULL"))

    bind.execute(
        sa.text(
            """
            UPDATE portfolios
            SET tax_profile = CASE
                WHEN UPPER(COALESCE(name, '')) LIKE '%IRP%'
                  OR COALESCE(name, '') LIKE '%연금%'
                  OR COALESCE(name, '') LIKE '%퇴직%' THEN 'PENSION'
                WHEN UPPER(COALESCE(name, '')) LIKE '%ISA%' THEN 'ISA'
                WHEN UPPER(COALESCE(category, '')) = 'US_STOCK'
                  OR UPPER(COALESCE(base_currency, '')) = 'USD'
                  OR UPPER(COALESCE(exchange_code, '')) IN ('US', 'NYSE', 'NASDAQ', 'AMEX') THEN 'GENERAL_US'
                ELSE 'GENERAL'
            END
            WHERE tax_profile IS NULL
            """
        )
    )
    bind.execute(
        sa.text(
            """
            INSERT INTO app_settings (`key`, value)
            VALUES ('financial_income_taxable_limit_krw', '20000000')
            ON DUPLICATE KEY UPDATE value = value
            """
        )
    )


def downgrade() -> None:
    _drop_column_if_exists("portfolios", "tax_profile")
    op.execute(sa.text("DELETE FROM app_settings WHERE `key` = 'financial_income_taxable_limit_krw' AND value = '20000000'"))
