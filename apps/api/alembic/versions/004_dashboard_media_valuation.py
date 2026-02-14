"""004 dashboard media valuation

Revision ID: 004_dashboard_media_valuation
Revises: 003_liabilities_quotes_market
Create Date: 2026-02-14 19:20:00
"""

from alembic import op
import sqlalchemy as sa


revision = "004_dashboard_media_valuation"
down_revision = "003_liabilities_quotes_market"
branch_labels = None
depends_on = None


ID_TYPE = sa.BigInteger().with_variant(sa.Integer(), "sqlite")


def upgrade() -> None:
    op.create_table(
        "dashboards",
        sa.Column("id", ID_TYPE, primary_key=True, autoincrement=True),
        sa.Column("owner_user_id", ID_TYPE, nullable=False),
        sa.Column(
            "scope_type",
            sa.Enum("USER", "HOUSEHOLD", name="dashboard_scope_type"),
            nullable=False,
            server_default="USER",
        ),
        sa.Column("scope_id", ID_TYPE, nullable=True),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"], name="fk_dashboards_owner", ondelete="RESTRICT", onupdate="CASCADE"),
    )
    op.create_index("ix_dashboards_owner_user_id", "dashboards", ["owner_user_id"], unique=False)
    op.create_index("ix_dashboards_scope", "dashboards", ["scope_type", "scope_id"], unique=False)

    op.create_table(
        "dashboard_layouts",
        sa.Column("id", ID_TYPE, primary_key=True, autoincrement=True),
        sa.Column("dashboard_id", ID_TYPE, nullable=False),
        sa.Column("version", sa.Integer(), nullable=False),
        sa.Column("layout_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.UniqueConstraint("dashboard_id", "version", name="uq_dashboard_layout_ver"),
        sa.ForeignKeyConstraint(["dashboard_id"], ["dashboards.id"], name="fk_dashboard_layouts_dashboard", ondelete="CASCADE", onupdate="CASCADE"),
    )

    op.create_table(
        "user_settings",
        sa.Column("user_id", ID_TYPE, primary_key=True),
        sa.Column("home_dashboard_id", ID_TYPE, nullable=True),
        sa.Column(
            "default_scope_type",
            sa.Enum("USER", "HOUSEHOLD", name="default_scope_type"),
            nullable=False,
            server_default="HOUSEHOLD",
        ),
        sa.Column("default_scope_id", ID_TYPE, nullable=True),
        sa.Column("hide_values", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column("hide_small_assets", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column("small_asset_threshold", sa.Numeric(18, 2), nullable=False, server_default=sa.text("100000")),
        sa.Column("display_currency", sa.String(length=3), nullable=False, server_default="KRW"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name="fk_user_settings_user", ondelete="CASCADE", onupdate="CASCADE"),
        sa.ForeignKeyConstraint(["home_dashboard_id"], ["dashboards.id"], name="fk_user_settings_dashboard", ondelete="SET NULL", onupdate="CASCADE"),
    )

    op.create_table(
        "media_files",
        sa.Column("id", ID_TYPE, primary_key=True, autoincrement=True),
        sa.Column("owner_user_id", ID_TYPE, nullable=False),
        sa.Column(
            "storage",
            sa.Enum("LOCAL", "S3", name="media_storage"),
            nullable=False,
            server_default="LOCAL",
        ),
        sa.Column("path", sa.String(length=1024), nullable=False),
        sa.Column("original_name", sa.String(length=255), nullable=False),
        sa.Column("mime_type", sa.String(length=100), nullable=False),
        sa.Column("size_bytes", ID_TYPE, nullable=False),
        sa.Column("sha256", sa.String(length=64), nullable=True),
        sa.Column("is_hidden", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"], name="fk_media_files_owner", ondelete="RESTRICT", onupdate="CASCADE"),
    )
    op.create_index("ix_media_files_owner_user_id", "media_files", ["owner_user_id"], unique=False)

    op.create_table(
        "holding_snapshots",
        sa.Column("id", ID_TYPE, primary_key=True, autoincrement=True),
        sa.Column("holding_id", ID_TYPE, nullable=False),
        sa.Column("file_id", ID_TYPE, nullable=False),
        sa.Column("captured_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column("is_hidden", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.ForeignKeyConstraint(["holding_id"], ["holdings.id"], name="fk_holding_snapshots_holding", ondelete="CASCADE", onupdate="CASCADE"),
        sa.ForeignKeyConstraint(["file_id"], ["media_files.id"], name="fk_holding_snapshots_file", ondelete="CASCADE", onupdate="CASCADE"),
    )
    op.create_index("ix_holding_snapshots_holding_id", "holding_snapshots", ["holding_id"], unique=False)
    op.create_index("ix_holding_snapshots_file_id", "holding_snapshots", ["file_id"], unique=False)

    op.create_table(
        "valuation_snapshots",
        sa.Column("id", ID_TYPE, primary_key=True, autoincrement=True),
        sa.Column(
            "scope_type",
            sa.Enum("USER", "HOUSEHOLD", name="valuation_scope_type"),
            nullable=False,
        ),
        sa.Column("scope_id", ID_TYPE, nullable=False),
        sa.Column("display_currency", sa.String(length=3), nullable=False, server_default="KRW"),
        sa.Column("snapshot_date", sa.Date(), nullable=False),
        sa.Column("assets_total", sa.Numeric(18, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("liabilities_total", sa.Numeric(18, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("net_worth_total", sa.Numeric(18, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("as_of", sa.DateTime(), nullable=False),
        sa.Column("source", sa.String(length=50), nullable=False, server_default="SYSTEM"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.UniqueConstraint(
            "scope_type",
            "scope_id",
            "display_currency",
            "snapshot_date",
            name="uq_valuation_scope_date",
        ),
    )
    op.create_index("ix_valuation_scope_date", "valuation_snapshots", ["scope_type", "scope_id", "snapshot_date"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_valuation_scope_date", table_name="valuation_snapshots")
    op.drop_table("valuation_snapshots")

    op.drop_index("ix_holding_snapshots_file_id", table_name="holding_snapshots")
    op.drop_index("ix_holding_snapshots_holding_id", table_name="holding_snapshots")
    op.drop_table("holding_snapshots")

    op.drop_index("ix_media_files_owner_user_id", table_name="media_files")
    op.drop_table("media_files")

    op.drop_table("user_settings")
    op.drop_table("dashboard_layouts")

    op.drop_index("ix_dashboards_scope", table_name="dashboards")
    op.drop_index("ix_dashboards_owner_user_id", table_name="dashboards")
    op.drop_table("dashboards")