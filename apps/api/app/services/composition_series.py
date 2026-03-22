from __future__ import annotations

from collections import defaultdict
from datetime import UTC, datetime
from decimal import Decimal
from typing import Literal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.valuation_snapshot import (
    ValuationSnapshot,
    ValuationSnapshotHoldingRow,
    ValuationSnapshotLiabilityRow,
    ValuationSnapshotPortfolioRow,
)
from app.schemas.analytics import (
    AnalyticsCompositionLegendItemOut,
    AnalyticsCompositionPointOut,
    AnalyticsCompositionSegmentOut,
    AnalyticsCompositionSeriesOut,
)

ChartKind = Literal["AMOUNT", "ALLOCATION"]
CompositionTab = Literal["GROSS_COMPOSITION", "CAPITAL_STRUCTURE", "LIABILITY_BREAKDOWN"]
CompositionMode = Literal["SUMMARY", "PORTFOLIO"]
CompositionGroupBy = Literal["ASSET_CLASS", "PORTFOLIO", "LIABILITY_TYPE", "ASSET"]
SeriesBucket = Literal["DAY", "WEEK", "MONTH"]


class CompositionSeriesValidationError(Exception):
    def __init__(self, detail: str, status_code: int = 400):
        super().__init__(detail)
        self.detail = detail
        self.status_code = status_code


def _quantize_amount(value: Decimal) -> Decimal:
    return Decimal(value).quantize(Decimal("0.01"))


def _quantize_pct(value: Decimal) -> Decimal:
    return Decimal(value).quantize(Decimal("0.01"))


def _format_label(value: str | None) -> str:
    raw = (value or "").strip()
    if not raw:
        return "Unknown"
    parts = [part for part in raw.replace("-", "_").split("_") if part]
    if not parts:
        return raw
    if len(parts) == 1 and raw.isupper():
        return parts[0].title()
    return " ".join(part.title() for part in parts)


def _asset_class_label(asset_class: str | None) -> str:
    normalized = (asset_class or "").upper()
    if normalized == "REAL_ESTATE":
        return "Real Estate"
    if normalized == "DEPOSIT_SAVING":
        return "Deposit"
    if normalized == "CRYPTO":
        return "Crypto"
    if normalized == "STOCK":
        return "Stock"
    if normalized == "CASH":
        return "Cash"
    if normalized == "BOND":
        return "Bond"
    if normalized == "LIABILITY":
        return "Liability"
    return _format_label(asset_class)


def _asset_label(asset_name: str | None, symbol: str | None) -> str:
    base = (asset_name or "").strip() or "Unknown Asset"
    normalized_symbol = (symbol or "").strip()
    if not normalized_symbol:
        return base
    if normalized_symbol.upper() in base.upper():
        return base
    return f"{base} ({normalized_symbol})"


def _asset_key(asset_id: int | None, asset_name: str | None, symbol: str | None) -> str:
    if asset_id is not None:
        return f"asset:{asset_id}"
    normalized_symbol = (symbol or "").strip().upper()
    if normalized_symbol:
        return f"asset:symbol:{normalized_symbol}"
    normalized_name = (asset_name or "").strip().lower().replace(" ", "_")
    return f"asset:name:{normalized_name or 'unknown'}"


def _bucket_key(snapshot: ValuationSnapshot, bucket: SeriesBucket) -> str:
    if bucket == "WEEK":
        iso_year, iso_week, _ = snapshot.snapshot_date.isocalendar()
        return f"{iso_year}-W{iso_week:02d}"
    if bucket == "MONTH":
        return f"{snapshot.snapshot_date.year}-{snapshot.snapshot_date.month:02d}"
    return snapshot.snapshot_date.isoformat()


def _select_bucketed_snapshots(
    db: Session,
    *,
    scope_type: str,
    scope_id: int,
    display_currency: str,
    bucket: SeriesBucket,
    limit: int,
) -> list[tuple[str, ValuationSnapshot]]:
    rows = list(
        db.scalars(
            select(ValuationSnapshot)
            .where(
                ValuationSnapshot.scope_type == scope_type,
                ValuationSnapshot.scope_id == scope_id,
                ValuationSnapshot.display_currency == display_currency,
            )
            .order_by(ValuationSnapshot.snapshot_date.asc(), ValuationSnapshot.id.asc())
        ).all()
    )
    if not rows:
        return []
    if bucket == "DAY":
        selected = rows[-limit:]
        return [(row.snapshot_date.isoformat(), row) for row in selected]

    bucket_map: dict[str, ValuationSnapshot] = {}
    for row in rows:
        bucket_map[_bucket_key(row, bucket)] = row
    labels = list(bucket_map.keys())[-limit:]
    return [(label, bucket_map[label]) for label in labels]


def _stable_color_token(*, tab: CompositionTab, group_by: CompositionGroupBy, key: str) -> str:
    if tab == "CAPITAL_STRUCTURE":
        return "NET" if key == "net" else "LIABILITIES"
    if group_by == "ASSET_CLASS":
        return key.split(":", 1)[1].upper()
    if group_by == "ASSET":
        return key
    if group_by == "LIABILITY_TYPE":
        return key.split(":", 1)[1].upper()
    return key


def _apply_top_n_others(
    raw_amounts_by_snapshot: dict[int, dict[str, Decimal]],
    segment_meta: dict[str, tuple[str, str]],
    overall_totals: dict[str, Decimal],
    latest_totals: dict[str, Decimal],
    *,
    top_n: int,
    latest_snapshot_id: int,
) -> tuple[
    dict[int, dict[str, Decimal]],
    dict[str, tuple[str, str]],
    dict[str, Decimal],
    dict[str, Decimal],
]:
    if len(segment_meta) <= top_n:
        return raw_amounts_by_snapshot, segment_meta, overall_totals, latest_totals

    ranked_keys = sorted(
        segment_meta.keys(),
        key=lambda key: (
            latest_totals.get(key, Decimal("0")),
            overall_totals.get(key, Decimal("0")),
            segment_meta[key][0],
        ),
        reverse=True,
    )
    keep_keys = set(ranked_keys[:top_n])
    others_key = "asset:others"

    trimmed_amounts: dict[int, dict[str, Decimal]] = {}
    trimmed_meta = {key: segment_meta[key] for key in ranked_keys[:top_n]}
    trimmed_meta[others_key] = ("Others", others_key)
    trimmed_overall: dict[str, Decimal] = defaultdict(lambda: Decimal("0"))
    trimmed_latest: dict[str, Decimal] = defaultdict(lambda: Decimal("0"))

    for snapshot_id, point_map in raw_amounts_by_snapshot.items():
        next_map: dict[str, Decimal] = {}
        others_total = Decimal("0")
        for key, amount in point_map.items():
            if key in keep_keys:
                next_map[key] = next_map.get(key, Decimal("0")) + amount
                trimmed_overall[key] += amount
                if snapshot_id == latest_snapshot_id:
                    trimmed_latest[key] += amount
            else:
                others_total += amount
        if others_total > 0:
            next_map[others_key] = others_total
            trimmed_overall[others_key] += others_total
            if snapshot_id == latest_snapshot_id:
                trimmed_latest[others_key] += others_total
        trimmed_amounts[snapshot_id] = next_map

    if trimmed_overall.get(others_key, Decimal("0")) <= 0:
        trimmed_meta.pop(others_key, None)
        trimmed_overall.pop(others_key, None)
        trimmed_latest.pop(others_key, None)

    return trimmed_amounts, trimmed_meta, trimmed_overall, trimmed_latest


def build_composition_series(
    db: Session,
    *,
    scope_type: str,
    scope_id: int,
    display_currency: str,
    chart_kind: ChartKind,
    tab: CompositionTab,
    mode: CompositionMode,
    group_by: CompositionGroupBy | None,
    portfolio_id: int | None,
    bucket: SeriesBucket,
    limit: int,
    top_n: int = 8,
) -> AnalyticsCompositionSeriesOut:
    target_currency = (display_currency or "KRW").upper()

    effective_mode: CompositionMode = "SUMMARY"
    effective_group_by: CompositionGroupBy = "PORTFOLIO"

    if group_by == "ASSET" and tab != "GROSS_COMPOSITION":
        raise CompositionSeriesValidationError("ASSET group is only supported for Gross Composition.")

    if tab == "GROSS_COMPOSITION":
        if mode == "PORTFOLIO":
            if portfolio_id is None:
                raise CompositionSeriesValidationError("portfolio_id is required for PORTFOLIO mode.")
            effective_mode = "PORTFOLIO"
            effective_group_by = group_by if group_by in {"ASSET_CLASS", "ASSET"} else "ASSET_CLASS"
        else:
            effective_mode = "SUMMARY"
            effective_group_by = group_by if group_by in {"ASSET_CLASS", "PORTFOLIO", "ASSET"} else "ASSET_CLASS"
    elif tab == "LIABILITY_BREAKDOWN":
        effective_group_by = group_by if group_by in {"PORTFOLIO", "LIABILITY_TYPE"} else "PORTFOLIO"

    selected = _select_bucketed_snapshots(
        db,
        scope_type=scope_type,
        scope_id=scope_id,
        display_currency=target_currency,
        bucket=bucket,
        limit=limit,
    )
    if not selected:
        return AnalyticsCompositionSeriesOut(
            scope_type=scope_type,
            scope_id=scope_id,
            display_currency=target_currency,
            chart_kind=chart_kind,
            tab=tab,
            mode=effective_mode,
            group_by=effective_group_by,
            bucket=bucket,
            limit=limit,
            legend=[],
            points=[],
            as_of=datetime.now(UTC).replace(tzinfo=None),
            has_data=False,
        )

    snapshot_ids = [snapshot.id for _, snapshot in selected]
    latest_snapshot_id = snapshot_ids[-1]
    raw_amounts_by_snapshot: dict[int, dict[str, Decimal]] = {snapshot.id: {} for _, snapshot in selected}
    segment_meta: dict[str, tuple[str, str]] = {}
    overall_totals: dict[str, Decimal] = defaultdict(lambda: Decimal("0"))
    latest_totals: dict[str, Decimal] = defaultdict(lambda: Decimal("0"))

    def add_segment(snapshot_id: int, key: str, label: str, amount: Decimal) -> None:
        amount = Decimal(amount)
        if amount <= 0:
            return
        point_map = raw_amounts_by_snapshot.setdefault(snapshot_id, {})
        point_map[key] = point_map.get(key, Decimal("0")) + amount
        segment_meta[key] = (label, _stable_color_token(tab=tab, group_by=effective_group_by, key=key))
        overall_totals[key] += amount
        if snapshot_id == latest_snapshot_id:
            latest_totals[key] += amount

    if tab == "GROSS_COMPOSITION":
        if effective_mode == "SUMMARY" and effective_group_by == "PORTFOLIO":
            rows = db.scalars(
                select(ValuationSnapshotPortfolioRow).where(
                    ValuationSnapshotPortfolioRow.valuation_snapshot_id.in_(snapshot_ids)
                )
            ).all()
            for row in rows:
                add_segment(
                    row.valuation_snapshot_id,
                    f"portfolio:{row.portfolio_id if row.portfolio_id is not None else 'none'}",
                    row.portfolio_name,
                    Decimal(row.gross_assets_total),
                )
        else:
            stmt = select(ValuationSnapshotHoldingRow).where(
                ValuationSnapshotHoldingRow.valuation_snapshot_id.in_(snapshot_ids)
            )
            if effective_mode == "PORTFOLIO" and portfolio_id is not None:
                stmt = stmt.where(ValuationSnapshotHoldingRow.portfolio_id == portfolio_id)
            rows = db.scalars(stmt).all()
            for row in rows:
                if effective_group_by == "ASSET":
                    add_segment(
                        row.valuation_snapshot_id,
                        _asset_key(row.asset_id, row.asset_name, row.symbol),
                        _asset_label(row.asset_name, row.symbol),
                        Decimal(row.evaluated_amount),
                    )
                else:
                    add_segment(
                        row.valuation_snapshot_id,
                        f"asset_class:{(row.asset_class or 'UNKNOWN').upper()}",
                        _asset_class_label(row.asset_class),
                        Decimal(row.evaluated_amount),
                    )
    elif tab == "CAPITAL_STRUCTURE":
        for _, snapshot in selected:
            gross = max(Decimal("0"), Decimal(snapshot.assets_total))
            positive_net = max(Decimal("0"), Decimal(snapshot.net_worth_total))
            positive_liabilities = max(Decimal("0"), Decimal(snapshot.liabilities_total))
            denominator = positive_net + positive_liabilities
            if gross <= 0 or denominator <= 0:
                continue
            net_amount = gross * (positive_net / denominator)
            liabilities_amount = gross * (positive_liabilities / denominator)
            add_segment(snapshot.id, "net", "Net", net_amount)
            add_segment(snapshot.id, "liabilities", "Liabilities", liabilities_amount)
    else:
        rows = db.scalars(
            select(ValuationSnapshotLiabilityRow).where(
                ValuationSnapshotLiabilityRow.valuation_snapshot_id.in_(snapshot_ids)
            )
        ).all()
        for row in rows:
            if effective_group_by == "LIABILITY_TYPE":
                add_segment(
                    row.valuation_snapshot_id,
                    f"liability_type:{(row.liability_type or 'UNKNOWN').upper()}",
                    _format_label(row.liability_type),
                    Decimal(row.balance_total),
                )
            else:
                add_segment(
                    row.valuation_snapshot_id,
                    f"portfolio:{row.portfolio_id if row.portfolio_id is not None else 'none'}",
                    row.portfolio_name,
                    Decimal(row.balance_total),
                )

    if effective_group_by == "ASSET":
        raw_amounts_by_snapshot, segment_meta, overall_totals, latest_totals = _apply_top_n_others(
            raw_amounts_by_snapshot,
            segment_meta,
            overall_totals,
            latest_totals,
            top_n=top_n,
            latest_snapshot_id=latest_snapshot_id,
        )

    legend_keys = sorted(
        segment_meta.keys(),
        key=lambda key: (
            latest_totals.get(key, Decimal("0")),
            overall_totals.get(key, Decimal("0")),
            segment_meta[key][0],
        ),
        reverse=True,
    )

    legend = [
        AnalyticsCompositionLegendItemOut(
            key=key,
            label=segment_meta[key][0],
            color_token=segment_meta[key][1],
        )
        for key in legend_keys
    ]

    points: list[AnalyticsCompositionPointOut] = []
    has_data = False
    latest_as_of = selected[-1][1].as_of

    for bucket_label, snapshot in selected:
        point_map = raw_amounts_by_snapshot.get(snapshot.id, {})
        if tab == "CAPITAL_STRUCTURE":
            total_amount = max(Decimal("0"), Decimal(snapshot.assets_total))
        else:
            total_amount = sum(point_map.values(), Decimal("0"))

        segments: list[AnalyticsCompositionSegmentOut] = []
        for key in legend_keys:
            amount = point_map.get(key)
            if amount is None or amount <= 0:
                continue
            ratio_pct = Decimal("0")
            if total_amount > 0:
                ratio_pct = (amount / total_amount) * Decimal("100")
            segments.append(
                AnalyticsCompositionSegmentOut(
                    key=key,
                    label=segment_meta[key][0],
                    amount=_quantize_amount(amount),
                    ratio_pct=_quantize_pct(ratio_pct),
                )
            )
        if segments:
            has_data = True
        points.append(
            AnalyticsCompositionPointOut(
                bucket_label=bucket_label,
                snapshot_date=snapshot.snapshot_date.isoformat(),
                total_amount=_quantize_amount(total_amount),
                segments=segments,
            )
        )

    return AnalyticsCompositionSeriesOut(
        scope_type=scope_type,
        scope_id=scope_id,
        display_currency=target_currency,
        chart_kind=chart_kind,
        tab=tab,
        mode=effective_mode,
        group_by=effective_group_by,
        bucket=bucket,
        limit=limit,
        legend=legend,
        points=points,
        as_of=latest_as_of,
        has_data=has_data,
    )
