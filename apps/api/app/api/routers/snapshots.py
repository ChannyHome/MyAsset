from __future__ import annotations

import csv
from collections import defaultdict
from datetime import UTC, datetime
from decimal import Decimal
from io import StringIO

from fastapi import APIRouter, Depends, File, HTTPException, Query, Response, UploadFile, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.db import get_db
from app.models.snapshot import (
    SnapshotHoldingRow,
    SnapshotLiabilityRow,
    SnapshotPortfolioRow,
    SnapshotSet,
)
from app.models.user import User
from app.schemas.asset import SortOrder
from app.schemas.snapshot import (
    SnapshotAllocationItemOut,
    SnapshotAllocationOut,
    SnapshotCaptureIn,
    SnapshotCsvPreviewOut,
    SnapshotDeleteIn,
    SnapshotDeleteOut,
    SnapshotHoldingRowOut,
    SnapshotHoldingSortBy,
    SnapshotHoldingTablePageOut,
    SnapshotLiabilityRowOut,
    SnapshotLiabilitySortBy,
    SnapshotLiabilityTablePageOut,
    SnapshotListItemOut,
    SnapshotListPageOut,
    SnapshotListSortBy,
    SnapshotPortfolioRowOut,
    SnapshotPortfolioSortBy,
    SnapshotPortfolioTablePageOut,
    SnapshotSeriesLineOut,
    SnapshotSeriesLinePointOut,
    SnapshotSeriesMode,
    SnapshotSeriesOut,
    SnapshotSeriesPointOut,
    SnapshotSourceType,
    SnapshotSummaryOut,
)
from app.services.currency import MissingFxRateError
from app.services.snapshots import (
    build_snapshot_csv_text,
    capture_user_snapshot,
    filter_snapshot_ids_for_user,
    normalize_decimal,
    normalize_display_currency,
    parse_id_csv,
    snapshot_summary_dict,
    to_snapshot_holding_row_dict,
    to_snapshot_liability_row_dict,
    to_snapshot_portfolio_row_dict,
)

router = APIRouter(prefix="/snapshots", tags=["snapshots"])


def _get_user_snapshot(db: Session, owner_user_id: int, snapshot_id: int) -> SnapshotSet:
    row = db.scalar(
        select(SnapshotSet).where(SnapshotSet.id == snapshot_id, SnapshotSet.owner_user_id == owner_user_id)
    )
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Snapshot not found")
    return row


def _resolve_snapshot_display_currency(value: str | None, fallback: str) -> str:
    requested = normalize_display_currency(value)
    if requested in {"KRW", "USD"}:
        return requested
    return normalize_display_currency(fallback)


def _summary_model(snapshot: SnapshotSet, warning_count: int = 0) -> SnapshotSummaryOut:
    return SnapshotSummaryOut(**snapshot_summary_dict(snapshot), warning_count=warning_count)


def _pick_snapshot_sort_column(sort_by: SnapshotListSortBy, display_currency: str):
    if sort_by == SnapshotListSortBy.GROSS:
        return SnapshotSet.gross_assets_usd if display_currency == "USD" else SnapshotSet.gross_assets_krw
    if sort_by == SnapshotListSortBy.NET:
        return SnapshotSet.net_assets_usd if display_currency == "USD" else SnapshotSet.net_assets_krw
    if sort_by == SnapshotListSortBy.LIABILITIES:
        return SnapshotSet.liabilities_usd if display_currency == "USD" else SnapshotSet.liabilities_krw
    return SnapshotSet.captured_at


def _to_sort_decimal(value: object | None) -> Decimal:
    if value is None:
        return Decimal("0")
    if isinstance(value, Decimal):
        return value
    try:
        return Decimal(str(value))
    except Exception:
        return Decimal("0")


def _to_sort_text(value: object | None) -> str:
    return str(value or "").lower()


@router.post("/capture", response_model=SnapshotSummaryOut, status_code=status.HTTP_201_CREATED)
def capture_snapshot(
    payload: SnapshotCaptureIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SnapshotSummaryOut:
    try:
        snapshot = capture_user_snapshot(
            db=db,
            owner_user_id=current_user.id,
            name=payload.name,
            note=payload.note,
            source_type="MANUAL",
        )
        db.commit()
    except MissingFxRateError as exc:
        db.rollback()
        raise HTTPException(
            status_code=503,
            detail=f"Missing FX rate for {exc.from_currency}->{exc.to_currency}. Please refresh FX quotes.",
        ) from exc
    except Exception as exc:  # pragma: no cover - defensive fallback
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to capture snapshot") from exc

    db.refresh(snapshot)
    return _summary_model(snapshot)


@router.get("", response_model=SnapshotListPageOut)
def list_snapshots(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=200),
    q: str | None = Query(default=None, min_length=1, max_length=100),
    from_at: datetime | None = Query(default=None, alias="from"),
    to_at: datetime | None = Query(default=None, alias="to"),
    sort_by: SnapshotListSortBy = Query(default=SnapshotListSortBy.CAPTURED_AT),
    sort_order: SortOrder = Query(default=SortOrder.DESC),
    display_currency: str = Query(default="KRW"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SnapshotListPageOut:
    target_currency = normalize_display_currency(display_currency)
    query_text = q.strip() if q else None

    filters = [SnapshotSet.owner_user_id == current_user.id]
    if from_at is not None:
        filters.append(SnapshotSet.captured_at >= from_at)
    if to_at is not None:
        filters.append(SnapshotSet.captured_at <= to_at)
    if query_text:
        like = f"%{query_text}%"
        filters.append(
            or_(
                SnapshotSet.name.ilike(like),
                SnapshotSet.note.ilike(like),
                SnapshotSet.source_type.ilike(like),
            )
        )

    total = int(db.scalar(select(func.count()).select_from(SnapshotSet).where(*filters)) or 0)

    sort_column = _pick_snapshot_sort_column(sort_by, target_currency)
    order_expr = sort_column.asc() if sort_order == SortOrder.ASC else sort_column.desc()
    rows = list(
        db.scalars(
            select(SnapshotSet)
            .where(*filters)
            .order_by(order_expr, SnapshotSet.id.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        ).all()
    )

    return SnapshotListPageOut(
        items=[SnapshotListItemOut(**snapshot_summary_dict(row)) for row in rows],
        total=total,
        page=page,
        page_size=page_size,
        q=query_text,
        sort_by=sort_by,
        sort_order=sort_order,
    )


@router.post("/delete", response_model=SnapshotDeleteOut)
def delete_snapshots(
    payload: SnapshotDeleteIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SnapshotDeleteOut:
    requested_ids = [int(i) for i in payload.ids if int(i) > 0]
    if not requested_ids:
        raise HTTPException(status_code=400, detail="ids is required")
    if len(requested_ids) > 500:
        raise HTTPException(status_code=400, detail="Too many snapshot ids in one request (max 500)")

    allowed_ids = filter_snapshot_ids_for_user(db, current_user.id, requested_ids)
    if not allowed_ids:
        return SnapshotDeleteOut(requested=len(requested_ids), deleted=0, deleted_ids=[])

    db.query(SnapshotHoldingRow).filter(SnapshotHoldingRow.snapshot_id.in_(allowed_ids)).delete(
        synchronize_session=False
    )
    db.query(SnapshotLiabilityRow).filter(SnapshotLiabilityRow.snapshot_id.in_(allowed_ids)).delete(
        synchronize_session=False
    )
    db.query(SnapshotPortfolioRow).filter(SnapshotPortfolioRow.snapshot_id.in_(allowed_ids)).delete(
        synchronize_session=False
    )
    deleted = (
        db.query(SnapshotSet)
        .filter(SnapshotSet.owner_user_id == current_user.id, SnapshotSet.id.in_(allowed_ids))
        .delete(synchronize_session=False)
    )
    db.commit()

    return SnapshotDeleteOut(
        requested=len(requested_ids),
        deleted=int(deleted),
        deleted_ids=allowed_ids,
    )


@router.get("/{snapshot_id}/summary", response_model=SnapshotSummaryOut)
def get_snapshot_summary(
    snapshot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SnapshotSummaryOut:
    snapshot = _get_user_snapshot(db, current_user.id, snapshot_id)
    return _summary_model(snapshot)


@router.get("/{snapshot_id}/allocation", response_model=SnapshotAllocationOut)
def get_snapshot_allocation(
    snapshot_id: int,
    target: str = Query(default="GROSS"),
    group_by: str | None = Query(default=None),
    portfolio_id: int | None = Query(default=None, ge=1),
    top_n: int = Query(default=8, ge=1, le=50),
    others_label: str = Query(default="Others", min_length=1, max_length=50),
    display_currency: str = Query(default="KRW"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SnapshotAllocationOut:
    snapshot = _get_user_snapshot(db, current_user.id, snapshot_id)
    target_currency = _resolve_snapshot_display_currency(display_currency, snapshot.display_currency_at_capture)
    normalized_target = (target or "GROSS").upper().strip()
    if normalized_target not in {"GROSS", "LIABILITIES", "NET", "HOLDINGS"}:
        raise HTTPException(status_code=400, detail="target must be GROSS | LIABILITIES | NET | HOLDINGS")

    defaults = {
        "GROSS": "PORTFOLIO",
        "LIABILITIES": "LIABILITY_TYPE",
        "NET": "PORTFOLIO",
        "HOLDINGS": "ASSET",
    }
    allowed = {
        "GROSS": {"PORTFOLIO", "ASSET_CLASS", "ASSET"},
        "LIABILITIES": {"PORTFOLIO", "LIABILITY_TYPE"},
        "NET": {"PORTFOLIO"},
        "HOLDINGS": {"PORTFOLIO", "ASSET_CLASS", "ASSET"},
    }
    normalized_group_by = (group_by or defaults[normalized_target]).upper().strip()
    if normalized_group_by not in allowed[normalized_target]:
        allowed_text = " | ".join(sorted(allowed[normalized_target]))
        raise HTTPException(status_code=400, detail=f"group_by for {normalized_target} must be {allowed_text}")

    def _new_bucket() -> dict[str, Decimal]:
        return {
            "value": Decimal("0"),
            "profit": Decimal("0"),
            "cost_basis": Decimal("0"),
            "fallback_sum": Decimal("0"),
            "fallback_count": Decimal("0"),
        }

    buckets: dict[tuple[str, str], dict[str, Decimal]] = defaultdict(_new_bucket)

    if normalized_target in {"GROSS", "HOLDINGS"}:
        stmt = select(SnapshotHoldingRow).where(SnapshotHoldingRow.snapshot_id == snapshot.id)
        if normalized_target == "HOLDINGS" and portfolio_id is not None:
            stmt = stmt.where(SnapshotHoldingRow.portfolio_id == portfolio_id)
        rows = db.scalars(stmt).all()
        for row in rows:
            value = row.evaluated_usd if target_currency == "USD" else row.evaluated_krw
            profit = row.profit_usd if target_currency == "USD" else row.profit_krw
            cost_basis = row.cost_basis_usd if target_currency == "USD" else row.cost_basis_krw
            if normalized_group_by == "PORTFOLIO":
                key = (f"portfolio:{row.portfolio_id or 'none'}", row.portfolio_name)
            elif normalized_group_by == "ASSET_CLASS":
                key = (f"asset_class:{row.asset_class}", row.asset_class)
            else:
                key = (f"asset:{row.asset_id or row.id}", f"{row.asset_name} ({row.symbol or '-'})")
            bucket = buckets[key]
            bucket["value"] += Decimal(value)
            bucket["profit"] += Decimal(profit)
            bucket["cost_basis"] += Decimal(cost_basis)
            if row.return_pct is not None:
                bucket["fallback_sum"] += Decimal(row.return_pct)
                bucket["fallback_count"] += Decimal("1")
    elif normalized_target == "LIABILITIES":
        rows = db.scalars(select(SnapshotLiabilityRow).where(SnapshotLiabilityRow.snapshot_id == snapshot.id)).all()
        for row in rows:
            value = row.balance_usd if target_currency == "USD" else row.balance_krw
            if normalized_group_by == "PORTFOLIO":
                key = (f"portfolio:{row.portfolio_id or 'none'}", row.portfolio_name)
            else:
                key = (f"liability_type:{row.liability_type}", row.liability_type)
            bucket = buckets[key]
            bucket["value"] += Decimal(value)
    else:
        rows = db.scalars(select(SnapshotPortfolioRow).where(SnapshotPortfolioRow.snapshot_id == snapshot.id)).all()
        for row in rows:
            value = row.net_assets_usd if target_currency == "USD" else row.net_assets_krw
            profit = row.portfolio_profit_usd if target_currency == "USD" else row.portfolio_profit_krw
            cost_basis = row.invested_principal_usd if target_currency == "USD" else row.invested_principal_krw
            key = (f"portfolio:{row.portfolio_id or 'none'}", row.portfolio_name)
            bucket = buckets[key]
            bucket["value"] += Decimal(value)
            bucket["profit"] += Decimal(profit)
            bucket["cost_basis"] += Decimal(cost_basis)
            if row.return_pct is not None:
                bucket["fallback_sum"] += Decimal(row.return_pct)
                bucket["fallback_count"] += Decimal("1")

    sorted_items = sorted(
        ((key, label, metrics) for (key, label), metrics in buckets.items()),
        key=lambda x: x[2]["value"],
        reverse=True,
    )
    if len(sorted_items) > top_n:
        pinned = sorted_items[:top_n]
        others_metrics = _new_bucket()
        for _, _, metrics in sorted_items[top_n:]:
            others_metrics["value"] += metrics["value"]
            others_metrics["profit"] += metrics["profit"]
            others_metrics["cost_basis"] += metrics["cost_basis"]
            others_metrics["fallback_sum"] += metrics["fallback_sum"]
            others_metrics["fallback_count"] += metrics["fallback_count"]
        sorted_items = [*pinned, ("others", others_label, others_metrics)] if others_metrics["value"] != 0 else pinned

    total = sum((metrics["value"] for _, _, metrics in sorted_items), Decimal("0"))
    ratio_denominator = total
    ratio_transform = lambda value: value  # noqa: E731
    if normalized_target == "NET":
        positive_total = sum((metrics["value"] for _, _, metrics in sorted_items if metrics["value"] > 0), Decimal("0"))
        if positive_total > 0:
            ratio_denominator = positive_total
            ratio_transform = lambda value: value if value > 0 else Decimal("0")  # noqa: E731
        else:
            ratio_denominator = sum((abs(metrics["value"]) for _, _, metrics in sorted_items), Decimal("0"))
            ratio_transform = abs

    def _resolve_return_pct(metrics: dict[str, Decimal]) -> Decimal | None:
        if normalized_target == "LIABILITIES":
            return None
        cost_basis = metrics["cost_basis"]
        if cost_basis > 0:
            return (metrics["profit"] / cost_basis) * Decimal("100")
        if metrics["fallback_count"] > 0:
            return metrics["fallback_sum"] / metrics["fallback_count"]
        return None

    items = [
        SnapshotAllocationItemOut(
            key=key,
            label=label,
            value=metrics["value"],
            ratio_pct=(
                (ratio_transform(metrics["value"]) / ratio_denominator * Decimal("100"))
                if ratio_denominator
                else Decimal("0")
            ),
            return_pct=_resolve_return_pct(metrics),
        )
        for key, label, metrics in sorted_items
    ]

    return SnapshotAllocationOut(
        snapshot_id=snapshot.id,
        target=normalized_target,  # type: ignore[arg-type]
        group_by=normalized_group_by,  # type: ignore[arg-type]
        display_currency=target_currency,
        total=total,
        items=items,
        as_of=snapshot.as_of,
    )


@router.get("/{snapshot_id}/portfolios/table", response_model=SnapshotPortfolioTablePageOut)
def get_snapshot_portfolios_table(
    snapshot_id: int,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=200),
    sort_by: SnapshotPortfolioSortBy = Query(default=SnapshotPortfolioSortBy.CURRENT),
    sort_order: SortOrder = Query(default=SortOrder.DESC),
    portfolio_id: int | None = Query(default=None, ge=1),
    display_currency: str = Query(default="KRW"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SnapshotPortfolioTablePageOut:
    snapshot = _get_user_snapshot(db, current_user.id, snapshot_id)
    target_currency = _resolve_snapshot_display_currency(display_currency, snapshot.display_currency_at_capture)

    stmt = select(SnapshotPortfolioRow).where(SnapshotPortfolioRow.snapshot_id == snapshot.id)
    if portfolio_id is not None:
        stmt = stmt.where(SnapshotPortfolioRow.portfolio_id == portfolio_id)
    rows = db.scalars(stmt).all()
    items = [to_snapshot_portfolio_row_dict(row, target_currency) for row in rows]

    key_map = {
        SnapshotPortfolioSortBy.PORTFOLIO: "portfolio_name",
        SnapshotPortfolioSortBy.CURRENT: "current",
        SnapshotPortfolioSortBy.INVESTED_PRINCIPAL: "invested_principal",
        SnapshotPortfolioSortBy.PORTFOLIO_PROFIT: "portfolio_profit",
        SnapshotPortfolioSortBy.RETURN: "return_pct",
    }
    key = key_map[sort_by]
    if sort_by == SnapshotPortfolioSortBy.PORTFOLIO:
        items.sort(
            key=lambda row: (_to_sort_text(row.get(key)), int(row.get("portfolio_id") or 0), int(row.get("id") or 0)),
            reverse=(sort_order == SortOrder.DESC),
        )
    else:
        items.sort(
            key=lambda row: (_to_sort_decimal(row.get(key)), int(row.get("id") or 0)),
            reverse=(sort_order == SortOrder.DESC),
        )

    total = len(items)
    start = (page - 1) * page_size
    end = start + page_size
    paged_items = [SnapshotPortfolioRowOut(**item) for item in items[start:end]]
    return SnapshotPortfolioTablePageOut(
        items=paged_items,
        total=total,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order,
        portfolio_id=portfolio_id,
    )


@router.get("/{snapshot_id}/holdings/table", response_model=SnapshotHoldingTablePageOut)
def get_snapshot_holdings_table(
    snapshot_id: int,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=500),
    sort_by: SnapshotHoldingSortBy = Query(default=SnapshotHoldingSortBy.EVALUATED),
    sort_order: SortOrder = Query(default=SortOrder.DESC),
    portfolio_id: int | None = Query(default=None, ge=1),
    q: str | None = Query(default=None, min_length=1, max_length=100),
    display_currency: str = Query(default="KRW"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SnapshotHoldingTablePageOut:
    snapshot = _get_user_snapshot(db, current_user.id, snapshot_id)
    target_currency = _resolve_snapshot_display_currency(display_currency, snapshot.display_currency_at_capture)
    query_text = q.strip().lower() if q else None

    stmt = select(SnapshotHoldingRow).where(SnapshotHoldingRow.snapshot_id == snapshot.id)
    if portfolio_id is not None:
        stmt = stmt.where(SnapshotHoldingRow.portfolio_id == portfolio_id)
    rows = db.scalars(stmt).all()
    items = [to_snapshot_holding_row_dict(row, target_currency) for row in rows]
    if query_text:
        items = [
            row
            for row in items
            if query_text in (str(row["asset_name"]).lower())
            or query_text in (str(row["symbol"] or "").lower())
            or query_text in (str(row["portfolio_name"]).lower())
            or query_text in (str(row["asset_class"]).lower())
        ]

    key_map = {
        SnapshotHoldingSortBy.PORTFOLIO: "portfolio_name",
        SnapshotHoldingSortBy.ASSET: "asset_name",
        SnapshotHoldingSortBy.PRICE: "price",
        SnapshotHoldingSortBy.AVG_COST: "avg_cost",
        SnapshotHoldingSortBy.EVALUATED: "evaluated",
        SnapshotHoldingSortBy.COST_BASIS: "cost_basis",
        SnapshotHoldingSortBy.PROFIT: "profit",
        SnapshotHoldingSortBy.RETURN: "return_pct",
        SnapshotHoldingSortBy.SYMBOL: "symbol",
    }
    key = key_map[sort_by]
    if sort_by in {
        SnapshotHoldingSortBy.PORTFOLIO,
        SnapshotHoldingSortBy.ASSET,
        SnapshotHoldingSortBy.SYMBOL,
    }:
        items.sort(
            key=lambda row: (
                _to_sort_text(row.get(key)),
                _to_sort_text(row.get("asset_name")),
                int(row.get("asset_id") or 0),
                int(row.get("id") or 0),
            ),
            reverse=(sort_order == SortOrder.DESC),
        )
    else:
        items.sort(
            key=lambda row: (_to_sort_decimal(row.get(key)), int(row.get("id") or 0)),
            reverse=(sort_order == SortOrder.DESC),
        )

    total = len(items)
    start = (page - 1) * page_size
    end = start + page_size
    paged_items = [SnapshotHoldingRowOut(**item) for item in items[start:end]]
    return SnapshotHoldingTablePageOut(
        items=paged_items,
        total=total,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order,
        portfolio_id=portfolio_id,
        q=query_text,
    )


@router.get("/{snapshot_id}/liabilities/table", response_model=SnapshotLiabilityTablePageOut)
def get_snapshot_liabilities_table(
    snapshot_id: int,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=500),
    sort_by: SnapshotLiabilitySortBy = Query(default=SnapshotLiabilitySortBy.BALANCE),
    sort_order: SortOrder = Query(default=SortOrder.DESC),
    portfolio_id: int | None = Query(default=None, ge=1),
    q: str | None = Query(default=None, min_length=1, max_length=100),
    display_currency: str = Query(default="KRW"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SnapshotLiabilityTablePageOut:
    snapshot = _get_user_snapshot(db, current_user.id, snapshot_id)
    target_currency = _resolve_snapshot_display_currency(display_currency, snapshot.display_currency_at_capture)
    query_text = q.strip().lower() if q else None

    stmt = select(SnapshotLiabilityRow).where(SnapshotLiabilityRow.snapshot_id == snapshot.id)
    if portfolio_id is not None:
        stmt = stmt.where(SnapshotLiabilityRow.portfolio_id == portfolio_id)
    rows = db.scalars(stmt).all()
    items = [to_snapshot_liability_row_dict(row, target_currency) for row in rows]
    if query_text:
        items = [
            row
            for row in items
            if query_text in (str(row["liability_name"]).lower())
            or query_text in (str(row["portfolio_name"]).lower())
            or query_text in (str(row["liability_type"]).lower())
        ]

    key_map = {
        SnapshotLiabilitySortBy.PORTFOLIO: "portfolio_name",
        SnapshotLiabilitySortBy.LIABILITY: "liability_name",
        SnapshotLiabilitySortBy.BALANCE: "balance",
        SnapshotLiabilitySortBy.TYPE: "liability_type",
    }
    key = key_map[sort_by]
    if sort_by in {SnapshotLiabilitySortBy.PORTFOLIO, SnapshotLiabilitySortBy.LIABILITY, SnapshotLiabilitySortBy.TYPE}:
        items.sort(
            key=lambda row: (
                _to_sort_text(row.get(key)),
                _to_sort_text(row.get("liability_name")),
                int(row.get("liability_id") or 0),
                int(row.get("id") or 0),
            ),
            reverse=(sort_order == SortOrder.DESC),
        )
    else:
        items.sort(
            key=lambda row: (_to_sort_decimal(row.get(key)), int(row.get("id") or 0)),
            reverse=(sort_order == SortOrder.DESC),
        )

    total = len(items)
    start = (page - 1) * page_size
    end = start + page_size
    paged_items = [SnapshotLiabilityRowOut(**item) for item in items[start:end]]
    return SnapshotLiabilityTablePageOut(
        items=paged_items,
        total=total,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order,
        portfolio_id=portfolio_id,
        q=query_text,
    )


@router.get("/series", response_model=SnapshotSeriesOut)
def get_snapshot_series(
    mode: SnapshotSeriesMode = Query(default=SnapshotSeriesMode.SUMMARY),
    snapshot_ids: str | None = Query(default=None),
    portfolio_id: int | None = Query(default=None),
    holding_ids: str | None = Query(default=None),
    display_currency: str = Query(default="KRW"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SnapshotSeriesOut:
    requested_ids = parse_id_csv(snapshot_ids)
    allowed_ids = filter_snapshot_ids_for_user(db, current_user.id, requested_ids) if requested_ids else []
    if allowed_ids:
        snapshot_rows = list(
            db.scalars(
                select(SnapshotSet)
                .where(SnapshotSet.owner_user_id == current_user.id, SnapshotSet.id.in_(allowed_ids))
                .order_by(SnapshotSet.captured_at.asc(), SnapshotSet.id.asc())
            ).all()
        )
    else:
        snapshot_rows = list(
            db.scalars(
                select(SnapshotSet)
                .where(SnapshotSet.owner_user_id == current_user.id)
                .order_by(SnapshotSet.captured_at.asc(), SnapshotSet.id.asc())
                .limit(500)
            ).all()
        )

    if not snapshot_rows:
        return SnapshotSeriesOut(
            mode=mode,
            display_currency=normalize_display_currency(display_currency),
            points=[],
            portfolio_lines=[],
            holding_lines=[],
        )

    target_currency = _resolve_snapshot_display_currency(display_currency, snapshot_rows[-1].display_currency_at_capture)
    snapshot_id_list = [row.id for row in snapshot_rows]
    points = [
        SnapshotSeriesPointOut(
            snapshot_id=row.id,
            label=row.captured_at.strftime("%Y-%m-%d %H:%M:%S"),
            captured_at=row.captured_at,
            gross=(row.gross_assets_usd if target_currency == "USD" else row.gross_assets_krw),
            liabilities=(row.liabilities_usd if target_currency == "USD" else row.liabilities_krw),
            net=(row.net_assets_usd if target_currency == "USD" else row.net_assets_krw),
        )
        for row in snapshot_rows
    ]

    if mode == SnapshotSeriesMode.SUMMARY:
        return SnapshotSeriesOut(
            mode=mode,
            display_currency=target_currency,
            points=points,
            portfolio_lines=[],
            holding_lines=[],
        )

    portfolio_stmt = select(SnapshotPortfolioRow).where(SnapshotPortfolioRow.snapshot_id.in_(snapshot_id_list))
    if portfolio_id is not None:
        portfolio_stmt = portfolio_stmt.where(SnapshotPortfolioRow.portfolio_id == portfolio_id)
    portfolio_rows = db.scalars(portfolio_stmt).all()
    grouped_portfolios: dict[str, list[SnapshotPortfolioRow]] = defaultdict(list)
    for row in portfolio_rows:
        grouped_portfolios[f"portfolio:{row.portfolio_id or 'none'}"].append(row)

    portfolio_lines: list[SnapshotSeriesLineOut] = []
    for key, rows in grouped_portfolios.items():
        rows_by_snapshot = {row.snapshot_id: row for row in rows}
        label = rows[0].portfolio_name if rows else key
        line_points: list[SnapshotSeriesLinePointOut] = []
        for snapshot_id_value in snapshot_id_list:
            row = rows_by_snapshot.get(snapshot_id_value)
            if row is None or row.return_pct is None:
                continue
            line_points.append(SnapshotSeriesLinePointOut(snapshot_id=snapshot_id_value, value=row.return_pct))
        if line_points:
            portfolio_lines.append(SnapshotSeriesLineOut(key=key, label=label, points=line_points))
    portfolio_lines.sort(key=lambda line: line.label.lower())

    selected_holding_ids = parse_id_csv(holding_ids)
    holding_lines: list[SnapshotSeriesLineOut] = []
    if selected_holding_ids:
        holding_stmt = select(SnapshotHoldingRow).where(
            SnapshotHoldingRow.snapshot_id.in_(snapshot_id_list),
            SnapshotHoldingRow.asset_id.in_(selected_holding_ids),
        )
        if portfolio_id is not None:
            holding_stmt = holding_stmt.where(SnapshotHoldingRow.portfolio_id == portfolio_id)
        holding_rows = db.scalars(holding_stmt).all()
        grouped_holdings: dict[str, list[SnapshotHoldingRow]] = defaultdict(list)
        for row in holding_rows:
            grouped_holdings[f"asset:{row.asset_id or row.id}"].append(row)

        for key, rows in grouped_holdings.items():
            rows_by_snapshot = {row.snapshot_id: row for row in rows}
            label = rows[0].asset_name if rows else key
            if rows and rows[0].symbol:
                label = f"{label} ({rows[0].symbol})"
            line_points: list[SnapshotSeriesLinePointOut] = []
            for snapshot_id_value in snapshot_id_list:
                row = rows_by_snapshot.get(snapshot_id_value)
                if row is None or row.return_pct is None:
                    continue
                line_points.append(SnapshotSeriesLinePointOut(snapshot_id=snapshot_id_value, value=row.return_pct))
            if line_points:
                holding_lines.append(SnapshotSeriesLineOut(key=key, label=label, points=line_points))
        holding_lines.sort(key=lambda line: line.label.lower())

    return SnapshotSeriesOut(
        mode=mode,
        display_currency=target_currency,
        points=points,
        portfolio_lines=portfolio_lines,
        holding_lines=holding_lines,
    )


@router.get("/{snapshot_id}/export.csv")
def export_snapshot_csv(
    snapshot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    snapshot = _get_user_snapshot(db, current_user.id, snapshot_id)
    portfolio_rows = list(
        db.scalars(
            select(SnapshotPortfolioRow)
            .where(SnapshotPortfolioRow.snapshot_id == snapshot.id)
            .order_by(SnapshotPortfolioRow.id.asc())
        ).all()
    )
    holding_rows = list(
        db.scalars(
            select(SnapshotHoldingRow)
            .where(SnapshotHoldingRow.snapshot_id == snapshot.id)
            .order_by(SnapshotHoldingRow.id.asc())
        ).all()
    )
    liability_rows = list(
        db.scalars(
            select(SnapshotLiabilityRow)
            .where(SnapshotLiabilityRow.snapshot_id == snapshot.id)
            .order_by(SnapshotLiabilityRow.id.asc())
        ).all()
    )

    # Excel(Windows) compatibility: prepend UTF-8 BOM so Korean text is decoded correctly.
    csv_text = "\ufeff" + build_snapshot_csv_text(snapshot, portfolio_rows, holding_rows, liability_rows)
    return Response(
        content=csv_text,
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="snapshot_{snapshot.id}.csv"'},
    )


@router.post("/csv/preview", response_model=SnapshotCsvPreviewOut)
async def preview_snapshot_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SnapshotCsvPreviewOut:
    _ = db
    raw = await file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="CSV file is empty")

    try:
        text = raw.decode("utf-8-sig")
    except UnicodeDecodeError as exc:
        raise HTTPException(status_code=400, detail="CSV must be UTF-8 encoded") from exc

    reader = csv.DictReader(StringIO(text))
    if not reader.fieldnames or "record_type" not in reader.fieldnames:
        raise HTTPException(status_code=400, detail="CSV must include record_type column")

    now = datetime.now(UTC).replace(tzinfo=None)
    summary_row: dict[str, str] | None = None
    portfolio_rows: list[SnapshotPortfolioRowOut] = []
    holding_rows: list[SnapshotHoldingRowOut] = []
    liability_rows: list[SnapshotLiabilityRowOut] = []
    target_currency = "KRW"
    next_id = 1

    for line_no, row in enumerate(reader, start=2):
        record_type = (row.get("record_type") or "").upper().strip()
        if not record_type:
            raise HTTPException(status_code=400, detail=f"line {line_no}: record_type is required")
        if record_type == "SUMMARY":
            summary_row = row
            target_currency = normalize_display_currency(row.get("display_currency_at_capture") or "KRW")
            continue

        if record_type == "PORTFOLIO":
            portfolio_rows.append(
                SnapshotPortfolioRowOut(
                    id=next_id,
                    snapshot_id=0,
                    portfolio_id=int(row["portfolio_id"]) if (row.get("portfolio_id") or "").strip() else None,
                    portfolio_name=(row.get("portfolio_name") or "Unassigned").strip() or "Unassigned",
                    portfolio_type=(row.get("portfolio_type") or "").strip() or None,
                    base_currency=None,
                    current=normalize_decimal(
                        row.get("gross_assets_usd") if target_currency == "USD" else row.get("gross_assets_krw")
                    ),
                    invested_principal=normalize_decimal(
                        row.get("invested_principal_usd")
                        if target_currency == "USD"
                        else row.get("invested_principal_krw")
                    ),
                    portfolio_profit=normalize_decimal(
                        row.get("profit_usd") if target_currency == "USD" else row.get("profit_krw")
                    ),
                    return_pct=normalize_decimal(row.get("return_pct")) if (row.get("return_pct") or "").strip() else None,
                    net_contribution=normalize_decimal(
                        row.get("net_contribution_usd")
                        if target_currency == "USD"
                        else row.get("net_contribution_krw")
                    ),
                    liabilities=normalize_decimal(
                        row.get("liabilities_usd") if target_currency == "USD" else row.get("liabilities_krw")
                    ),
                    net_assets=normalize_decimal(
                        row.get("net_assets_usd") if target_currency == "USD" else row.get("net_assets_krw")
                    ),
                    debt_adjusted_principal=normalize_decimal(
                        row.get("debt_adjusted_principal_usd")
                        if target_currency == "USD"
                        else row.get("debt_adjusted_principal_krw")
                    ),
                )
            )
            next_id += 1
            continue

        if record_type == "HOLDING":
            holding_rows.append(
                SnapshotHoldingRowOut(
                    id=next_id,
                    snapshot_id=0,
                    portfolio_id=int(row["portfolio_id"]) if (row.get("portfolio_id") or "").strip() else None,
                    portfolio_name=(row.get("portfolio_name") or "Unassigned").strip() or "Unassigned",
                    asset_id=int(row["asset_id"]) if (row.get("asset_id") or "").strip() else None,
                    asset_name=(row.get("asset_name") or "-").strip() or "-",
                    symbol=(row.get("symbol") or "").strip() or None,
                    asset_class=(row.get("asset_class") or "ETC").strip() or "ETC",
                    asset_currency=(row.get("asset_currency") or target_currency).strip() or target_currency,
                    quantity=normalize_decimal(row.get("quantity")),
                    price=normalize_decimal(row.get("price")),
                    price_currency=(row.get("price_currency") or target_currency).strip() or target_currency,
                    avg_cost=normalize_decimal(row.get("avg_cost")),
                    avg_cost_currency=(row.get("avg_cost_currency") or target_currency).strip() or target_currency,
                    evaluated=normalize_decimal(
                        row.get("evaluated_usd") if target_currency == "USD" else row.get("evaluated_krw")
                    ),
                    cost_basis=normalize_decimal(
                        row.get("cost_basis_usd") if target_currency == "USD" else row.get("cost_basis_krw")
                    ),
                    profit=normalize_decimal(
                        row.get("profit_usd") if target_currency == "USD" else row.get("profit_krw")
                    ),
                    return_pct=normalize_decimal(row.get("return_pct")) if (row.get("return_pct") or "").strip() else None,
                    quote_as_of=None,
                    quote_source=None,
                )
            )
            next_id += 1
            continue

        if record_type == "LIABILITY":
            liability_rows.append(
                SnapshotLiabilityRowOut(
                    id=next_id,
                    snapshot_id=0,
                    portfolio_id=int(row["portfolio_id"]) if (row.get("portfolio_id") or "").strip() else None,
                    portfolio_name=(row.get("portfolio_name") or "Unassigned").strip() or "Unassigned",
                    liability_id=int(row["liability_id"]) if (row.get("liability_id") or "").strip() else None,
                    liability_name=(row.get("liability_name") or "-").strip() or "-",
                    liability_type=(row.get("liability_type") or "ETC").strip() or "ETC",
                    balance=normalize_decimal(
                        row.get("balance_usd") if target_currency == "USD" else row.get("balance_krw")
                    ),
                    balance_currency=target_currency,
                )
            )
            next_id += 1
            continue

        raise HTTPException(status_code=400, detail=f"line {line_no}: unsupported record_type {record_type}")

    if summary_row is None:
        summary = SnapshotSummaryOut(
            id=0,
            owner_user_id=current_user.id,
            name=(file.filename or "csv-preview"),
            source_type=SnapshotSourceType.CSV_PREVIEW,
            note="CSV preview (no DB save)",
            captured_at=now,
            as_of=now,
            display_currency_at_capture=target_currency,
            fx_usd_krw_rate=None,
            fx_as_of=None,
            fx_source=None,
            gross_assets_krw=Decimal("0"),
            gross_assets_usd=Decimal("0"),
            liabilities_krw=Decimal("0"),
            liabilities_usd=Decimal("0"),
            net_assets_krw=Decimal("0"),
            net_assets_usd=Decimal("0"),
            invested_principal_krw=Decimal("0"),
            invested_principal_usd=Decimal("0"),
            debt_adjusted_principal_krw=Decimal("0"),
            debt_adjusted_principal_usd=Decimal("0"),
            created_at=now,
            warning_count=0,
        )
    else:
        captured_at = (
            datetime.fromisoformat(summary_row["captured_at"])
            if (summary_row.get("captured_at") or "").strip()
            else now
        )
        as_of = datetime.fromisoformat(summary_row["as_of"]) if (summary_row.get("as_of") or "").strip() else captured_at
        summary = SnapshotSummaryOut(
            id=int(summary_row.get("snapshot_id") or 0),
            owner_user_id=current_user.id,
            name=(file.filename or "csv-preview"),
            source_type=SnapshotSourceType.CSV_PREVIEW,
            note="CSV preview (no DB save)",
            captured_at=captured_at,
            as_of=as_of,
            display_currency_at_capture=target_currency,
            fx_usd_krw_rate=normalize_decimal(summary_row.get("fx_usd_krw_rate")) if summary_row.get("fx_usd_krw_rate") else None,
            fx_as_of=datetime.fromisoformat(summary_row["fx_as_of"]) if (summary_row.get("fx_as_of") or "").strip() else None,
            fx_source=(summary_row.get("fx_source") or "").strip() or None,
            gross_assets_krw=normalize_decimal(summary_row.get("gross_assets_krw")),
            gross_assets_usd=normalize_decimal(summary_row.get("gross_assets_usd")),
            liabilities_krw=normalize_decimal(summary_row.get("liabilities_krw")),
            liabilities_usd=normalize_decimal(summary_row.get("liabilities_usd")),
            net_assets_krw=normalize_decimal(summary_row.get("net_assets_krw")),
            net_assets_usd=normalize_decimal(summary_row.get("net_assets_usd")),
            invested_principal_krw=normalize_decimal(summary_row.get("invested_principal_krw")),
            invested_principal_usd=normalize_decimal(summary_row.get("invested_principal_usd")),
            debt_adjusted_principal_krw=normalize_decimal(summary_row.get("debt_adjusted_principal_krw")),
            debt_adjusted_principal_usd=normalize_decimal(summary_row.get("debt_adjusted_principal_usd")),
            created_at=now,
            warning_count=0,
        )

    return SnapshotCsvPreviewOut(
        file_name=file.filename or "snapshot.csv",
        summary=summary,
        portfolio_rows=portfolio_rows,
        holding_rows=holding_rows,
        liability_rows=liability_rows,
    )
