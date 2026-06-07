from __future__ import annotations

import csv
import io
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.api.routers.analytics import _resolve_scope_user_ids
from app.models.user import User
from app.models.valuation_snapshot import (
    ValuationSnapshot,
    ValuationSnapshotHoldingRow,
    ValuationSnapshotLiabilityRow,
    ValuationSnapshotPortfolioRow,
)
from app.schemas.valuation_snapshot import (
    ValuationSnapshotAllocationItemOut,
    ValuationSnapshotDetailOut,
    ValuationSnapshotHoldingRowOut,
    ValuationSnapshotLiabilityRowOut,
    ValuationSnapshotListItemOut,
    ValuationSnapshotListOut,
    ValuationSnapshotPortfolioRowOut,
    ValuationSnapshotSummaryOut,
)

router = APIRouter(prefix="/valuation-snapshots", tags=["valuation-snapshots"])


def _as_decimal(value: object) -> Decimal:
    if value is None:
        return Decimal("0")
    if isinstance(value, Decimal):
        return value
    return Decimal(str(value))


def _ratio_pct(value: Decimal, total: Decimal) -> Decimal:
    if total <= 0:
        return Decimal("0")
    return (value / total) * Decimal("100")


def _scope_filters(
    db: Session,
    *,
    current_user: User,
    scope_type: str | None,
    scope_id: int | None,
) -> tuple[str, int]:
    normalized_scope_type, normalized_scope_id, _scope_user_ids = _resolve_scope_user_ids(
        db=db,
        current_user=current_user,
        scope_type=scope_type,
        scope_id=scope_id,
    )
    return normalized_scope_type, normalized_scope_id


def _get_allowed_snapshot(db: Session, *, current_user: User, snapshot_id: int) -> ValuationSnapshot:
    snapshot = db.get(ValuationSnapshot, snapshot_id)
    if snapshot is None:
        raise HTTPException(status_code=404, detail="Valuation snapshot not found")
    _scope_filters(
        db,
        current_user=current_user,
        scope_type=snapshot.scope_type,
        scope_id=snapshot.scope_id,
    )
    return snapshot


def _snapshot_summary(
    snapshot: ValuationSnapshot,
    portfolio_rows: list[ValuationSnapshotPortfolioRow],
) -> ValuationSnapshotSummaryOut:
    invested = sum((_as_decimal(row.invested_principal_total) for row in portfolio_rows), Decimal("0"))
    debt_adjusted = sum((_as_decimal(row.debt_adjusted_principal_total) for row in portfolio_rows), Decimal("0"))
    principal_profit = _as_decimal(snapshot.assets_total) - invested
    net_profit = _as_decimal(snapshot.net_worth_total) - debt_adjusted
    principal_return = _ratio_pct(principal_profit, invested) if invested > 0 else None
    net_return = _ratio_pct(net_profit, debt_adjusted) if debt_adjusted > 0 else None
    return ValuationSnapshotSummaryOut(
        id=snapshot.id,
        scope_type=snapshot.scope_type,
        scope_id=snapshot.scope_id,
        display_currency=snapshot.display_currency,
        snapshot_date=snapshot.snapshot_date,
        as_of=snapshot.as_of,
        source=snapshot.source,
        gross_assets_total=_as_decimal(snapshot.assets_total),
        liabilities_total=_as_decimal(snapshot.liabilities_total),
        net_assets_total=_as_decimal(snapshot.net_worth_total),
        invested_principal_total=invested,
        debt_adjusted_principal_total=debt_adjusted,
        principal_profit_total=principal_profit,
        principal_return_pct=principal_return,
        net_assets_profit_total=net_profit,
        net_assets_return_pct=net_return,
    )


def _load_detail(db: Session, snapshot: ValuationSnapshot) -> ValuationSnapshotDetailOut:
    portfolio_rows = list(
        db.scalars(
            select(ValuationSnapshotPortfolioRow)
            .where(ValuationSnapshotPortfolioRow.valuation_snapshot_id == snapshot.id)
            .order_by(ValuationSnapshotPortfolioRow.gross_assets_total.desc(), ValuationSnapshotPortfolioRow.id.asc())
        ).all()
    )
    holding_rows = list(
        db.scalars(
            select(ValuationSnapshotHoldingRow)
            .where(ValuationSnapshotHoldingRow.valuation_snapshot_id == snapshot.id)
            .order_by(ValuationSnapshotHoldingRow.evaluated_amount.desc(), ValuationSnapshotHoldingRow.id.asc())
        ).all()
    )
    liability_rows = list(
        db.scalars(
            select(ValuationSnapshotLiabilityRow)
            .where(ValuationSnapshotLiabilityRow.valuation_snapshot_id == snapshot.id)
            .order_by(ValuationSnapshotLiabilityRow.balance_total.desc(), ValuationSnapshotLiabilityRow.id.asc())
        ).all()
    )
    allocation_total = _as_decimal(snapshot.assets_total)
    allocation = [
        ValuationSnapshotAllocationItemOut(
            key=f"portfolio:{row.portfolio_id or row.portfolio_name}",
            label=row.portfolio_name,
            value=_as_decimal(row.gross_assets_total),
            ratio_pct=_ratio_pct(_as_decimal(row.gross_assets_total), allocation_total),
        )
        for row in portfolio_rows
    ]
    return ValuationSnapshotDetailOut(
        summary=_snapshot_summary(snapshot, portfolio_rows),
        portfolios=[
            ValuationSnapshotPortfolioRowOut(
                portfolio_id=row.portfolio_id,
                portfolio_name=row.portfolio_name,
                portfolio_type=row.portfolio_type,
                base_currency=row.base_currency,
                gross_assets_total=_as_decimal(row.gross_assets_total),
                liabilities_total=_as_decimal(row.liabilities_total),
                net_assets_total=_as_decimal(row.net_assets_total),
                invested_principal_total=_as_decimal(row.invested_principal_total),
                debt_adjusted_principal_total=_as_decimal(row.debt_adjusted_principal_total),
                net_contribution_total=_as_decimal(row.net_contribution_total),
                portfolio_profit_total=_as_decimal(row.portfolio_profit_total),
                return_pct=row.return_pct,
            )
            for row in portfolio_rows
        ],
        holdings=[
            ValuationSnapshotHoldingRowOut(
                portfolio_id=row.portfolio_id,
                portfolio_name=row.portfolio_name,
                asset_id=row.asset_id,
                asset_name=row.asset_name,
                symbol=row.symbol,
                asset_class=row.asset_class,
                asset_currency=row.asset_currency,
                quantity=_as_decimal(row.quantity),
                current_price=_as_decimal(row.current_price),
                current_price_currency=row.current_price_currency,
                avg_cost=row.avg_cost,
                avg_cost_currency=row.avg_cost_currency,
                evaluated_amount=_as_decimal(row.evaluated_amount),
                cost_basis_total=_as_decimal(row.cost_basis_total),
                profit_total=_as_decimal(row.profit_total),
                return_pct=row.return_pct,
                quote_as_of=row.quote_as_of,
                quote_source=row.quote_source,
            )
            for row in holding_rows
        ],
        liabilities=[
            ValuationSnapshotLiabilityRowOut(
                portfolio_id=row.portfolio_id,
                portfolio_name=row.portfolio_name,
                liability_id=row.liability_id,
                liability_name=row.liability_name,
                liability_type=row.liability_type,
                balance=_as_decimal(row.balance),
                balance_currency=row.balance_currency,
                balance_total=_as_decimal(row.balance_total),
            )
            for row in liability_rows
        ],
        allocation=allocation,
    )


@router.get("", response_model=ValuationSnapshotListOut)
def list_valuation_snapshots(
    scope_type: str | None = None,
    scope_id: int | None = None,
    display_currency: str = Query(default="KRW"),
    limit: int = Query(default=50, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ValuationSnapshotListOut:
    normalized_scope_type, normalized_scope_id = _scope_filters(
        db,
        current_user=current_user,
        scope_type=scope_type,
        scope_id=scope_id,
    )
    target_currency = (display_currency or "KRW").upper()
    rows = list(
        db.scalars(
            select(ValuationSnapshot)
            .where(
                ValuationSnapshot.scope_type == normalized_scope_type,
                ValuationSnapshot.scope_id == normalized_scope_id,
                ValuationSnapshot.display_currency == target_currency,
            )
            .order_by(ValuationSnapshot.snapshot_date.desc(), ValuationSnapshot.id.desc())
            .limit(limit)
        ).all()
    )
    return ValuationSnapshotListOut(
        items=[
            ValuationSnapshotListItemOut(
                id=row.id,
                scope_type=row.scope_type,
                scope_id=row.scope_id,
                display_currency=row.display_currency,
                snapshot_date=row.snapshot_date,
                created_at=row.created_at,
                as_of=row.as_of,
                gross=_as_decimal(row.assets_total),
                net=_as_decimal(row.net_worth_total),
                liabilities=_as_decimal(row.liabilities_total),
                source=row.source,
            )
            for row in rows
        ]
    )


@router.get("/{snapshot_id}", response_model=ValuationSnapshotDetailOut)
def get_valuation_snapshot(
    snapshot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ValuationSnapshotDetailOut:
    snapshot = _get_allowed_snapshot(db, current_user=current_user, snapshot_id=snapshot_id)
    return _load_detail(db, snapshot)


@router.get("/{snapshot_id}/export.csv")
def export_valuation_snapshot_csv(
    snapshot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> StreamingResponse:
    snapshot = _get_allowed_snapshot(db, current_user=current_user, snapshot_id=snapshot_id)
    detail = _load_detail(db, snapshot)
    stream = io.StringIO()
    writer = csv.writer(stream)
    writer.writerow(["section", "snapshot_id", "snapshot_date", "field_1", "field_2", "field_3", "amount_1", "amount_2", "amount_3", "ratio_pct"])
    writer.writerow([
        "SUMMARY",
        detail.summary.id,
        detail.summary.snapshot_date.isoformat(),
        detail.summary.display_currency,
        detail.summary.source,
        detail.summary.as_of.isoformat(),
        detail.summary.gross_assets_total,
        detail.summary.liabilities_total,
        detail.summary.net_assets_total,
        detail.summary.principal_return_pct,
    ])
    for row in detail.portfolios:
        writer.writerow([
            "PORTFOLIO",
            snapshot.id,
            snapshot.snapshot_date.isoformat(),
            row.portfolio_name,
            row.portfolio_type or "",
            row.base_currency or "",
            row.gross_assets_total,
            row.invested_principal_total,
            row.portfolio_profit_total,
            row.return_pct,
        ])
    for row in detail.holdings:
        writer.writerow([
            "HOLDING",
            snapshot.id,
            snapshot.snapshot_date.isoformat(),
            row.asset_name,
            row.symbol or "",
            row.portfolio_name or "",
            row.evaluated_amount,
            row.cost_basis_total,
            row.profit_total,
            row.return_pct,
        ])
    for row in detail.liabilities:
        writer.writerow([
            "LIABILITY",
            snapshot.id,
            snapshot.snapshot_date.isoformat(),
            row.liability_name,
            row.liability_type or "",
            row.portfolio_name or "",
            row.balance_total,
            row.balance,
            "",
            "",
        ])
    stream.seek(0)
    filename = f"valuation-snapshot-{snapshot.snapshot_date.isoformat()}-{snapshot.id}.csv"
    return StreamingResponse(
        iter([stream.getvalue()]),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
