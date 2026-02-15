"""009 db views for heidisql reporting

Revision ID: 009_asset_views
Revises: 008_portfolio_category
Create Date: 2026-02-15 04:20:00
"""

from alembic import op


revision = "009_asset_views"
down_revision = "008_portfolio_category"
branch_labels = None
depends_on = None


VIEW_DROP_ORDER = [
    "v_user_summary_v2",
    "v_user_asset_class_performance",
    "v_user_portfolio_performance",
    "v_user_liability_summary",
    "v_user_holding_performance",
]


def _drop_views() -> None:
    for view_name in VIEW_DROP_ORDER:
        op.execute(f"DROP VIEW IF EXISTS {view_name}")


def upgrade() -> None:
    _drop_views()

    op.execute(
        """
        CREATE VIEW v_user_holding_performance AS
        SELECT
            h.owner_user_id,
            h.id AS holding_id,
            h.portfolio_id,
            p.name AS portfolio_name,
            p.type AS portfolio_type,
            p.category AS portfolio_category,
            p.is_included AS portfolio_is_included,
            p.is_hidden AS portfolio_is_hidden,
            h.asset_id,
            a.asset_class,
            a.symbol,
            a.name AS asset_name,
            a.currency AS asset_currency,
            h.quantity,
            h.avg_price,
            COALESCE(h.invested_amount, (h.quantity * h.avg_price)) AS invested_amount,
            COALESCE(lq.price, h.avg_price) AS current_price,
            COALESCE(lq.currency, a.currency) AS current_price_currency,
            lq.as_of AS quote_as_of,
            (h.quantity * COALESCE(lq.price, h.avg_price)) AS evaluated_amount,
            ((h.quantity * COALESCE(lq.price, h.avg_price)) - COALESCE(h.invested_amount, (h.quantity * h.avg_price))) AS pnl_amount,
            CASE
                WHEN COALESCE(h.invested_amount, (h.quantity * h.avg_price)) = 0 THEN NULL
                ELSE (
                    ((h.quantity * COALESCE(lq.price, h.avg_price)) - COALESCE(h.invested_amount, (h.quantity * h.avg_price)))
                    / COALESCE(h.invested_amount, (h.quantity * h.avg_price))
                ) * 100
            END AS pnl_pct,
            h.is_hidden AS holding_is_hidden,
            CASE
                WHEN h.is_hidden = 1 THEN 0
                WHEN h.portfolio_id IS NOT NULL AND p.is_hidden = 1 THEN 0
                WHEN h.portfolio_id IS NOT NULL AND p.is_included = 0 THEN 0
                ELSE 1
            END AS effective_included
        FROM holdings h
        JOIN assets a ON a.id = h.asset_id
        LEFT JOIN portfolios p ON p.id = h.portfolio_id
        LEFT JOIN latest_quotes lq ON lq.asset_id = h.asset_id
        """
    )

    op.execute(
        """
        CREATE VIEW v_user_asset_class_performance AS
        SELECT
            owner_user_id,
            asset_class,
            SUM(invested_amount) AS invested_total,
            SUM(evaluated_amount) AS assets_total,
            SUM(pnl_amount) AS pnl_total,
            CASE
                WHEN SUM(invested_amount) = 0 THEN NULL
                ELSE (SUM(pnl_amount) / SUM(invested_amount)) * 100
            END AS pnl_pct
        FROM v_user_holding_performance
        WHERE effective_included = 1
        GROUP BY owner_user_id, asset_class
        """
    )

    op.execute(
        """
        CREATE VIEW v_user_liability_summary AS
        SELECT
            l.owner_user_id,
            COUNT(*) AS liabilities_count_all,
            SUM(l.outstanding_balance) AS liabilities_total_all,
            SUM(
                CASE
                    WHEN l.is_included = 1
                        AND l.is_hidden = 0
                        AND (l.portfolio_id IS NULL OR (p.is_hidden = 0 AND p.is_included = 1))
                    THEN 1
                    ELSE 0
                END
            ) AS liabilities_count_effective,
            SUM(
                CASE
                    WHEN l.is_included = 1
                        AND l.is_hidden = 0
                        AND (l.portfolio_id IS NULL OR (p.is_hidden = 0 AND p.is_included = 1))
                    THEN l.outstanding_balance
                    ELSE 0
                END
            ) AS liabilities_total_effective
        FROM liabilities l
        LEFT JOIN portfolios p ON p.id = l.portfolio_id
        GROUP BY l.owner_user_id
        """
    )

    op.execute(
        """
        CREATE VIEW v_user_summary_v2 AS
        SELECT
            u.id AS owner_user_id,
            COALESCE(a.owned_assets_total, 0) AS owned_assets_total,
            COALESCE(ls.liabilities_total_effective, 0) AS liabilities_total,
            COALESCE(a.owned_assets_total, 0) + COALESCE(ls.liabilities_total_effective, 0) AS gross_assets_total,
            COALESCE(a.owned_assets_total, 0) AS net_assets_total,
            COALESCE(a.holdings_count, 0) AS holdings_count,
            COALESCE(ls.liabilities_count_effective, 0) AS liabilities_count,
            a.latest_quote_as_of
        FROM users u
        LEFT JOIN (
            SELECT
                owner_user_id,
                SUM(evaluated_amount) AS owned_assets_total,
                COUNT(*) AS holdings_count,
                MAX(quote_as_of) AS latest_quote_as_of
            FROM v_user_holding_performance
            WHERE effective_included = 1
            GROUP BY owner_user_id
        ) a ON a.owner_user_id = u.id
        LEFT JOIN v_user_liability_summary ls ON ls.owner_user_id = u.id
        """
    )

    op.execute(
        """
        CREATE VIEW v_user_portfolio_performance AS
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
            COUNT(h.id) AS holding_count,
            SUM(CASE WHEN h.id IS NOT NULL AND lq.asset_id IS NULL THEN 1 ELSE 0 END) AS missing_quote_count,
            COALESCE(SUM(h.quantity * COALESCE(lq.price, h.avg_price)), 0) AS nav_amount,
            (
                COALESCE(SUM(h.quantity * COALESCE(lq.price, h.avg_price)), 0)
                + p.cumulative_withdrawal_amount
                - p.cumulative_deposit_amount
            ) AS total_pnl_amount,
            CASE
                WHEN p.cumulative_deposit_amount = 0 THEN NULL
                ELSE (
                    (
                        COALESCE(SUM(h.quantity * COALESCE(lq.price, h.avg_price)), 0)
                        + p.cumulative_withdrawal_amount
                        - p.cumulative_deposit_amount
                    )
                    / p.cumulative_deposit_amount
                ) * 100
            END AS total_return_pct,
            MAX(lq.as_of) AS latest_quote_as_of
        FROM portfolios p
        LEFT JOIN holdings h
            ON h.portfolio_id = p.id
            AND h.owner_user_id = p.owner_user_id
            AND h.is_hidden = 0
        LEFT JOIN latest_quotes lq ON lq.asset_id = h.asset_id
        GROUP BY
            p.owner_user_id,
            p.id,
            p.name,
            p.type,
            p.category,
            p.base_currency,
            p.is_included,
            p.is_hidden,
            p.cumulative_deposit_amount,
            p.cumulative_withdrawal_amount,
            p.cashflow_source_type
        """
    )


def downgrade() -> None:
    _drop_views()
