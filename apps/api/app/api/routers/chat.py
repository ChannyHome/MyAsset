from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.db import get_db
from app.models.user import User
from app.schemas.chat import ChatMessageCreateIn, ChatMessageOut, ChatSessionCreateIn, ChatSessionOut, ChatSessionUpdateIn, ChatStatusOut
from app.services.chat_service import (
    ChatInputError,
    ChatPermissionError,
    ChatServiceError,
    ChatUnavailableError,
    create_chat_message,
    create_chat_session,
    get_chat_status,
    list_chat_messages,
    list_chat_sessions,
    update_chat_session,
)

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/status", response_model=ChatStatusOut)
def get_chat_status_view(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ChatStatusOut:
    return get_chat_status(db, current_user=current_user)


@router.get("/sessions", response_model=list[ChatSessionOut])
def get_chat_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ChatSessionOut]:
    return list_chat_sessions(db, current_user=current_user)


@router.post("/sessions", response_model=ChatSessionOut, status_code=status.HTTP_201_CREATED)
def post_chat_session(
    payload: ChatSessionCreateIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ChatSessionOut:
    return create_chat_session(db, current_user=current_user, payload=payload)


@router.patch("/sessions/{session_id}", response_model=ChatSessionOut)
def patch_chat_session(
    session_id: int,
    payload: ChatSessionUpdateIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ChatSessionOut:
    try:
        return update_chat_session(db, current_user=current_user, session_id=session_id, payload=payload)
    except ChatInputError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


@router.get("/sessions/{session_id}/messages", response_model=list[ChatMessageOut])
def get_chat_messages(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ChatMessageOut]:
    try:
        return list_chat_messages(db, current_user=current_user, session_id=session_id)
    except ChatInputError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


@router.post("/sessions/{session_id}/messages", response_model=list[ChatMessageOut], status_code=status.HTTP_201_CREATED)
def post_chat_message(
    session_id: int,
    payload: ChatMessageCreateIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ChatMessageOut]:
    try:
        return create_chat_message(db, current_user=current_user, session_id=session_id, payload=payload)
    except ChatPermissionError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc
    except ChatInputError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except ChatUnavailableError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
    except ChatServiceError as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc
