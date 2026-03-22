from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import require_min_role
from app.core.db import get_db
from app.models.user import User
from app.schemas.chat import OpenAIAdminConfigOut, OpenAIAdminConfigUpdateIn, OpenAIAdminTestOut
from app.services.openai_client import build_openai_admin_config, test_openai_connection, update_openai_admin_config

router = APIRouter(prefix="/admin/llm/openai", tags=["admin-openai"])


@router.get("/config", response_model=OpenAIAdminConfigOut)
def get_openai_config(
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_min_role("ADMIN")),
) -> OpenAIAdminConfigOut:
    return build_openai_admin_config(db)


@router.put("/config", response_model=OpenAIAdminConfigOut)
def put_openai_config(
    payload: OpenAIAdminConfigUpdateIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_min_role("ADMIN")),
) -> OpenAIAdminConfigOut:
    try:
        return update_openai_admin_config(
            db,
            current_user=current_user,
            enabled=payload.enabled,
            api_key=payload.api_key,
            disable_api_key=payload.disable_api_key,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.post("/test", response_model=OpenAIAdminTestOut)
def post_openai_test(
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_min_role("ADMIN")),
) -> OpenAIAdminTestOut:
    return test_openai_connection(db)
