from datetime import datetime

from sqlalchemy import BigInteger, DateTime, Enum, ForeignKey, Integer, JSON, Text, text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    session_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("chat_sessions.id"), nullable=False, index=True)
    role: Mapped[str] = mapped_column(
        Enum("USER", "ASSISTANT", "SYSTEM", name="chat_message_role"),
        nullable=False,
        index=True,
    )
    content_text: Mapped[str] = mapped_column(Text(), nullable=False)
    source_cards_json: Mapped[list[dict] | None] = mapped_column(JSON(), nullable=True)
    tool_calls_json: Mapped[list[dict] | None] = mapped_column(JSON(), nullable=True)
    usage_json: Mapped[dict | None] = mapped_column(JSON(), nullable=True)
    latency_ms: Mapped[int | None] = mapped_column(Integer(), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
