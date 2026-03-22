from datetime import datetime
from decimal import Decimal

from sqlalchemy import BigInteger, DateTime, Enum, ForeignKey, Integer, Numeric, String, UniqueConstraint, text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


bigint_pk = BigInteger().with_variant(Integer(), "sqlite")


class GoalTarget(Base):
    __tablename__ = "goal_targets"
    __table_args__ = (
        UniqueConstraint("owner_user_id", "scope_type", "scope_id", name="uq_goal_target_owner_scope"),
    )

    id: Mapped[int] = mapped_column(bigint_pk, primary_key=True, autoincrement=True)
    owner_user_id: Mapped[int] = mapped_column(bigint_pk, ForeignKey("users.id"), nullable=False, index=True)
    scope_type: Mapped[str] = mapped_column(
        Enum("USER", "HOUSEHOLD", name="goal_target_scope_type"),
        nullable=False,
        index=True,
    )
    scope_id: Mapped[int] = mapped_column(bigint_pk, nullable=False, index=True)
    amount_currency: Mapped[str] = mapped_column(String(3), nullable=False, server_default="KRW")
    target_amount: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    annual_return_rate_pct: Mapped[Decimal] = mapped_column(Numeric(9, 4), nullable=False, server_default=text("0"))
    monthly_invest_amount: Mapped[Decimal] = mapped_column(Numeric(24, 8), nullable=False, server_default=text("0"))
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP"),
    )
