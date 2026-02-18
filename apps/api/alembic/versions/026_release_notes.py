"""026 release notes table

Revision ID: 026_release_notes
Revises: 025_hold_ccy_cols
Create Date: 2026-02-18 22:40:00
"""

from alembic import op
import sqlalchemy as sa


revision = "026_release_notes"
down_revision = "025_hold_ccy_cols"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "release_notes",
        sa.Column("id", sa.BigInteger(), nullable=False),
        sa.Column("released_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("summary", sa.String(length=1000), nullable=False),
        sa.Column("is_published", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.Column("created_by_user_id", sa.BigInteger(), nullable=True),
        sa.Column("updated_by_user_id", sa.BigInteger(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["created_by_user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["updated_by_user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_release_notes_released_at", "release_notes", ["released_at"], unique=False)
    op.create_index("ix_release_notes_is_published", "release_notes", ["is_published"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_release_notes_is_published", table_name="release_notes")
    op.drop_index("ix_release_notes_released_at", table_name="release_notes")
    op.drop_table("release_notes")
