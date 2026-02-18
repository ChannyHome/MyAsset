from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, date, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.household import Household, HouseholdMember
from app.models.user import User
from app.models.valuation_snapshot import ValuationSnapshot
from app.services.analytics_summary import calculate_summary_values
from app.services.currency import MissingFxRateError


@dataclass
class SnapshotCollectResult:
    snapshot_date: date
    display_currency: str
    user_scopes_collected: int
    household_scopes_collected: int
    upserted_rows: int


def collect_valuation_snapshots_batch(
    db: Session,
    display_currency: str = "KRW",
    snapshot_date: date | None = None,
    include_users: bool = True,
    include_households: bool = True,
) -> SnapshotCollectResult:
    target_currency = (display_currency or "KRW").upper()
    target_date = snapshot_date or datetime.now(UTC).date()
    user_scopes_collected = 0
    household_scopes_collected = 0
    upserted_rows = 0

    def _upsert_snapshot(scope_type_value: str, scope_id_value: int, as_of: datetime, gross, debt, net) -> None:
        nonlocal upserted_rows
        row = db.scalar(
            select(ValuationSnapshot).where(
                ValuationSnapshot.scope_type == scope_type_value,
                ValuationSnapshot.scope_id == scope_id_value,
                ValuationSnapshot.display_currency == target_currency,
                ValuationSnapshot.snapshot_date == target_date,
            )
        )
        if row is None:
            row = ValuationSnapshot(
                scope_type=scope_type_value,
                scope_id=scope_id_value,
                display_currency=target_currency,
                snapshot_date=target_date,
                assets_total=gross,
                liabilities_total=debt,
                net_worth_total=net,
                as_of=as_of,
                source="SYSTEM_BATCH",
            )
            db.add(row)
        else:
            row.assets_total = gross
            row.liabilities_total = debt
            row.net_worth_total = net
            row.as_of = as_of
            row.source = "SYSTEM_BATCH"
        upserted_rows += 1

    if include_users:
        user_ids = db.scalars(
            select(User.id).where(
                User.is_active.is_(True),
                User.status == "ACTIVE",
            )
        ).all()
        for user_id in user_ids:
            try:
                values = calculate_summary_values(
                    db=db,
                    scope_user_ids=[int(user_id)],
                    include_hidden=False,
                    include_excluded_portfolios=False,
                    include_excluded_liabilities=False,
                    display_currency=target_currency,
                    fx_strict_mode=settings.fx_strict_mode,
                )
            except MissingFxRateError:
                continue
            _upsert_snapshot(
                scope_type_value="USER",
                scope_id_value=int(user_id),
                as_of=values.as_of,
                gross=values.gross_assets_total,
                debt=values.liabilities_total,
                net=values.net_assets_total,
            )
            user_scopes_collected += 1

    if include_households:
        household_ids = db.scalars(select(Household.id)).all()
        for household_id in household_ids:
            member_ids = list(
                db.scalars(select(HouseholdMember.user_id).where(HouseholdMember.household_id == household_id)).all()
            )
            if not member_ids:
                continue
            try:
                values = calculate_summary_values(
                    db=db,
                    scope_user_ids=[int(member_id) for member_id in member_ids],
                    include_hidden=False,
                    include_excluded_portfolios=False,
                    include_excluded_liabilities=False,
                    display_currency=target_currency,
                    fx_strict_mode=settings.fx_strict_mode,
                )
            except MissingFxRateError:
                continue
            _upsert_snapshot(
                scope_type_value="HOUSEHOLD",
                scope_id_value=int(household_id),
                as_of=values.as_of,
                gross=values.gross_assets_total,
                debt=values.liabilities_total,
                net=values.net_assets_total,
            )
            household_scopes_collected += 1

    db.commit()

    return SnapshotCollectResult(
        snapshot_date=target_date,
        display_currency=target_currency,
        user_scopes_collected=user_scopes_collected,
        household_scopes_collected=household_scopes_collected,
        upserted_rows=upserted_rows,
    )
