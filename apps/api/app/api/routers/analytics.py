from collections import defaultdict
from datetime import UTC, date, datetime
from decimal import Decimal
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_min_role
from app.core.config import settings
from app.core.db import get_db
from app.models.asset import Asset
from app.models.household import HouseholdMember
from app.models.holding import Holding
from app.models.latest_quote import LatestQuote
from app.models.liability import Liability
from app.models.portfolio import Portfolio
from app.models.valuation_snapshot import ValuationSnapshot
from app.schemas.analytics import (
    AnalyticsAllocationItemOut,
    AnalyticsAllocationOut,
    AnalyticsNetworthSeriesOut,
    AnalyticsNetworthSeriesPointOut,
    AnalyticsSnapshotCollectOut,
    AnalyticsSummaryV2Out,
)
from app.services.currency import FxCache, MissingFxRateError, convert_amount
from app.services.analytics_summary import calculate_summary_values
from app.services.user_seed import SeedUser
from app.services.valuation_snapshots import collect_valuation_snapshots_batch

router = APIRouter(prefix="/analytics", tags=["analytics"])

AllocationTarget = Literal["GROSS", "LIABILITIES", "NET", "HOLDINGS"]
AllocationGroupBy = Literal["PORTFOLIO", "ASSET_CLASS", "ASSET", "LIABILITY_TYPE"]
SeriesBucket = Literal["DAY", "WEEK", "MONTH"]


def _resolve_scope_user_ids(
    db: Session,
    current_user: SeedUser,
    scope_type: str | None,
    scope_id: int | None,
) -> tuple[str, int, list[int]]:
    if scope_type is None:
        return "USER", current_user.id, [current_user.id]

    normalized_scope_type = scope_type.upper()
    if normalized_scope_type == "USER":
        target_user_id = scope_id or current_user.id
        if target_user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Only your own USER scope is allowed")
        return "USER", target_user_id, [target_user_id]

    if normalized_scope_type in {"HOUSEHOLD", "GROUP"}:
        if scope_id is None:
            raise HTTPException(status_code=400, detail="scope_id is required for HOUSEHOLD scope")

        is_member = db.scalar(
            select(HouseholdMember).where(
                HouseholdMember.household_id == scope_id,
                HouseholdMember.user_id == current_user.id,
            )
        )
        if is_member is None:
            raise HTTPException(status_code=403, detail="You are not a member of this household")

        member_rows = db.scalars(select(HouseholdMember.user_id).where(HouseholdMember.household_id == scope_id)).all()
        return "HOUSEHOLD", scope_id, list(member_rows)

    raise HTTPException(status_code=400, detail="scope_type must be USER or HOUSEHOLD")


def _build_holdings_stmt(
    scope_user_ids: list[int],
    include_hidden: bool,
    include_excluded_portfolios: bool,
):
    stmt = (
        select(Holding, Asset, Portfolio, LatestQuote)
        .join(Asset, Asset.id == Holding.asset_id)
        .outerjoin(Portfolio, Holding.portfolio_id == Portfolio.id)
        .outerjoin(LatestQuote, LatestQuote.asset_id == Holding.asset_id)
        .where(Holding.owner_user_id.in_(scope_user_ids))
    )
    if not include_hidden:
        stmt = stmt.where(Holding.is_hidden.is_(False))
        stmt = stmt.where(or_(Holding.portfolio_id.is_(None), Portfolio.is_hidden.is_(False)))
    if not include_excluded_portfolios:
        stmt = stmt.where(or_(Holding.portfolio_id.is_(None), Portfolio.is_included.is_(True)))
    return stmt


def _build_liabilities_stmt(
    scope_user_ids: list[int],
    include_hidden: bool,
    include_excluded_portfolios: bool,
    include_excluded_liabilities: bool,
):
    stmt = (
        select(Liability, Portfolio)
        .outerjoin(Portfolio, Liability.portfolio_id == Portfolio.id)
        .where(Liability.owner_user_id.in_(scope_user_ids))
    )
    if not include_hidden:
        stmt = stmt.where(Liability.is_hidden.is_(False))
        stmt = stmt.where(or_(Liability.portfolio_id.is_(None), Portfolio.is_hidden.is_(False)))
    if not include_excluded_portfolios:
        stmt = stmt.where(or_(Liability.portfolio_id.is_(None), Portfolio.is_included.is_(True)))
    if not include_excluded_liabilities:
        stmt = stmt.where(Liability.is_included.is_(True))
    return stmt


def _ratio_pct(numerator: Decimal, denominator: Decimal) -> Decimal:
    if denominator <= 0:
        return Decimal("0")
    return (numerator / denominator) * Decimal("100")


def _normalize_target(raw: str) -> AllocationTarget:
    value = (raw or "GROSS").upper().strip()
    if value not in {"GROSS", "LIABILITIES", "NET", "HOLDINGS"}:
        raise HTTPException(status_code=400, detail="target must be GROSS | LIABILITIES | NET | HOLDINGS")
    return value  # type: ignore[return-value]


def _normalize_group_by(raw: str | None, target: AllocationTarget) -> AllocationGroupBy:
    default_by_target: dict[AllocationTarget, AllocationGroupBy] = {
        "GROSS": "PORTFOLIO",
        "LIABILITIES": "LIABILITY_TYPE",
        "NET": "PORTFOLIO",
        "HOLDINGS": "ASSET",
    }
    value = (raw or default_by_target[target]).upper().strip()
    allowed: dict[AllocationTarget, set[str]] = {
        "GROSS": {"PORTFOLIO", "ASSET_CLASS", "ASSET"},
        "LIABILITIES": {"PORTFOLIO", "LIABILITY_TYPE"},
        "NET": {"PORTFOLIO"},
        "HOLDINGS": {"PORTFOLIO", "ASSET_CLASS", "ASSET"},
    }
    if value not in allowed[target]:
        allowed_text = " | ".join(sorted(allowed[target]))
        raise HTTPException(status_code=400, detail=f"group_by for {target} must be {allowed_text}")
    return value  # type: ignore[return-value]


def _top_n_items(
    items: list[tuple[str, str, Decimal]],
    top_n: int,
    others_label: str,
) -> list[tuple[str, str, Decimal]]:
    if len(items) <= top_n:
        return items
    pinned = items[:top_n]
    others_value = sum((item[2] for item in items[top_n:]), Decimal("0"))
    if others_value == 0:
        return pinned
    return [*pinned, ("others", others_label, others_value)]


@router.get("/summary", response_model=AnalyticsSummaryV2Out)
def get_summary(
    scope_type: str | None = None,
    scope_id: int | None = None,
    include_hidden: bool = False,
    include_excluded_portfolios: bool = False,
    include_excluded_liabilities: bool = False,
    display_currency: str = "KRW",
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> AnalyticsSummaryV2Out:
    normalized_scope_type, normalized_scope_id, scope_user_ids = _resolve_scope_user_ids(
        db=db,
        current_user=current_user,
        scope_type=scope_type,
        scope_id=scope_id,
    )

    try:
        values = calculate_summary_values(
            db=db,
            scope_user_ids=scope_user_ids,
            include_hidden=include_hidden,
            include_excluded_portfolios=include_excluded_portfolios,
            include_excluded_liabilities=include_excluded_liabilities,
            display_currency=display_currency,
            fx_strict_mode=settings.fx_strict_mode,
        )
    except MissingFxRateError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Missing FX rate for {exc.from_currency}->{exc.to_currency}. Please refresh FX quotes.",
        ) from exc

    return AnalyticsSummaryV2Out(
        scope_type=normalized_scope_type,
        scope_id=normalized_scope_id,
        user_count=len(scope_user_ids),
        display_currency=(display_currency or "KRW").upper(),
        gross_assets_total=values.gross_assets_total,
        liabilities_total=values.liabilities_total,
        net_assets_total=values.net_assets_total,
        principal_minus_debt_total=values.principal_minus_debt_total,
        debt_adjusted_principal_total=values.principal_minus_debt_total,
        net_assets_profit_total=values.net_assets_profit_total,
        net_assets_return_pct=values.net_assets_return_pct,
        invested_principal_total=values.invested_principal_total,
        withdrawn_total=values.withdrawn_total,
        net_contribution_total=values.net_contribution_total,
        principal_profit_total=values.principal_profit_total,
        principal_return_pct=values.principal_return_pct,
        as_of=values.as_of,
    )


@router.get("/allocation", response_model=AnalyticsAllocationOut)
def get_allocation(
    scope_type: str | None = None,
    scope_id: int | None = None,
    target: str = Query(default="GROSS"),
    group_by: str | None = Query(default=None),
    top_n: int = Query(default=8, ge=1, le=50),
    others_label: str = Query(default="Others", min_length=1, max_length=50),
    portfolio_id: int | None = Query(default=None, ge=1),
    include_hidden: bool = False,
    include_excluded_portfolios: bool = False,
    include_excluded_liabilities: bool = False,
    display_currency: str = "KRW",
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> AnalyticsAllocationOut:
    normalized_scope_type, normalized_scope_id, scope_user_ids = _resolve_scope_user_ids(
        db=db,
        current_user=current_user,
        scope_type=scope_type,
        scope_id=scope_id,
    )
    normalized_target = _normalize_target(target)
    normalized_group_by = _normalize_group_by(group_by, normalized_target)
    target_currency = (display_currency or "KRW").upper()
    fx_cache: FxCache = {}

    bucket_totals: dict[tuple[str, str], Decimal] = defaultdict(lambda: Decimal("0"))
    as_of = None

    try:
        if normalized_target in {"GROSS", "HOLDINGS"}:
            stmt = _build_holdings_stmt(
                scope_user_ids=scope_user_ids,
                include_hidden=include_hidden,
                include_excluded_portfolios=include_excluded_portfolios,
            )
            if normalized_target == "HOLDINGS" and portfolio_id is not None:
                stmt = stmt.where(Holding.portfolio_id == portfolio_id)

            for holding, asset, portfolio, quote in db.execute(stmt).all():
                unit_price = quote.price if quote is not None else holding.avg_price
                price_currency = (
                    quote.currency
                    if quote is not None and quote.currency
                    else holding.avg_price_currency
                )
                value = convert_amount(
                    db=db,
                    amount=holding.quantity * unit_price,
                    from_currency=price_currency,
                    to_currency=target_currency,
                    cache=fx_cache,
                    strict=settings.fx_strict_mode,
                )
                if quote is not None and (as_of is None or quote.as_of > as_of):
                    as_of = quote.as_of

                if normalized_group_by == "PORTFOLIO":
                    if portfolio is None:
                        key = ("portfolio:none", "Unassigned")
                    else:
                        key = (f"portfolio:{portfolio.id}", portfolio.name)
                elif normalized_group_by == "ASSET_CLASS":
                    key = (f"asset_class:{asset.asset_class}", asset.asset_class)
                else:
                    symbol = asset.symbol or "-"
                    key = (f"asset:{asset.id}", f"{asset.name} ({symbol})")
                bucket_totals[key] += value

        elif normalized_target == "LIABILITIES":
            stmt = _build_liabilities_stmt(
                scope_user_ids=scope_user_ids,
                include_hidden=include_hidden,
                include_excluded_portfolios=include_excluded_portfolios,
                include_excluded_liabilities=include_excluded_liabilities,
            )
            for liability, portfolio in db.execute(stmt).all():
                value = convert_amount(
                    db=db,
                    amount=liability.outstanding_balance,
                    from_currency=liability.currency,
                    to_currency=target_currency,
                    cache=fx_cache,
                    strict=settings.fx_strict_mode,
                )
                if normalized_group_by == "PORTFOLIO":
                    if portfolio is None:
                        key = ("portfolio:none", "Unassigned")
                    else:
                        key = (f"portfolio:{portfolio.id}", portfolio.name)
                else:
                    key = (f"liability_type:{liability.liability_type}", liability.liability_type)
                bucket_totals[key] += value

        else:  # NET
            gross_by_portfolio: dict[tuple[str, str], Decimal] = defaultdict(lambda: Decimal("0"))
            liabilities_by_portfolio: dict[tuple[str, str], Decimal] = defaultdict(lambda: Decimal("0"))

            holdings_stmt = _build_holdings_stmt(
                scope_user_ids=scope_user_ids,
                include_hidden=include_hidden,
                include_excluded_portfolios=include_excluded_portfolios,
            )
            for holding, _asset, portfolio, quote in db.execute(holdings_stmt).all():
                unit_price = quote.price if quote is not None else holding.avg_price
                price_currency = quote.currency if quote is not None and quote.currency else holding.avg_price_currency
                value = convert_amount(
                    db=db,
                    amount=holding.quantity * unit_price,
                    from_currency=price_currency,
                    to_currency=target_currency,
                    cache=fx_cache,
                    strict=settings.fx_strict_mode,
                )
                if quote is not None and (as_of is None or quote.as_of > as_of):
                    as_of = quote.as_of
                if portfolio is None:
                    key = ("portfolio:none", "Unassigned")
                else:
                    key = (f"portfolio:{portfolio.id}", portfolio.name)
                gross_by_portfolio[key] += value

            liabilities_stmt = _build_liabilities_stmt(
                scope_user_ids=scope_user_ids,
                include_hidden=include_hidden,
                include_excluded_portfolios=include_excluded_portfolios,
                include_excluded_liabilities=include_excluded_liabilities,
            )
            for liability, portfolio in db.execute(liabilities_stmt).all():
                value = convert_amount(
                    db=db,
                    amount=liability.outstanding_balance,
                    from_currency=liability.currency,
                    to_currency=target_currency,
                    cache=fx_cache,
                    strict=settings.fx_strict_mode,
                )
                if portfolio is None:
                    key = ("portfolio:none", "Unassigned")
                else:
                    key = (f"portfolio:{portfolio.id}", portfolio.name)
                liabilities_by_portfolio[key] += value

            all_keys = set(gross_by_portfolio.keys()) | set(liabilities_by_portfolio.keys())
            for key in all_keys:
                bucket_totals[key] += gross_by_portfolio.get(key, Decimal("0")) - liabilities_by_portfolio.get(
                    key, Decimal("0")
                )
    except MissingFxRateError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Missing FX rate for {exc.from_currency}->{exc.to_currency}. Please refresh FX quotes.",
        ) from exc

    raw_items = [(key, label, value) for (key, label), value in bucket_totals.items()]
    raw_items.sort(key=lambda item: item[2], reverse=True)
    raw_items = _top_n_items(raw_items, top_n=top_n, others_label=others_label)

    total = sum(bucket_totals.values(), Decimal("0"))

    ratio_denominator = total
    ratio_numerator_transform = lambda value: value  # noqa: E731
    if normalized_target == "NET":
        positive_total = sum((value for value in bucket_totals.values() if value > 0), Decimal("0"))
        if positive_total > 0:
            ratio_denominator = positive_total
            ratio_numerator_transform = lambda value: value if value > 0 else Decimal("0")  # noqa: E731
        else:
            ratio_denominator = sum((abs(value) for value in bucket_totals.values()), Decimal("0"))
            ratio_numerator_transform = abs

    items = [
        AnalyticsAllocationItemOut(
            key=key,
            label=label,
            value=value,
            ratio_pct=_ratio_pct(ratio_numerator_transform(value), ratio_denominator),
        )
        for key, label, value in raw_items
    ]

    return AnalyticsAllocationOut(
        target=normalized_target,
        group_by=normalized_group_by,
        scope_type=normalized_scope_type,
        scope_id=normalized_scope_id,
        display_currency=target_currency,
        total=total,
        items=items,
        as_of=as_of or datetime.now(UTC).replace(tzinfo=None),
    )


@router.get("/networth-series", response_model=AnalyticsNetworthSeriesOut)
def get_networth_series(
    scope_type: str | None = None,
    scope_id: int | None = None,
    display_currency: str = "KRW",
    bucket: SeriesBucket = Query(default="DAY"),
    limit: int = Query(default=90, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: SeedUser = Depends(get_current_user),
) -> AnalyticsNetworthSeriesOut:
    normalized_scope_type, normalized_scope_id, scope_user_ids = _resolve_scope_user_ids(
        db=db,
        current_user=current_user,
        scope_type=scope_type,
        scope_id=scope_id,
    )
    target_currency = (display_currency or "KRW").upper()
    normalized_bucket = (bucket or "DAY").upper()

    stmt = (
        select(ValuationSnapshot)
        .where(
            ValuationSnapshot.scope_type == normalized_scope_type,
            ValuationSnapshot.scope_id == normalized_scope_id,
            ValuationSnapshot.display_currency == target_currency,
        )
        .order_by(ValuationSnapshot.snapshot_date.desc(), ValuationSnapshot.id.desc())
        .limit(max(limit * 4, limit))
    )
    snapshots = list(reversed(list(db.scalars(stmt).all())))

    if snapshots:
        if normalized_bucket == "DAY":
            selected = snapshots[-limit:]
            labels = [row.snapshot_date.isoformat() for row in selected]
        else:
            bucket_map: dict[str, ValuationSnapshot] = {}
            for row in snapshots:
                if normalized_bucket == "WEEK":
                    iso_year, iso_week, _ = row.snapshot_date.isocalendar()
                    key = f"{iso_year}-W{iso_week:02d}"
                else:
                    key = f"{row.snapshot_date.year}-{row.snapshot_date.month:02d}"
                bucket_map[key] = row
            labels = list(bucket_map.keys())[-limit:]
            selected = [bucket_map[key] for key in labels]

        points = [
            AnalyticsNetworthSeriesPointOut(
                snapshot_date=labels[idx],
                gross_assets_total=row.assets_total,
                liabilities_total=row.liabilities_total,
                net_assets_total=row.net_worth_total,
                as_of=row.as_of,
                source=row.source,
            )
            for idx, row in enumerate(selected)
        ]
    else:
        try:
            values = calculate_summary_values(
                db=db,
                scope_user_ids=scope_user_ids,
                include_hidden=False,
                include_excluded_portfolios=False,
                include_excluded_liabilities=False,
                display_currency=target_currency,
                fx_strict_mode=settings.fx_strict_mode,
            )
        except MissingFxRateError as exc:
            raise HTTPException(
                status_code=503,
                detail=f"Missing FX rate for {exc.from_currency}->{exc.to_currency}. Please refresh FX quotes.",
            ) from exc

        points = [
            AnalyticsNetworthSeriesPointOut(
                snapshot_date=date.today().isoformat(),
                gross_assets_total=values.gross_assets_total,
                liabilities_total=values.liabilities_total,
                net_assets_total=values.net_assets_total,
                as_of=values.as_of,
                source="LIVE",
            )
        ]

    return AnalyticsNetworthSeriesOut(
        scope_type=normalized_scope_type,
        scope_id=normalized_scope_id,
        display_currency=target_currency,
        points=points,
    )


@router.post("/snapshots/collect", response_model=AnalyticsSnapshotCollectOut, status_code=status.HTTP_201_CREATED)
def collect_valuation_snapshots(
    display_currency: str = "KRW",
    snapshot_date: date | None = None,
    include_users: bool = True,
    include_households: bool = True,
    db: Session = Depends(get_db),
    _current_user: SeedUser = Depends(require_min_role("MAINTAINER")),
) -> AnalyticsSnapshotCollectOut:
    result = collect_valuation_snapshots_batch(
        db=db,
        display_currency=display_currency,
        snapshot_date=snapshot_date,
        include_users=include_users,
        include_households=include_households,
    )

    return AnalyticsSnapshotCollectOut(
        snapshot_date=result.snapshot_date.isoformat(),
        display_currency=result.display_currency,
        user_scopes_collected=result.user_scopes_collected,
        household_scopes_collected=result.household_scopes_collected,
        upserted_rows=result.upserted_rows,
    )
