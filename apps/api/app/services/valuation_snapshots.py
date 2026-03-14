from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
from datetime import UTC, date, datetime
from decimal import Decimal

from sqlalchemy import and_, or_, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.asset import Asset
from app.models.household import Household, HouseholdMember
from app.models.holding import Holding
from app.models.latest_quote import LatestQuote
from app.models.liability import Liability
from app.models.portfolio import Portfolio
from app.models.user import User
from app.models.valuation_snapshot import (
    ValuationSnapshot,
    ValuationSnapshotHoldingRow,
    ValuationSnapshotLiabilityRow,
    ValuationSnapshotPortfolioRow,
)
from app.services.analytics_summary import calculate_summary_values
from app.services.currency import FxCache, MissingFxRateError, convert_amount


@dataclass
class SnapshotCollectResult:
    snapshot_date: date
    display_currency: str
    user_scopes_collected: int
    household_scopes_collected: int
    upserted_rows: int


def _holding_effective_cost_basis(holding: Holding) -> tuple[Decimal, str]:
    invested = Decimal(holding.invested_amount) if holding.invested_amount is not None else None
    fallback_cost = Decimal(holding.quantity) * Decimal(holding.avg_price)

    if invested is not None:
        if invested > 0:
            return invested, holding.invested_amount_currency
        if invested == 0 and fallback_cost > 0:
            return fallback_cost, holding.avg_price_currency
        return invested, holding.invested_amount_currency

    return fallback_cost, holding.avg_price_currency


def _upsert_snapshot(
    db: Session,
    *,
    scope_type_value: str,
    scope_id_value: int,
    target_currency: str,
    target_date: date,
    as_of: datetime,
    gross: Decimal,
    debt: Decimal,
    net: Decimal,
) -> ValuationSnapshot:
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
        db.flush()
    else:
        row.assets_total = gross
        row.liabilities_total = debt
        row.net_worth_total = net
        row.as_of = as_of
        row.source = "SYSTEM_BATCH"
        db.flush()
    return row


def _replace_detail_rows(
    db: Session,
    *,
    snapshot: ValuationSnapshot,
    scope_user_ids: list[int],
    target_currency: str,
) -> None:
    db.query(ValuationSnapshotHoldingRow).filter(
        ValuationSnapshotHoldingRow.valuation_snapshot_id == snapshot.id
    ).delete(synchronize_session=False)
    db.query(ValuationSnapshotLiabilityRow).filter(
        ValuationSnapshotLiabilityRow.valuation_snapshot_id == snapshot.id
    ).delete(synchronize_session=False)
    db.query(ValuationSnapshotPortfolioRow).filter(
        ValuationSnapshotPortfolioRow.valuation_snapshot_id == snapshot.id
    ).delete(synchronize_session=False)

    fx_cache: FxCache = {}
    gross_by_portfolio: dict[int | None, Decimal] = defaultdict(lambda: Decimal("0"))
    liabilities_by_portfolio: dict[int | None, Decimal] = defaultdict(lambda: Decimal("0"))

    portfolios = list(
        db.scalars(
            select(Portfolio).where(
                Portfolio.owner_user_id.in_(scope_user_ids),
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
            Holding.owner_user_id.in_(scope_user_ids),
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
            Liability.owner_user_id.in_(scope_user_ids),
            Liability.is_hidden.is_(False),
            Liability.is_included.is_(True),
            or_(
                Liability.portfolio_id.is_(None),
                and_(Portfolio.is_hidden.is_(False), Portfolio.is_included.is_(True)),
            ),
        )
    ).all()

    holding_detail_rows: list[ValuationSnapshotHoldingRow] = []
    for holding, asset, portfolio, quote in holdings_rows:
        current_price = Decimal(quote.price) if quote is not None else Decimal(holding.avg_price)
        current_price_currency = (
            (quote.currency or holding.avg_price_currency) if quote is not None else holding.avg_price_currency
        )
        evaluated_raw = Decimal(holding.quantity) * current_price
        cost_basis_raw, cost_basis_currency = _holding_effective_cost_basis(holding)

        evaluated_total = convert_amount(
            db=db,
            amount=evaluated_raw,
            from_currency=current_price_currency,
            to_currency=target_currency,
            cache=fx_cache,
            strict=settings.fx_strict_mode,
        )
        cost_basis_total = convert_amount(
            db=db,
            amount=cost_basis_raw,
            from_currency=cost_basis_currency,
            to_currency=target_currency,
            cache=fx_cache,
            strict=settings.fx_strict_mode,
        )
        profit_total = evaluated_total - cost_basis_total
        return_pct = None if cost_basis_total == 0 else (profit_total / cost_basis_total) * Decimal("100")

        portfolio_id = holding.portfolio_id
        portfolio_name = portfolio.name if portfolio is not None else "Unassigned"
        gross_by_portfolio[portfolio_id] += evaluated_total

        holding_detail_rows.append(
            ValuationSnapshotHoldingRow(
                valuation_snapshot_id=snapshot.id,
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
                evaluated_amount=evaluated_total,
                cost_basis_total=cost_basis_total,
                profit_total=profit_total,
                return_pct=return_pct,
                quote_as_of=quote.as_of if quote is not None else None,
                quote_source=quote.source if quote is not None else None,
            )
        )

    liability_detail_rows: list[ValuationSnapshotLiabilityRow] = []
    for liability, portfolio in liabilities_rows:
        balance = Decimal(liability.outstanding_balance)
        balance_total = convert_amount(
            db=db,
            amount=balance,
            from_currency=liability.currency,
            to_currency=target_currency,
            cache=fx_cache,
            strict=settings.fx_strict_mode,
        )

        portfolio_id = liability.portfolio_id
        portfolio_name = portfolio.name if portfolio is not None else "Unassigned"
        liabilities_by_portfolio[portfolio_id] += balance_total

        liability_detail_rows.append(
            ValuationSnapshotLiabilityRow(
                valuation_snapshot_id=snapshot.id,
                portfolio_id=portfolio_id,
                portfolio_name=portfolio_name,
                liability_id=liability.id,
                liability_name=liability.name,
                liability_type=liability.liability_type,
                balance=balance,
                balance_currency=liability.currency,
                balance_total=balance_total,
            )
        )

    portfolio_detail_rows: list[ValuationSnapshotPortfolioRow] = []
    all_portfolio_keys = (
        set(portfolio_map.keys()) | set(gross_by_portfolio.keys()) | set(liabilities_by_portfolio.keys())
    )

    for portfolio_key in all_portfolio_keys:
        portfolio = portfolio_map.get(portfolio_key) if portfolio_key is not None else None
        portfolio_name = portfolio.name if portfolio is not None else "Unassigned"
        portfolio_type = portfolio.type if portfolio is not None else None
        base_currency = portfolio.base_currency if portfolio is not None else None

        gross_total = gross_by_portfolio.get(portfolio_key, Decimal("0"))
        liabilities_total = liabilities_by_portfolio.get(portfolio_key, Decimal("0"))
        net_total = gross_total - liabilities_total

        if portfolio is None:
            invested_principal_total = Decimal("0")
            withdrawal_total = Decimal("0")
        else:
            invested_principal_total = convert_amount(
                db=db,
                amount=Decimal(portfolio.cumulative_deposit_amount),
                from_currency=portfolio.base_currency,
                to_currency=target_currency,
                cache=fx_cache,
                strict=settings.fx_strict_mode,
            )
            withdrawal_total = convert_amount(
                db=db,
                amount=Decimal(portfolio.cumulative_withdrawal_amount),
                from_currency=portfolio.base_currency,
                to_currency=target_currency,
                cache=fx_cache,
                strict=settings.fx_strict_mode,
            )

        net_contribution_total = invested_principal_total - withdrawal_total
        debt_adjusted_principal_total = invested_principal_total - liabilities_total
        portfolio_profit_total = gross_total + withdrawal_total - invested_principal_total
        return_pct = (
            None
            if invested_principal_total == 0
            else (portfolio_profit_total / invested_principal_total) * Decimal("100")
        )

        portfolio_detail_rows.append(
            ValuationSnapshotPortfolioRow(
                valuation_snapshot_id=snapshot.id,
                portfolio_id=portfolio_key,
                portfolio_name=portfolio_name,
                portfolio_type=portfolio_type,
                base_currency=base_currency,
                gross_assets_total=gross_total,
                liabilities_total=liabilities_total,
                net_assets_total=net_total,
                invested_principal_total=invested_principal_total,
                debt_adjusted_principal_total=debt_adjusted_principal_total,
                net_contribution_total=net_contribution_total,
                portfolio_profit_total=portfolio_profit_total,
                return_pct=return_pct,
            )
        )

    if portfolio_detail_rows:
        db.add_all(portfolio_detail_rows)
    if holding_detail_rows:
        db.add_all(holding_detail_rows)
    if liability_detail_rows:
        db.add_all(liability_detail_rows)


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
                snapshot = _upsert_snapshot(
                    db=db,
                    scope_type_value="USER",
                    scope_id_value=int(user_id),
                    target_currency=target_currency,
                    target_date=target_date,
                    as_of=values.as_of,
                    gross=values.gross_assets_total,
                    debt=values.liabilities_total,
                    net=values.net_assets_total,
                )
                _replace_detail_rows(
                    db=db,
                    snapshot=snapshot,
                    scope_user_ids=[int(user_id)],
                    target_currency=target_currency,
                )
            except MissingFxRateError:
                continue
            upserted_rows += 1
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
                member_scope_ids = [int(member_id) for member_id in member_ids]
                snapshot = _upsert_snapshot(
                    db=db,
                    scope_type_value="HOUSEHOLD",
                    scope_id_value=int(household_id),
                    target_currency=target_currency,
                    target_date=target_date,
                    as_of=values.as_of,
                    gross=values.gross_assets_total,
                    debt=values.liabilities_total,
                    net=values.net_assets_total,
                )
                _replace_detail_rows(
                    db=db,
                    snapshot=snapshot,
                    scope_user_ids=member_scope_ids,
                    target_currency=target_currency,
                )
            except MissingFxRateError:
                continue
            upserted_rows += 1
            household_scopes_collected += 1

    db.commit()

    return SnapshotCollectResult(
        snapshot_date=target_date,
        display_currency=target_currency,
        user_scopes_collected=user_scopes_collected,
        household_scopes_collected=household_scopes_collected,
        upserted_rows=upserted_rows,
    )
