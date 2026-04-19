from datetime import datetime
from decimal import Decimal

from sqlalchemy import BigInteger, Boolean, DateTime, Enum, Integer, JSON, Numeric, String, Text, text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


bigint_pk = BigInteger().with_variant(Integer(), "sqlite")


class QuoteSchedulerRun(Base):
    __tablename__ = "quote_scheduler_runs"

    id: Mapped[int] = mapped_column(bigint_pk, primary_key=True, autoincrement=True)
    run_type: Mapped[str] = mapped_column(
        Enum("AUTO", "MANUAL", name="quote_scheduler_run_type"),
        nullable=False,
        index=True,
    )
    status: Mapped[str] = mapped_column(
        Enum(
            "STARTED",
            "COMPLETED",
            "COMPLETED_WITH_WARNINGS",
            "FAILED",
            "MISSED",
            "MAX_INSTANCES",
            name="quote_scheduler_run_status",
        ),
        nullable=False,
        index=True,
    )
    scheduled_run_at: Mapped[datetime | None] = mapped_column(DateTime(), nullable=True, index=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(), nullable=True, index=True)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(), nullable=True, index=True)
    duration_seconds: Mapped[Decimal | None] = mapped_column(Numeric(12, 3), nullable=True)
    updated_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    skipped_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    failed_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    errors_json: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    fx_updated: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("0"))
    fx_error: Mapped[str | None] = mapped_column(Text, nullable=True)
    snapshot_collected: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("0"))
    snapshot_error: Mapped[str | None] = mapped_column(Text, nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
