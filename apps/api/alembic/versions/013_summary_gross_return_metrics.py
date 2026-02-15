"""013 add principal+debt based gross return metrics

Revision ID: 013_summary_gross_return_metrics
Revises: 012_summary_principal_metrics
Create Date: 2026-02-15 06:05:00
"""

from alembic import op


revision = "013_summary_gross_return_metrics"
down_revision = "012_summary_principal_metrics"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("DROP VIEW IF EXISTS v_household_summary_v2")
    op.execute("DROP VIEW IF EXISTS v_user_summary_v2")

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
            COALESCE(pt.invested_principal_total, 0) AS invested_principal_total,
            COALESCE(pt.withdrawn_total, 0) AS withdrawn_total,
            (
                COALESCE(a.owned_assets_total, 0)
                + COALESCE(pt.withdrawn_total, 0)
                - COALESCE(pt.invested_principal_total, 0)
            ) AS principal_profit_total,
            CASE
                WHEN COALESCE(pt.invested_principal_total, 0) = 0 THEN NULL
                ELSE (
                    (
                        COALESCE(a.owned_assets_total, 0)
                        + COALESCE(pt.withdrawn_total, 0)
                        - COALESCE(pt.invested_principal_total, 0)
                    )
                    / COALESCE(pt.invested_principal_total, 0)
                ) * 100
            END AS principal_return_pct,
            (
                COALESCE(pt.invested_principal_total, 0)
                + COALESCE(ls.liabilities_total_effective, 0)
            ) AS principal_plus_debt_total,
            (
                (COALESCE(a.owned_assets_total, 0) + COALESCE(ls.liabilities_total_effective, 0))
                - (COALESCE(pt.invested_principal_total, 0) + COALESCE(ls.liabilities_total_effective, 0))
            ) AS gross_assets_profit_total,
            CASE
                WHEN (COALESCE(pt.invested_principal_total, 0) + COALESCE(ls.liabilities_total_effective, 0)) = 0 THEN NULL
                ELSE (
                    (
                        (COALESCE(a.owned_assets_total, 0) + COALESCE(ls.liabilities_total_effective, 0))
                        - (COALESCE(pt.invested_principal_total, 0) + COALESCE(ls.liabilities_total_effective, 0))
                    )
                    / (COALESCE(pt.invested_principal_total, 0) + COALESCE(ls.liabilities_total_effective, 0))
                ) * 100
            END AS gross_assets_return_pct,
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
        LEFT JOIN (
            SELECT
                owner_user_id,
                SUM(CASE WHEN is_hidden = 0 AND is_included = 1 THEN cumulative_deposit_amount ELSE 0 END) AS invested_principal_total,
                SUM(CASE WHEN is_hidden = 0 AND is_included = 1 THEN cumulative_withdrawal_amount ELSE 0 END) AS withdrawn_total
            FROM portfolios
            GROUP BY owner_user_id
        ) pt ON pt.owner_user_id = u.id
        """
    )

    op.execute(
        """
        CREATE VIEW v_household_summary_v2 AS
        SELECT
            h.id AS household_id,
            h.name AS household_name,
            COUNT(DISTINCT hm.user_id) AS member_count,
            COALESCE(SUM(us.owned_assets_total), 0) AS owned_assets_total,
            COALESCE(SUM(us.liabilities_total), 0) AS liabilities_total,
            COALESCE(SUM(us.gross_assets_total), 0) AS gross_assets_total,
            COALESCE(SUM(us.net_assets_total), 0) AS net_assets_total,
            COALESCE(SUM(us.invested_principal_total), 0) AS invested_principal_total,
            COALESCE(SUM(us.withdrawn_total), 0) AS withdrawn_total,
            COALESCE(SUM(us.principal_profit_total), 0) AS principal_profit_total,
            CASE
                WHEN COALESCE(SUM(us.invested_principal_total), 0) = 0 THEN NULL
                ELSE (COALESCE(SUM(us.principal_profit_total), 0) / COALESCE(SUM(us.invested_principal_total), 0)) * 100
            END AS principal_return_pct,
            COALESCE(SUM(us.principal_plus_debt_total), 0) AS principal_plus_debt_total,
            COALESCE(SUM(us.gross_assets_profit_total), 0) AS gross_assets_profit_total,
            CASE
                WHEN COALESCE(SUM(us.principal_plus_debt_total), 0) = 0 THEN NULL
                ELSE (COALESCE(SUM(us.gross_assets_profit_total), 0) / COALESCE(SUM(us.principal_plus_debt_total), 0)) * 100
            END AS gross_assets_return_pct,
            MAX(us.latest_quote_as_of) AS latest_quote_as_of
        FROM households h
        LEFT JOIN household_members hm ON hm.household_id = h.id
        LEFT JOIN v_user_summary_v2 us ON us.owner_user_id = hm.user_id
        GROUP BY h.id, h.name
        """
    )


def downgrade() -> None:
    op.execute("DROP VIEW IF EXISTS v_household_summary_v2")
    op.execute("DROP VIEW IF EXISTS v_user_summary_v2")

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
            COALESCE(pt.invested_principal_total, 0) AS invested_principal_total,
            COALESCE(pt.withdrawn_total, 0) AS withdrawn_total,
            (
                COALESCE(a.owned_assets_total, 0)
                + COALESCE(pt.withdrawn_total, 0)
                - COALESCE(pt.invested_principal_total, 0)
            ) AS principal_profit_total,
            CASE
                WHEN COALESCE(pt.invested_principal_total, 0) = 0 THEN NULL
                ELSE (
                    (
                        COALESCE(a.owned_assets_total, 0)
                        + COALESCE(pt.withdrawn_total, 0)
                        - COALESCE(pt.invested_principal_total, 0)
                    )
                    / COALESCE(pt.invested_principal_total, 0)
                ) * 100
            END AS principal_return_pct,
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
        LEFT JOIN (
            SELECT
                owner_user_id,
                SUM(CASE WHEN is_hidden = 0 AND is_included = 1 THEN cumulative_deposit_amount ELSE 0 END) AS invested_principal_total,
                SUM(CASE WHEN is_hidden = 0 AND is_included = 1 THEN cumulative_withdrawal_amount ELSE 0 END) AS withdrawn_total
            FROM portfolios
            GROUP BY owner_user_id
        ) pt ON pt.owner_user_id = u.id
        """
    )

    op.execute(
        """
        CREATE VIEW v_household_summary_v2 AS
        SELECT
            h.id AS household_id,
            h.name AS household_name,
            COUNT(DISTINCT hm.user_id) AS member_count,
            COALESCE(SUM(us.owned_assets_total), 0) AS owned_assets_total,
            COALESCE(SUM(us.liabilities_total), 0) AS liabilities_total,
            COALESCE(SUM(us.gross_assets_total), 0) AS gross_assets_total,
            COALESCE(SUM(us.net_assets_total), 0) AS net_assets_total,
            COALESCE(SUM(us.invested_principal_total), 0) AS invested_principal_total,
            COALESCE(SUM(us.withdrawn_total), 0) AS withdrawn_total,
            COALESCE(SUM(us.principal_profit_total), 0) AS principal_profit_total,
            CASE
                WHEN COALESCE(SUM(us.invested_principal_total), 0) = 0 THEN NULL
                ELSE (COALESCE(SUM(us.principal_profit_total), 0) / COALESCE(SUM(us.invested_principal_total), 0)) * 100
            END AS principal_return_pct,
            MAX(us.latest_quote_as_of) AS latest_quote_as_of
        FROM households h
        LEFT JOIN household_members hm ON hm.household_id = h.id
        LEFT JOIN v_user_summary_v2 us ON us.owner_user_id = hm.user_id
        GROUP BY h.id, h.name
        """
    )
