"""027 seed release note 2026-02-18

Revision ID: 027_seed_release_note_20260218
Revises: 026_release_notes
Create Date: 2026-02-18 23:25:00
"""

from alembic import op


revision = "027_seed_release_note_20260218"
down_revision = "026_release_notes"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        INSERT INTO release_notes (released_at, title, summary, is_published, created_by_user_id, updated_by_user_id)
        SELECT
            '2026-02-18 23:10:00',
            'Holdings Currency Inputs + Release Notes DB',
            'Added holding avg/invested currency inputs in Agent create/edit flows and moved Home release notes to DB-backed API with fallback support.',
            1,
            NULL,
            NULL
        FROM DUAL
        WHERE NOT EXISTS (
            SELECT 1
            FROM release_notes
            WHERE released_at = '2026-02-18 23:10:00'
              AND title = 'Holdings Currency Inputs + Release Notes DB'
        )
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DELETE FROM release_notes
        WHERE released_at = '2026-02-18 23:10:00'
          AND title = 'Holdings Currency Inputs + Release Notes DB'
        """
    )
