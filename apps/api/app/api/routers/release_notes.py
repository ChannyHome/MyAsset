from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user_any, require_min_role
from app.core.db import get_db
from app.models.release_note import ReleaseNote
from app.models.user import User
from app.schemas.release_note import ReleaseNoteCreate, ReleaseNoteOut, ReleaseNoteUpdate

router = APIRouter(prefix="/release-notes", tags=["release-notes"])


def _normalize_title(value: str) -> str:
    normalized = value.strip()
    if not normalized:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="title is required")
    return normalized


def _normalize_summary(value: str) -> str:
    normalized = value.strip()
    if not normalized:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="summary is required")
    return normalized


@router.get("", response_model=list[ReleaseNoteOut])
def list_release_notes(
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    include_unpublished: bool = Query(default=False),
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user_any),
) -> list[ReleaseNote]:
    stmt = select(ReleaseNote)
    if not include_unpublished:
        stmt = stmt.where(ReleaseNote.is_published.is_(True))
    stmt = stmt.order_by(ReleaseNote.released_at.desc(), ReleaseNote.id.desc()).offset(offset).limit(limit)
    return list(db.scalars(stmt).all())


@router.post("", response_model=ReleaseNoteOut, status_code=status.HTTP_201_CREATED)
def create_release_note(
    payload: ReleaseNoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_min_role("MAINTAINER")),
) -> ReleaseNote:
    row = ReleaseNote(
        released_at=payload.released_at,
        title=_normalize_title(payload.title),
        summary=_normalize_summary(payload.summary),
        is_published=payload.is_published,
        created_by_user_id=current_user.id,
        updated_by_user_id=current_user.id,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.patch("/{release_note_id}", response_model=ReleaseNoteOut)
def update_release_note(
    release_note_id: int,
    payload: ReleaseNoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_min_role("MAINTAINER")),
) -> ReleaseNote:
    row = db.scalar(select(ReleaseNote).where(ReleaseNote.id == release_note_id))
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Release note not found")

    if payload.released_at is not None:
        row.released_at = payload.released_at
    if payload.title is not None:
        row.title = _normalize_title(payload.title)
    if payload.summary is not None:
        row.summary = _normalize_summary(payload.summary)
    if payload.is_published is not None:
        row.is_published = payload.is_published

    row.updated_by_user_id = current_user.id
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{release_note_id}", response_model=ReleaseNoteOut)
def delete_release_note(
    release_note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_min_role("MAINTAINER")),
) -> ReleaseNote:
    row = db.scalar(select(ReleaseNote).where(ReleaseNote.id == release_note_id))
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Release note not found")

    row.is_published = False
    row.updated_by_user_id = current_user.id
    db.commit()
    db.refresh(row)
    return row
