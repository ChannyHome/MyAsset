"""033 seed release note kpi terms

Revision ID: 033_kpi_term_aliases
Revises: 032_trade_liability_link
Create Date: 2026-02-19 21:30:00
"""

from alembic import op


revision = "033_kpi_term_aliases"
down_revision = "032_trade_liability_link"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        INSERT INTO release_notes (released_at, title, summary, is_published, created_by_user_id, updated_by_user_id)
        SELECT
            '2026-02-19 21:30:00',
            'KPI Terms Unified + API Alias Fields',
            'Unified KPI wording across Home/Report/Agent/Trade and added alias fields (debt_adjusted_principal_total, net_contribution_total, portfolio_profit_total, avg_cost, cost_basis_total). Added principal_net server sort for portfolio table.',
            1,
            NULL,
            NULL
        FROM DUAL
        WHERE NOT EXISTS (
            SELECT 1
            FROM release_notes
            WHERE released_at = '2026-02-19 21:30:00'
              AND title = 'KPI Terms Unified + API Alias Fields'
        )
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DELETE FROM release_notes
        WHERE released_at = '2026-02-19 21:30:00'
          AND title = 'KPI Terms Unified + API Alias Fields'
        """
    )

