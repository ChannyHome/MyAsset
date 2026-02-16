"""015 align portfolio networth view with analytics summary formula

Revision ID: 015_portfolio_networth_align
Revises: 014_summary_views_align_formula
Create Date: 2026-02-16 00:05:00
"""

from alembic import op


revision = "015_portfolio_networth_align"
down_revision = "014_summary_views_align_formula"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("DROP VIEW IF EXISTS v_user_portfolio_networth_v2")

    op.execute(
        """
        CREATE VIEW v_user_portfolio_networth_v2 AS
        SELECT
            p.owner_user_id,
            p.id AS portfolio_id,
            p.name AS portfolio_name,
            p.type AS portfolio_type,
            p.category AS portfolio_category,
            p.base_currency,
            p.is_included,
            p.is_hidden,
            p.cumulative_deposit_amount,
            p.cumulative_withdrawal_amount,
            p.cashflow_source_type,
            COALESCE(a.holdings_count, 0) AS holdings_count,
            COALESCE(a.missing_quote_count, 0) AS missing_quote_count,
            COALESCE(a.owned_assets_total, 0) AS owned_assets_total,
            COALESCE(l.liabilities_count, 0) AS liabilities_count,
            COALESCE(l.liabilities_total, 0) AS liabilities_total,
            COALESCE(a.owned_assets_total, 0) AS gross_assets_total,
            COALESCE(a.owned_assets_total, 0) - COALESCE(l.liabilities_total, 0) AS net_worth_total,
            COALESCE(a.owned_assets_total, 0) - COALESCE(l.liabilities_total, 0) AS net_assets_total,
            a.latest_quote_as_of
        FROM portfolios p
        LEFT JOIN (
            SELECT
                h.owner_user_id,
                h.portfolio_id,
                COUNT(*) AS holdings_count,
                SUM(CASE WHEN lq.asset_id IS NULL THEN 1 ELSE 0 END) AS missing_quote_count,
                COALESCE(SUM(h.quantity * COALESCE(lq.price, h.avg_price)), 0) AS owned_assets_total,
                MAX(lq.as_of) AS latest_quote_as_of
            FROM holdings h
            LEFT JOIN latest_quotes lq ON lq.asset_id = h.asset_id
            WHERE h.portfolio_id IS NOT NULL
              AND h.is_hidden = 0
            GROUP BY h.owner_user_id, h.portfolio_id
        ) a
            ON a.owner_user_id = p.owner_user_id
           AND a.portfolio_id = p.id
        LEFT JOIN (
            SELECT
                li.owner_user_id,
                li.portfolio_id,
                COUNT(*) AS liabilities_count,
                COALESCE(SUM(li.outstanding_balance), 0) AS liabilities_total
            FROM liabilities li
            WHERE li.portfolio_id IS NOT NULL
              AND li.is_hidden = 0
              AND li.is_included = 1
            GROUP BY li.owner_user_id, li.portfolio_id
        ) l
            ON l.owner_user_id = p.owner_user_id
           AND l.portfolio_id = p.id
        """
    )


def downgrade() -> None:
    op.execute("DROP VIEW IF EXISTS v_user_portfolio_networth_v2")

    # Revert to previous formula from 011:
    # gross_assets_total = owned_assets_total + liabilities_total
    # net_assets_total = owned_assets_total
    op.execute(
        """
        CREATE VIEW v_user_portfolio_networth_v2 AS
        SELECT
            p.owner_user_id,
            p.id AS portfolio_id,
            p.name AS portfolio_name,
            p.type AS portfolio_type,
            p.category AS portfolio_category,
            p.base_currency,
            p.is_included,
            p.is_hidden,
            p.cumulative_deposit_amount,
            p.cumulative_withdrawal_amount,
            p.cashflow_source_type,
            COALESCE(a.holdings_count, 0) AS holdings_count,
            COALESCE(a.missing_quote_count, 0) AS missing_quote_count,
            COALESCE(a.owned_assets_total, 0) AS owned_assets_total,
            COALESCE(l.liabilities_count, 0) AS liabilities_count,
            COALESCE(l.liabilities_total, 0) AS liabilities_total,
            COALESCE(a.owned_assets_total, 0) + COALESCE(l.liabilities_total, 0) AS gross_assets_total,
            COALESCE(a.owned_assets_total, 0) - COALESCE(l.liabilities_total, 0) AS net_worth_total,
            COALESCE(a.owned_assets_total, 0) AS net_assets_total,
            a.latest_quote_as_of
        FROM portfolios p
        LEFT JOIN (
            SELECT
                h.owner_user_id,
                h.portfolio_id,
                COUNT(*) AS holdings_count,
                SUM(CASE WHEN lq.asset_id IS NULL THEN 1 ELSE 0 END) AS missing_quote_count,
                COALESCE(SUM(h.quantity * COALESCE(lq.price, h.avg_price)), 0) AS owned_assets_total,
                MAX(lq.as_of) AS latest_quote_as_of
            FROM holdings h
            LEFT JOIN latest_quotes lq ON lq.asset_id = h.asset_id
            WHERE h.portfolio_id IS NOT NULL
              AND h.is_hidden = 0
            GROUP BY h.owner_user_id, h.portfolio_id
        ) a
            ON a.owner_user_id = p.owner_user_id
           AND a.portfolio_id = p.id
        LEFT JOIN (
            SELECT
                li.owner_user_id,
                li.portfolio_id,
                COUNT(*) AS liabilities_count,
                COALESCE(SUM(li.outstanding_balance), 0) AS liabilities_total
            FROM liabilities li
            WHERE li.portfolio_id IS NOT NULL
              AND li.is_hidden = 0
              AND li.is_included = 1
            GROUP BY li.owner_user_id, li.portfolio_id
        ) l
            ON l.owner_user_id = p.owner_user_id
           AND l.portfolio_id = p.id
        """
    )

