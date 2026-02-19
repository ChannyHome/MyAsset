"""031 seed release note trade ledger

Revision ID: 031_seed_release_note_trade
Revises: 030_trade_auto_apply_flags
Create Date: 2026-02-19 19:00:00
"""

from alembic import op


revision = "031_seed_release_note_trade"
down_revision = "030_trade_auto_apply_flags"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        INSERT INTO release_notes (released_at, title, summary, is_published, created_by_user_id, updated_by_user_id)
        SELECT
            '2026-02-19 19:00:00',
            'Trade Menu + Manual Ledger Sync',
            'Added Trade menu with manual buy/sell/deposit/withdraw journal. Trades now auto-sync holdings and portfolio principal, plus optional auto cash-holding apply toggles.',
            1,
            NULL,
            NULL
        FROM DUAL
        WHERE NOT EXISTS (
            SELECT 1
            FROM release_notes
            WHERE released_at = '2026-02-19 19:00:00'
              AND title = 'Trade Menu + Manual Ledger Sync'
        )
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DELETE FROM release_notes
        WHERE released_at = '2026-02-19 19:00:00'
          AND title = 'Trade Menu + Manual Ledger Sync'
        """
    )
