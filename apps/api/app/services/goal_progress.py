from __future__ import annotations

import calendar
import math
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from decimal import Decimal

from sqlalchemy import asc, desc, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.goal_target import GoalTarget
from app.models.valuation_snapshot import ValuationSnapshot
from app.schemas.analytics import AnalyticsGoalProgressOut
from app.schemas.goals import GoalTargetOut
from app.services.analytics_summary import calculate_summary_values
from app.services.currency import FxCache, convert_amount


@dataclass
class ProjectionResult:
    projected_reach_date: date | None
    projected_months_to_goal: int | None
    projection_3y: Decimal
    projection_5y: Decimal
    projection_10y: Decimal
    reached: bool
    remaining_amount: Decimal
    over_target_amount: Decimal
    progress_ratio_pct: Decimal


def _normalize_display_currency(display_currency: str | None) -> str:
    return "USD" if str(display_currency or "").upper() == "USD" else "KRW"


def _basis_total(gross_assets_total: Decimal, net_assets_total: Decimal, basis: str) -> Decimal:
    return net_assets_total if basis == "NET" else gross_assets_total


def _quantize_amount(value: Decimal | None) -> Decimal | None:
    if value is None:
        return None
    return Decimal(value).quantize(Decimal("0.01"))


def _quantize_pct(value: Decimal | None) -> Decimal | None:
    if value is None:
        return None
    return Decimal(value).quantize(Decimal("0.01"))


def _add_months(base: date, months: int) -> date:
    total_month = (base.month - 1) + months
    year = base.year + total_month // 12
    month = (total_month % 12) + 1
    day = min(base.day, calendar.monthrange(year, month)[1])
    return date(year, month, day)


def _convert_goal_amount(
    db: Session,
    *,
    amount: Decimal,
    from_currency: str,
    display_currency: str,
    cache: FxCache,
) -> Decimal:
    return convert_amount(
        db=db,
        amount=Decimal(amount),
        from_currency=from_currency,
        to_currency=display_currency,
        cache=cache,
        strict=settings.fx_strict_mode,
    )


def get_goal_target_row(
    db: Session,
    *,
    owner_user_id: int,
    scope_type: str,
    scope_id: int,
) -> GoalTarget | None:
    return db.scalar(
        select(GoalTarget).where(
            GoalTarget.owner_user_id == owner_user_id,
            GoalTarget.scope_type == scope_type,
            GoalTarget.scope_id == scope_id,
        )
    )


def serialize_goal_target(
    db: Session,
    *,
    row: GoalTarget | None,
    scope_type: str,
    scope_id: int,
    display_currency: str,
) -> GoalTargetOut:
    target_currency = _normalize_display_currency(display_currency)
    if row is None:
        return GoalTargetOut(
            configured=False,
            scope_type=scope_type,  # type: ignore[arg-type]
            scope_id=scope_id,
            display_currency=target_currency,  # type: ignore[arg-type]
            amount_currency=target_currency,  # type: ignore[arg-type]
            target_amount=None,
            annual_return_rate_pct=None,
            monthly_invest_amount=None,
            created_at=None,
            updated_at=None,
        )

    fx_cache: FxCache = {}
    target_amount = _convert_goal_amount(
        db,
        amount=Decimal(row.target_amount),
        from_currency=row.amount_currency,
        display_currency=target_currency,
        cache=fx_cache,
    )
    monthly_invest_amount = _convert_goal_amount(
        db,
        amount=Decimal(row.monthly_invest_amount),
        from_currency=row.amount_currency,
        display_currency=target_currency,
        cache=fx_cache,
    )
    return GoalTargetOut(
        configured=True,
        scope_type=row.scope_type,  # type: ignore[arg-type]
        scope_id=row.scope_id,
        display_currency=target_currency,  # type: ignore[arg-type]
        amount_currency=target_currency,  # type: ignore[arg-type]
        target_amount=_quantize_amount(target_amount),
        annual_return_rate_pct=_quantize_pct(Decimal(row.annual_return_rate_pct)),
        monthly_invest_amount=_quantize_amount(monthly_invest_amount),
        created_at=row.created_at,
        updated_at=row.updated_at,
    )


def _simulate_projection(
    *,
    current_amount: Decimal,
    target_amount: Decimal,
    annual_return_rate_pct: Decimal,
    monthly_invest_amount: Decimal,
    as_of: datetime,
) -> ProjectionResult:
    current_float = float(current_amount)
    target_float = float(target_amount)
    annual_rate_float = float(annual_return_rate_pct) / 100.0
    monthly_invest_float = float(monthly_invest_amount)
    monthly_rate = math.pow(1.0 + annual_rate_float, 1.0 / 12.0) - 1.0 if annual_rate_float > -1 else -1.0

    progress_ratio_pct = Decimal("100") if target_float <= 0 else Decimal(str((current_float / target_float) * 100))
    progress_ratio_pct = max(Decimal("0"), progress_ratio_pct)
    remaining_amount = max(Decimal("0"), target_amount - current_amount)
    over_target_amount = max(Decimal("0"), current_amount - target_amount)

    reached = current_float >= target_float and target_float > 0
    projected_reach_date: date | None = as_of.date() if reached else None
    projected_months_to_goal: int | None = 0 if reached else None

    balance = current_float
    projection_3y: Decimal | None = None
    projection_5y: Decimal | None = None
    projection_10y: Decimal | None = None

    for month in range(1, 601):
        balance = balance * (1.0 + monthly_rate)
        balance += monthly_invest_float

        if month == 36:
            projection_3y = Decimal(str(balance))
        if month == 60:
            projection_5y = Decimal(str(balance))
        if month == 120:
            projection_10y = Decimal(str(balance))

        if projected_reach_date is None and target_float > 0 and balance >= target_float:
            projected_reach_date = _add_months(as_of.date(), month)
            projected_months_to_goal = month

    return ProjectionResult(
        projected_reach_date=projected_reach_date,
        projected_months_to_goal=projected_months_to_goal,
        projection_3y=_quantize_amount(projection_3y or Decimal(str(balance))) or Decimal("0"),
        projection_5y=_quantize_amount(projection_5y or Decimal(str(balance))) or Decimal("0"),
        projection_10y=_quantize_amount(projection_10y or Decimal(str(balance))) or Decimal("0"),
        reached=reached,
        remaining_amount=_quantize_amount(remaining_amount) or Decimal("0"),
        over_target_amount=_quantize_amount(over_target_amount) or Decimal("0"),
        progress_ratio_pct=_quantize_pct(progress_ratio_pct) or Decimal("0"),
    )


def _find_snapshot_on_or_before(
    db: Session,
    *,
    scope_type: str,
    scope_id: int,
    display_currency: str,
    snapshot_date: date,
) -> ValuationSnapshot | None:
    row = db.scalar(
        select(ValuationSnapshot)
        .where(
            ValuationSnapshot.scope_type == scope_type,
            ValuationSnapshot.scope_id == scope_id,
            ValuationSnapshot.display_currency == display_currency,
            ValuationSnapshot.snapshot_date <= snapshot_date,
        )
        .order_by(desc(ValuationSnapshot.snapshot_date), desc(ValuationSnapshot.id))
        .limit(1)
    )
    if row is not None:
        return row
    fallback_currency = "USD" if display_currency == "KRW" else "KRW"
    return db.scalar(
        select(ValuationSnapshot)
        .where(
            ValuationSnapshot.scope_type == scope_type,
            ValuationSnapshot.scope_id == scope_id,
            ValuationSnapshot.display_currency == fallback_currency,
            ValuationSnapshot.snapshot_date <= snapshot_date,
        )
        .order_by(desc(ValuationSnapshot.snapshot_date), desc(ValuationSnapshot.id))
        .limit(1)
    )


def _find_earliest_snapshot(
    db: Session,
    *,
    scope_type: str,
    scope_id: int,
    display_currency: str,
) -> ValuationSnapshot | None:
    row = db.scalar(
        select(ValuationSnapshot)
        .where(
            ValuationSnapshot.scope_type == scope_type,
            ValuationSnapshot.scope_id == scope_id,
            ValuationSnapshot.display_currency == display_currency,
        )
        .order_by(asc(ValuationSnapshot.snapshot_date), asc(ValuationSnapshot.id))
        .limit(1)
    )
    if row is not None:
        return row
    fallback_currency = "USD" if display_currency == "KRW" else "KRW"
    return db.scalar(
        select(ValuationSnapshot)
        .where(
            ValuationSnapshot.scope_type == scope_type,
            ValuationSnapshot.scope_id == scope_id,
            ValuationSnapshot.display_currency == fallback_currency,
        )
        .order_by(asc(ValuationSnapshot.snapshot_date), asc(ValuationSnapshot.id))
        .limit(1)
    )


def _snapshot_basis_value(
    db: Session,
    *,
    snapshot: ValuationSnapshot,
    basis: str,
    display_currency: str,
    cache: FxCache,
) -> Decimal:
    raw = Decimal(snapshot.net_worth_total if basis == "NET" else snapshot.assets_total)
    if snapshot.display_currency == display_currency:
        return raw
    return convert_amount(
        db=db,
        amount=raw,
        from_currency=snapshot.display_currency,
        to_currency=display_currency,
        cache=cache,
        strict=settings.fx_strict_mode,
    )


def _recent_actual_growth(
    db: Session,
    *,
    scope_type: str,
    scope_id: int,
    display_currency: str,
    basis: str,
    as_of: datetime,
) -> tuple[Decimal | None, int | None]:
    fx_cache: FxCache = {}
    current_snapshot = _find_snapshot_on_or_before(
        db,
        scope_type=scope_type,
        scope_id=scope_id,
        display_currency=display_currency,
        snapshot_date=as_of.date(),
    )
    if current_snapshot is None:
        return None, None

    baseline_target_date = as_of.date() - timedelta(days=365)
    baseline_snapshot = _find_snapshot_on_or_before(
        db,
        scope_type=scope_type,
        scope_id=scope_id,
        display_currency=display_currency,
        snapshot_date=baseline_target_date,
    )
    if baseline_snapshot is None:
        baseline_snapshot = _find_earliest_snapshot(
            db,
            scope_type=scope_type,
            scope_id=scope_id,
            display_currency=display_currency,
        )
    if baseline_snapshot is None or baseline_snapshot.id == current_snapshot.id:
        return None, None

    lookback_days = (current_snapshot.snapshot_date - baseline_snapshot.snapshot_date).days
    if lookback_days < 90:
        return None, None

    current_value = _snapshot_basis_value(
        db,
        snapshot=current_snapshot,
        basis=basis,
        display_currency=display_currency,
        cache=fx_cache,
    )
    baseline_value = _snapshot_basis_value(
        db,
        snapshot=baseline_snapshot,
        basis=basis,
        display_currency=display_currency,
        cache=fx_cache,
    )
    if baseline_value <= 0 or current_value <= 0:
        return None, None

    growth_ratio = float(current_value / baseline_value)
    annualized = (math.pow(growth_ratio, 365.0 / lookback_days) - 1.0) * 100.0
    return _quantize_pct(Decimal(str(annualized))), lookback_days


def build_goal_progress(
    db: Session,
    *,
    owner_user_id: int,
    scope_type: str,
    scope_id: int,
    scope_user_ids: list[int],
    display_currency: str,
    basis: str,
) -> AnalyticsGoalProgressOut:
    target_currency = _normalize_display_currency(display_currency)
    summary = calculate_summary_values(
        db=db,
        scope_user_ids=scope_user_ids,
        include_hidden=False,
        include_excluded_portfolios=False,
        include_excluded_liabilities=False,
        display_currency=target_currency,
        fx_strict_mode=settings.fx_strict_mode,
    )
    current_amount = _basis_total(summary.gross_assets_total, summary.net_assets_total, basis)
    row = get_goal_target_row(
        db,
        owner_user_id=owner_user_id,
        scope_type=scope_type,
        scope_id=scope_id,
    )
    if row is None:
        return AnalyticsGoalProgressOut(
            configured=False,
            scope_type=scope_type,  # type: ignore[arg-type]
            scope_id=scope_id,
            basis=basis,  # type: ignore[arg-type]
            display_currency=target_currency,  # type: ignore[arg-type]
            current_amount=_quantize_amount(current_amount) or Decimal("0"),
            target_amount=None,
            progress_ratio_pct=None,
            remaining_amount=None,
            over_target_amount=None,
            reached=False,
            projected_reach_date=None,
            projected_months_to_goal=None,
            projection_3y=None,
            projection_5y=None,
            projection_10y=None,
            recent_actual_annualized_return_pct=None,
            recent_actual_window_days=None,
            comparison_tone="UNAVAILABLE",
            as_of=summary.as_of,
        )

    fx_cache: FxCache = {}
    target_amount = _convert_goal_amount(
        db,
        amount=Decimal(row.target_amount),
        from_currency=row.amount_currency,
        display_currency=target_currency,
        cache=fx_cache,
    )
    monthly_invest_amount = _convert_goal_amount(
        db,
        amount=Decimal(row.monthly_invest_amount),
        from_currency=row.amount_currency,
        display_currency=target_currency,
        cache=fx_cache,
    )
    projection = _simulate_projection(
        current_amount=current_amount,
        target_amount=target_amount,
        annual_return_rate_pct=Decimal(row.annual_return_rate_pct),
        monthly_invest_amount=monthly_invest_amount,
        as_of=summary.as_of,
    )
    recent_actual_return_pct, recent_actual_window_days = _recent_actual_growth(
        db,
        scope_type=scope_type,
        scope_id=scope_id,
        display_currency=target_currency,
        basis=basis,
        as_of=summary.as_of,
    )
    comparison_tone = "UNAVAILABLE"
    if recent_actual_return_pct is not None:
        assumed = Decimal(row.annual_return_rate_pct)
        if recent_actual_return_pct > assumed + Decimal("0.05"):
            comparison_tone = "AHEAD"
        elif recent_actual_return_pct < assumed - Decimal("0.05"):
            comparison_tone = "BEHIND"
        else:
            comparison_tone = "MATCHED"

    return AnalyticsGoalProgressOut(
        configured=True,
        scope_type=scope_type,  # type: ignore[arg-type]
        scope_id=scope_id,
        basis=basis,  # type: ignore[arg-type]
        display_currency=target_currency,  # type: ignore[arg-type]
        current_amount=_quantize_amount(current_amount) or Decimal("0"),
        target_amount=_quantize_amount(target_amount),
        progress_ratio_pct=projection.progress_ratio_pct,
        remaining_amount=projection.remaining_amount,
        over_target_amount=projection.over_target_amount,
        reached=projection.reached,
        projected_reach_date=projection.projected_reach_date,
        projected_months_to_goal=projection.projected_months_to_goal,
        projection_3y=projection.projection_3y,
        projection_5y=projection.projection_5y,
        projection_10y=projection.projection_10y,
        recent_actual_annualized_return_pct=recent_actual_return_pct,
        recent_actual_window_days=recent_actual_window_days,
        comparison_tone=comparison_tone,  # type: ignore[arg-type]
        as_of=summary.as_of,
    )
