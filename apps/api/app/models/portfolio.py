from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, String, text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Portfolio(Base):
    __tablename__ = "portfolios"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    owner_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    type: Mapped[str] = mapped_column(
        Enum("BROKER", "EXCHANGE", "BANK", "CASH", "ETC", name="portfolio_type"),
        nullable=False,
        server_default="ETC",
    )
    base_currency: Mapped[str] = mapped_column(String(3), nullable=False, server_default="KRW")
    is_included: Mapped[bool] = mapped_column(nullable=False, server_default=text("1"))
    is_hidden: Mapped[bool] = mapped_column(nullable=False, server_default=text("0"))
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP"),
    )
