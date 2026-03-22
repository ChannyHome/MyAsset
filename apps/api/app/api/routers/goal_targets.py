from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.db import get_db
from app.models.goal_target import GoalTarget
from app.models.household import HouseholdMember
from app.models.user import User
from app.schemas.goals import GoalTargetOut, GoalTargetUpdateIn
from app.services.goal_progress import get_goal_target_row, serialize_goal_target

router = APIRouter(prefix="/users/me", tags=["goal-target"])


def _resolve_goal_scope(
    db: Session,
    *,
    current_user: User,
    scope_type: str,
    scope_id: int | None,
) -> tuple[str, int]:
    normalized_scope_type = (scope_type or "USER").upper().strip()
    if normalized_scope_type == "USER":
        target_scope_id = int(scope_id or current_user.id)
        if target_scope_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only your own USER scope is allowed")
        return "USER", target_scope_id

    if normalized_scope_type == "HOUSEHOLD":
        if scope_id is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="scope_id is required for HOUSEHOLD scope")
        is_member = db.scalar(
            select(HouseholdMember).where(
                HouseholdMember.household_id == scope_id,
                HouseholdMember.user_id == current_user.id,
            )
        )
        if is_member is None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not a member of this household")
        return "HOUSEHOLD", int(scope_id)

    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="scope_type must be USER or HOUSEHOLD")


@router.get("/goal-target", response_model=GoalTargetOut)
def get_my_goal_target(
    scope_type: str = "USER",
    scope_id: int | None = None,
    display_currency: str = "KRW",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> GoalTargetOut:
    resolved_scope_type, resolved_scope_id = _resolve_goal_scope(
        db,
        current_user=current_user,
        scope_type=scope_type,
        scope_id=scope_id,
    )
    row = get_goal_target_row(
        db,
        owner_user_id=current_user.id,
        scope_type=resolved_scope_type,
        scope_id=resolved_scope_id,
    )
    return serialize_goal_target(
        db,
        row=row,
        scope_type=resolved_scope_type,
        scope_id=resolved_scope_id,
        display_currency=display_currency,
    )


@router.put("/goal-target", response_model=GoalTargetOut)
def put_my_goal_target(
    payload: GoalTargetUpdateIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> GoalTargetOut:
    resolved_scope_type, resolved_scope_id = _resolve_goal_scope(
        db,
        current_user=current_user,
        scope_type=payload.scope_type,
        scope_id=payload.scope_id,
    )
    row = get_goal_target_row(
        db,
        owner_user_id=current_user.id,
        scope_type=resolved_scope_type,
        scope_id=resolved_scope_id,
    )
    if row is None:
        row = GoalTarget(
            owner_user_id=current_user.id,
            scope_type=resolved_scope_type,
            scope_id=resolved_scope_id,
        )
        db.add(row)

    row.amount_currency = payload.display_currency
    row.target_amount = payload.target_amount
    row.annual_return_rate_pct = payload.annual_return_rate_pct
    row.monthly_invest_amount = payload.monthly_invest_amount
    db.commit()
    db.refresh(row)
    return serialize_goal_target(
        db,
        row=row,
        scope_type=resolved_scope_type,
        scope_id=resolved_scope_id,
        display_currency=payload.display_currency,
    )
