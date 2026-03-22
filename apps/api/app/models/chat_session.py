from datetime import datetime

from sqlalchemy import BigInteger, DateTime, Enum, ForeignKey, String, Text, text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    owner_user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    household_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("households.id"), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False, server_default="New chat")
    status: Mapped[str] = mapped_column(
        Enum("ACTIVE", "ARCHIVED", name="chat_session_status"),
        nullable=False,
        server_default="ACTIVE",
        index=True,
    )
    model_name: Mapped[str] = mapped_column(String(100), nullable=False, server_default="gpt-5.4-mini")
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP"),
    )
    last_message_at: Mapped[datetime | None] = mapped_column(DateTime(), nullable=True, index=True)
