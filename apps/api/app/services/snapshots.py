from __future__ import annotations

import csv
from collections import defaultdict
from datetime import UTC, datetime
from decimal import Decimal
from io import StringIO
from typing import Iterable, Sequence

from sqlalchemy import and_, or_, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.asset import Asset
from app.models.fx_rate import FxRate
from app.models.holding import Holding
from app.models.latest_quote import LatestQuote
from app.models.liability import Liability
from app.models.portfolio import Portfolio
from app.models.snapshot import (
    SnapshotHoldingRow,
    SnapshotLiabilityRow,
    SnapshotPortfolioRow,
    SnapshotSet,
)
from app.models.user_setting import UserSetting
from app.services.analytics_summary import calculate_summary_values
from app.services.currency import FxCache, convert_amount


def normalize_display_currency(value: str | None) -> str:
    normalized = (value or "KRW").upper().strip()
    if normalized not in {"KRW", "USD"}:
        return "KRW"
    return normalized


def _value_by_currency(krw_value: Decimal, usd_value: Decimal, display_currency: str) -> Decimal:
    return usd_value if normalize_display_currency(display_currency) == "USD" else krw_value


def get_latest_usd_krw_fx(db: Session) -> tuple[Decimal | None, datetime | None, str | None]:
    direct = db.scalar(
        select(FxRate)
        .where(FxRate.base_currency == "USD", FxRate.quote_currency == "KRW")
        .order_by(FxRate.as_of.desc(), FxRate.id.desc())
        .limit(1)
    )
    inverse = db.scalar(
        select(FxRate)
        .where(FxRate.base_currency == "KRW", FxRate.quote_currency == "USD")
        .order_by(FxRate.as_of.desc(), FxRate.id.desc())
        .limit(1)
    )

    if direct is None and inverse is None:
        return None, None, None

    if direct is not None and (inverse is None or direct.as_of >= inverse.as_of):
        return Decimal(direct.rate), direct.as_of, direct.source

    if inverse is None or not inverse.rate:
        return None, None, None
    return Decimal("1") / Decimal(inverse.rate), inverse.as_of, f"{inverse.source} (inverse)"


def get_user_snapshot_display_currency(db: Session, user_id: int) -> str:
    setting = db.scalar(select(UserSetting).where(UserSetting.user_id == user_id))
    if setting is None:
        return "KRW"
    return normalize_display_currency(setting.display_currency)


def _holding_effective_cost_basis(holding: Holding) -> tuple[Decimal, str]:
    if holding.invested_amount is not None:
        return Decimal(holding.invested_amount), holding.invested_amount_currency
    return Decimal(holding.quantity) * Decimal(holding.avg_price), holding.avg_price_currency


def capture_user_snapshot(
    db: Session,
    *,
    owner_user_id: int,
    name: str | None,
    note: str | None,
    source_type: str = "MANUAL",
) -> SnapshotSet:
    display_currency_at_capture = get_user_snapshot_display_currency(db, owner_user_id)
    fx_cache: FxCache = {}

    summary_krw = calculate_summary_values(
        db=db,
        scope_user_ids=[owner_user_id],
        include_hidden=False,
        include_excluded_portfolios=False,
        include_excluded_liabilities=False,
        display_currency="KRW",
        fx_strict_mode=settings.fx_strict_mode,
    )
    summary_usd = calculate_summary_values(
        db=db,
        scope_user_ids=[owner_user_id],
        include_hidden=False,
        include_excluded_portfolios=False,
        include_excluded_liabilities=False,
        display_currency="USD",
        fx_strict_mode=settings.fx_strict_mode,
    )

    captured_at = datetime.now(UTC).replace(tzinfo=None)
    as_of = max(summary_krw.as_of, summary_usd.as_of)
    fx_usd_krw_rate, fx_as_of, fx_source = get_latest_usd_krw_fx(db)

    snapshot_set = SnapshotSet(
        owner_user_id=owner_user_id,
        name=(name or "").strip() or None,
        source_type=source_type,
        note=(note or "").strip() or None,
        captured_at=captured_at,
        as_of=as_of,
        display_currency_at_capture=display_currency_at_capture,
        fx_usd_krw_rate=fx_usd_krw_rate,
        fx_as_of=fx_as_of,
        fx_source=fx_source,
        gross_assets_krw=summary_krw.gross_assets_total,
        gross_assets_usd=summary_usd.gross_assets_total,
        liabilities_krw=summary_krw.liabilities_total,
        liabilities_usd=summary_usd.liabilities_total,
        net_assets_krw=summary_krw.net_assets_total,
        net_assets_usd=summary_usd.net_assets_total,
        invested_principal_krw=summary_krw.invested_principal_total,
        invested_principal_usd=summary_usd.invested_principal_total,
        debt_adjusted_principal_krw=summary_krw.principal_minus_debt_total,
        debt_adjusted_principal_usd=summary_usd.principal_minus_debt_total,
    )
    db.add(snapshot_set)
    db.flush()

    portfolios = list(
        db.scalars(
            select(Portfolio).where(
                Portfolio.owner_user_id == owner_user_id,
                Portfolio.is_hidden.is_(False),
                Portfolio.is_included.is_(True),
            )
        ).all()
    )
    portfolio_map = {portfolio.id: portfolio for portfolio in portfolios}

    holdings_rows = db.execute(
        select(Holding, Asset, Portfolio, LatestQuote)
        .join(Asset, Asset.id == Holding.asset_id)
        .outerjoin(Portfolio, Holding.portfolio_id == Portfolio.id)
        .outerjoin(LatestQuote, LatestQuote.asset_id == Holding.asset_id)
        .where(
            Holding.owner_user_id == owner_user_id,
            Holding.is_hidden.is_(False),
            or_(
                Holding.portfolio_id.is_(None),
                and_(Portfolio.is_hidden.is_(False), Portfolio.is_included.is_(True)),
            ),
        )
    ).all()

    liabilities_rows = db.execute(
        select(Liability, Portfolio)
        .outerjoin(Portfolio, Liability.portfolio_id == Portfolio.id)
        .where(
            Liability.owner_user_id == owner_user_id,
            Liability.is_hidden.is_(False),
            Liability.is_included.is_(True),
            or_(
                Liability.portfolio_id.is_(None),
                and_(Portfolio.is_hidden.is_(False), Portfolio.is_included.is_(True)),
            ),
        )
    ).all()

    gross_by_portfolio_krw: dict[int | None, Decimal] = defaultdict(lambda: Decimal("0"))
    gross_by_portfolio_usd: dict[int | None, Decimal] = defaultdict(lambda: Decimal("0"))
    liabilities_by_portfolio_krw: dict[int | None, Decimal] = defaultdict(lambda: Decimal("0"))
    liabilities_by_portfolio_usd: dict[int | None, Decimal] = defaultdict(lambda: Decimal("0"))

    holding_snapshot_rows: list[SnapshotHoldingRow] = []
    for holding, asset, portfolio, quote in holdings_rows:
        current_price = Decimal(quote.price) if quote is not None else Decimal(holding.avg_price)
        current_price_currency = (
            (quote.currency or holding.avg_price_currency) if quote is not None else holding.avg_price_currency
        )
        evaluated_raw = Decimal(holding.quantity) * current_price
        cost_basis_raw, cost_basis_currency = _holding_effective_cost_basis(holding)

        evaluated_krw = convert_amount(
            db=db,
            amount=evaluated_raw,
            from_currency=current_price_currency,
            to_currency="KRW",
            cache=fx_cache,
            strict=settings.fx_strict_mode,
        )
        evaluated_usd = convert_amount(
            db=db,
            amount=evaluated_raw,
            from_currency=current_price_currency,
            to_currency="USD",
            cache=fx_cache,
            strict=settings.fx_strict_mode,
        )
        cost_basis_krw = convert_amount(
            db=db,
            amount=cost_basis_raw,
            from_currency=cost_basis_currency,
            to_currency="KRW",
            cache=fx_cache,
            strict=settings.fx_strict_mode,
        )
        cost_basis_usd = convert_amount(
            db=db,
            amount=cost_basis_raw,
            from_currency=cost_basis_currency,
            to_currency="USD",
            cache=fx_cache,
            strict=settings.fx_strict_mode,
        )
        profit_krw = evaluated_krw - cost_basis_krw
        profit_usd = evaluated_usd - cost_basis_usd
        return_pct = None if cost_basis_krw == 0 else (profit_krw / cost_basis_krw) * Decimal("100")

        portfolio_id = holding.portfolio_id
        portfolio_name = portfolio.name if portfolio is not None else "Unassigned"
        gross_by_portfolio_krw[portfolio_id] += evaluated_krw
        gross_by_portfolio_usd[portfolio_id] += evaluated_usd

        holding_snapshot_rows.append(
            SnapshotHoldingRow(
                snapshot_id=snapshot_set.id,
                portfolio_id=portfolio_id,
                portfolio_name=portfolio_name,
                asset_id=asset.id,
                asset_name=asset.name,
                symbol=asset.symbol,
                asset_class=asset.asset_class,
                asset_currency=asset.currency,
                quantity=holding.quantity,
                current_price=current_price,
                current_price_currency=current_price_currency,
                avg_cost=holding.avg_price,
                avg_cost_currency=holding.avg_price_currency,
                evaluated_krw=evaluated_krw,
                evaluated_usd=evaluated_usd,
                cost_basis_krw=cost_basis_krw,
                cost_basis_usd=cost_basis_usd,
                profit_krw=profit_krw,
                profit_usd=profit_usd,
                return_pct=return_pct,
                quote_as_of=quote.as_of if quote is not None else None,
                quote_source=quote.source if quote is not None else None,
            )
        )

    liability_snapshot_rows: list[SnapshotLiabilityRow] = []
    for liability, portfolio in liabilities_rows:
        balance = Decimal(liability.outstanding_balance)
        balance_krw = convert_amount(
            db=db,
            amount=balance,
            from_currency=liability.currency,
            to_currency="KRW",
            cache=fx_cache,
            strict=settings.fx_strict_mode,
        )
        balance_usd = convert_amount(
            db=db,
            amount=balance,
            from_currency=liability.currency,
            to_currency="USD",
            cache=fx_cache,
            strict=settings.fx_strict_mode,
        )

        portfolio_id = liability.portfolio_id
        portfolio_name = portfolio.name if portfolio is not None else "Unassigned"
        liabilities_by_portfolio_krw[portfolio_id] += balance_krw
        liabilities_by_portfolio_usd[portfolio_id] += balance_usd

        liability_snapshot_rows.append(
            SnapshotLiabilityRow(
                snapshot_id=snapshot_set.id,
                portfolio_id=portfolio_id,
                portfolio_name=portfolio_name,
                liability_id=liability.id,
                liability_name=liability.name,
                liability_type=liability.liability_type,
                balance=balance,
                balance_currency=liability.currency,
                balance_krw=balance_krw,
                balance_usd=balance_usd,
            )
        )

    portfolio_snapshot_rows: list[SnapshotPortfolioRow] = []
    all_portfolio_keys = set(portfolio_map.keys()) | set(gross_by_portfolio_krw.keys()) | set(liabilities_by_portfolio_krw.keys())

    for portfolio_key in all_portfolio_keys:
        portfolio = portfolio_map.get(portfolio_key) if portfolio_key is not None else None
        portfolio_name = portfolio.name if portfolio is not None else "Unassigned"
        portfolio_type = portfolio.type if portfolio is not None else None
        base_currency = portfolio.base_currency if portfolio is not None else None

        gross_krw = gross_by_portfolio_krw.get(portfolio_key, Decimal("0"))
        gross_usd = gross_by_portfolio_usd.get(portfolio_key, Decimal("0"))
        liabilities_krw = liabilities_by_portfolio_krw.get(portfolio_key, Decimal("0"))
        liabilities_usd = liabilities_by_portfolio_usd.get(portfolio_key, Decimal("0"))
        net_krw = gross_krw - liabilities_krw
        net_usd = gross_usd - liabilities_usd

        if portfolio is None:
            invested_principal_krw = Decimal("0")
            invested_principal_usd = Decimal("0")
            withdraw_krw = Decimal("0")
            withdraw_usd = Decimal("0")
        else:
            invested_principal_krw = convert_amount(
                db=db,
                amount=Decimal(portfolio.cumulative_deposit_amount),
                from_currency=portfolio.base_currency,
                to_currency="KRW",
                cache=fx_cache,
                strict=settings.fx_strict_mode,
            )
            invested_principal_usd = convert_amount(
                db=db,
                amount=Decimal(portfolio.cumulative_deposit_amount),
                from_currency=portfolio.base_currency,
                to_currency="USD",
                cache=fx_cache,
                strict=settings.fx_strict_mode,
            )
            withdraw_krw = convert_amount(
                db=db,
                amount=Decimal(portfolio.cumulative_withdrawal_amount),
                from_currency=portfolio.base_currency,
                to_currency="KRW",
                cache=fx_cache,
                strict=settings.fx_strict_mode,
            )
            withdraw_usd = convert_amount(
                db=db,
                amount=Decimal(portfolio.cumulative_withdrawal_amount),
                from_currency=portfolio.base_currency,
                to_currency="USD",
                cache=fx_cache,
                strict=settings.fx_strict_mode,
            )

        net_contribution_krw = invested_principal_krw - withdraw_krw
        net_contribution_usd = invested_principal_usd - withdraw_usd
        debt_adjusted_principal_krw = invested_principal_krw - liabilities_krw
        debt_adjusted_principal_usd = invested_principal_usd - liabilities_usd
        portfolio_profit_krw = gross_krw + withdraw_krw - invested_principal_krw
        portfolio_profit_usd = gross_usd + withdraw_usd - invested_principal_usd
        return_pct = None if invested_principal_krw == 0 else (portfolio_profit_krw / invested_principal_krw) * Decimal("100")

        portfolio_snapshot_rows.append(
            SnapshotPortfolioRow(
                snapshot_id=snapshot_set.id,
                portfolio_id=portfolio_key,
                portfolio_name=portfolio_name,
                portfolio_type=portfolio_type,
                base_currency=base_currency,
                gross_assets_krw=gross_krw,
                gross_assets_usd=gross_usd,
                liabilities_krw=liabilities_krw,
                liabilities_usd=liabilities_usd,
                net_assets_krw=net_krw,
                net_assets_usd=net_usd,
                invested_principal_krw=invested_principal_krw,
                invested_principal_usd=invested_principal_usd,
                debt_adjusted_principal_krw=debt_adjusted_principal_krw,
                debt_adjusted_principal_usd=debt_adjusted_principal_usd,
                portfolio_profit_krw=portfolio_profit_krw,
                portfolio_profit_usd=portfolio_profit_usd,
                return_pct=return_pct,
                net_contribution_krw=net_contribution_krw,
                net_contribution_usd=net_contribution_usd,
            )
        )

    db.add_all(portfolio_snapshot_rows)
    db.add_all(holding_snapshot_rows)
    db.add_all(liability_snapshot_rows)
    return snapshot_set


def snapshot_summary_dict(snapshot: SnapshotSet) -> dict[str, object]:
    return {
        "id": snapshot.id,
        "owner_user_id": snapshot.owner_user_id,
        "name": snapshot.name,
        "source_type": snapshot.source_type,
        "note": snapshot.note,
        "captured_at": snapshot.captured_at,
        "as_of": snapshot.as_of,
        "display_currency_at_capture": snapshot.display_currency_at_capture,
        "fx_usd_krw_rate": snapshot.fx_usd_krw_rate,
        "fx_as_of": snapshot.fx_as_of,
        "fx_source": snapshot.fx_source,
        "gross_assets_krw": snapshot.gross_assets_krw,
        "gross_assets_usd": snapshot.gross_assets_usd,
        "liabilities_krw": snapshot.liabilities_krw,
        "liabilities_usd": snapshot.liabilities_usd,
        "net_assets_krw": snapshot.net_assets_krw,
        "net_assets_usd": snapshot.net_assets_usd,
        "invested_principal_krw": snapshot.invested_principal_krw,
        "invested_principal_usd": snapshot.invested_principal_usd,
        "debt_adjusted_principal_krw": snapshot.debt_adjusted_principal_krw,
        "debt_adjusted_principal_usd": snapshot.debt_adjusted_principal_usd,
        "created_at": snapshot.created_at,
    }


def to_snapshot_portfolio_row_dict(row: SnapshotPortfolioRow, display_currency: str) -> dict[str, object]:
    return {
        "id": row.id,
        "snapshot_id": row.snapshot_id,
        "portfolio_id": row.portfolio_id,
        "portfolio_name": row.portfolio_name,
        "portfolio_type": row.portfolio_type,
        "base_currency": row.base_currency,
        "current": _value_by_currency(row.gross_assets_krw, row.gross_assets_usd, display_currency),
        "invested_principal": _value_by_currency(row.invested_principal_krw, row.invested_principal_usd, display_currency),
        "portfolio_profit": _value_by_currency(row.portfolio_profit_krw, row.portfolio_profit_usd, display_currency),
        "return_pct": row.return_pct,
        "net_contribution": _value_by_currency(row.net_contribution_krw, row.net_contribution_usd, display_currency),
        "liabilities": _value_by_currency(row.liabilities_krw, row.liabilities_usd, display_currency),
        "net_assets": _value_by_currency(row.net_assets_krw, row.net_assets_usd, display_currency),
        "debt_adjusted_principal": _value_by_currency(
            row.debt_adjusted_principal_krw, row.debt_adjusted_principal_usd, display_currency
        ),
    }


def to_snapshot_holding_row_dict(row: SnapshotHoldingRow, display_currency: str) -> dict[str, object]:
    return {
        "id": row.id,
        "snapshot_id": row.snapshot_id,
        "portfolio_id": row.portfolio_id,
        "portfolio_name": row.portfolio_name,
        "asset_id": row.asset_id,
        "asset_name": row.asset_name,
        "symbol": row.symbol,
        "asset_class": row.asset_class,
        "asset_currency": row.asset_currency,
        "quantity": row.quantity,
        "price": row.current_price,
        "price_currency": row.current_price_currency,
        "avg_cost": row.avg_cost,
        "avg_cost_currency": row.avg_cost_currency,
        "evaluated": _value_by_currency(row.evaluated_krw, row.evaluated_usd, display_currency),
        "cost_basis": _value_by_currency(row.cost_basis_krw, row.cost_basis_usd, display_currency),
        "profit": _value_by_currency(row.profit_krw, row.profit_usd, display_currency),
        "return_pct": row.return_pct,
        "quote_as_of": row.quote_as_of,
        "quote_source": row.quote_source,
    }


def to_snapshot_liability_row_dict(row: SnapshotLiabilityRow, display_currency: str) -> dict[str, object]:
    return {
        "id": row.id,
        "snapshot_id": row.snapshot_id,
        "portfolio_id": row.portfolio_id,
        "portfolio_name": row.portfolio_name,
        "liability_id": row.liability_id,
        "liability_name": row.liability_name,
        "liability_type": row.liability_type,
        "balance": _value_by_currency(row.balance_krw, row.balance_usd, display_currency),
        "balance_currency": normalize_display_currency(display_currency),
    }


def parse_id_csv(csv_value: str | None) -> list[int]:
    if not csv_value:
        return []
    result: list[int] = []
    for token in csv_value.split(","):
        value = token.strip()
        if not value:
            continue
        parsed = int(value)
        if parsed not in result:
            result.append(parsed)
    return result


def build_snapshot_csv_text(
    snapshot: SnapshotSet,
    portfolio_rows: Sequence[SnapshotPortfolioRow],
    holding_rows: Sequence[SnapshotHoldingRow],
    liability_rows: Sequence[SnapshotLiabilityRow],
) -> str:
    headers = [
        "record_type",
        "snapshot_id",
        "captured_at",
        "as_of",
        "display_currency_at_capture",
        "portfolio_id",
        "portfolio_name",
        "portfolio_type",
        "asset_id",
        "asset_name",
        "symbol",
        "asset_class",
        "liability_id",
        "liability_name",
        "liability_type",
        "quantity",
        "price",
        "price_currency",
        "avg_cost",
        "avg_cost_currency",
        "evaluated_krw",
        "evaluated_usd",
        "cost_basis_krw",
        "cost_basis_usd",
        "profit_krw",
        "profit_usd",
        "return_pct",
        "balance",
        "balance_currency",
        "balance_krw",
        "balance_usd",
        "gross_assets_krw",
        "gross_assets_usd",
        "liabilities_krw",
        "liabilities_usd",
        "net_assets_krw",
        "net_assets_usd",
        "invested_principal_krw",
        "invested_principal_usd",
        "debt_adjusted_principal_krw",
        "debt_adjusted_principal_usd",
        "net_contribution_krw",
        "net_contribution_usd",
        "fx_usd_krw_rate",
        "fx_as_of",
        "fx_source",
    ]

    buffer = StringIO()
    writer = csv.DictWriter(buffer, fieldnames=headers)
    writer.writeheader()

    writer.writerow(
        {
            "record_type": "SUMMARY",
            "snapshot_id": snapshot.id,
            "captured_at": snapshot.captured_at.isoformat(sep=" "),
            "as_of": snapshot.as_of.isoformat(sep=" "),
            "display_currency_at_capture": snapshot.display_currency_at_capture,
            "gross_assets_krw": snapshot.gross_assets_krw,
            "gross_assets_usd": snapshot.gross_assets_usd,
            "liabilities_krw": snapshot.liabilities_krw,
            "liabilities_usd": snapshot.liabilities_usd,
            "net_assets_krw": snapshot.net_assets_krw,
            "net_assets_usd": snapshot.net_assets_usd,
            "invested_principal_krw": snapshot.invested_principal_krw,
            "invested_principal_usd": snapshot.invested_principal_usd,
            "debt_adjusted_principal_krw": snapshot.debt_adjusted_principal_krw,
            "debt_adjusted_principal_usd": snapshot.debt_adjusted_principal_usd,
            "fx_usd_krw_rate": snapshot.fx_usd_krw_rate,
            "fx_as_of": snapshot.fx_as_of.isoformat(sep=" ") if snapshot.fx_as_of else "",
            "fx_source": snapshot.fx_source or "",
        }
    )

    for row in portfolio_rows:
        writer.writerow(
            {
                "record_type": "PORTFOLIO",
                "snapshot_id": row.snapshot_id,
                "captured_at": snapshot.captured_at.isoformat(sep=" "),
                "as_of": snapshot.as_of.isoformat(sep=" "),
                "display_currency_at_capture": snapshot.display_currency_at_capture,
                "portfolio_id": row.portfolio_id,
                "portfolio_name": row.portfolio_name,
                "portfolio_type": row.portfolio_type,
                "gross_assets_krw": row.gross_assets_krw,
                "gross_assets_usd": row.gross_assets_usd,
                "liabilities_krw": row.liabilities_krw,
                "liabilities_usd": row.liabilities_usd,
                "net_assets_krw": row.net_assets_krw,
                "net_assets_usd": row.net_assets_usd,
                "invested_principal_krw": row.invested_principal_krw,
                "invested_principal_usd": row.invested_principal_usd,
                "debt_adjusted_principal_krw": row.debt_adjusted_principal_krw,
                "debt_adjusted_principal_usd": row.debt_adjusted_principal_usd,
                "profit_krw": row.portfolio_profit_krw,
                "profit_usd": row.portfolio_profit_usd,
                "return_pct": row.return_pct,
                "net_contribution_krw": row.net_contribution_krw,
                "net_contribution_usd": row.net_contribution_usd,
            }
        )

    for row in holding_rows:
        writer.writerow(
            {
                "record_type": "HOLDING",
                "snapshot_id": row.snapshot_id,
                "captured_at": snapshot.captured_at.isoformat(sep=" "),
                "as_of": snapshot.as_of.isoformat(sep=" "),
                "display_currency_at_capture": snapshot.display_currency_at_capture,
                "portfolio_id": row.portfolio_id,
                "portfolio_name": row.portfolio_name,
                "asset_id": row.asset_id,
                "asset_name": row.asset_name,
                "symbol": row.symbol,
                "asset_class": row.asset_class,
                "quantity": row.quantity,
                "price": row.current_price,
                "price_currency": row.current_price_currency,
                "avg_cost": row.avg_cost,
                "avg_cost_currency": row.avg_cost_currency,
                "evaluated_krw": row.evaluated_krw,
                "evaluated_usd": row.evaluated_usd,
                "cost_basis_krw": row.cost_basis_krw,
                "cost_basis_usd": row.cost_basis_usd,
                "profit_krw": row.profit_krw,
                "profit_usd": row.profit_usd,
                "return_pct": row.return_pct,
            }
        )

    for row in liability_rows:
        writer.writerow(
            {
                "record_type": "LIABILITY",
                "snapshot_id": row.snapshot_id,
                "captured_at": snapshot.captured_at.isoformat(sep=" "),
                "as_of": snapshot.as_of.isoformat(sep=" "),
                "display_currency_at_capture": snapshot.display_currency_at_capture,
                "portfolio_id": row.portfolio_id,
                "portfolio_name": row.portfolio_name,
                "liability_id": row.liability_id,
                "liability_name": row.liability_name,
                "liability_type": row.liability_type,
                "balance": row.balance,
                "balance_currency": row.balance_currency,
                "balance_krw": row.balance_krw,
                "balance_usd": row.balance_usd,
            }
        )

    return buffer.getvalue()


def normalize_decimal(value: str | Decimal | int | float | None) -> Decimal:
    if value is None:
        return Decimal("0")
    if isinstance(value, Decimal):
        return value
    value_text = str(value).strip()
    if value_text == "":
        return Decimal("0")
    return Decimal(value_text)


def filter_snapshot_ids_for_user(db: Session, owner_user_id: int, snapshot_ids: Iterable[int]) -> list[int]:
    ids = [snapshot_id for snapshot_id in snapshot_ids if snapshot_id > 0]
    if not ids:
        return []
    rows = db.scalars(
        select(SnapshotSet.id).where(SnapshotSet.owner_user_id == owner_user_id, SnapshotSet.id.in_(ids))
    ).all()
    allowed = set(rows)
    return [snapshot_id for snapshot_id in ids if snapshot_id in allowed]
