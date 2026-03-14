from dataclasses import dataclass
from datetime import UTC, datetime
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.asset import Asset
from app.models.holding import Holding
from app.models.liability import Liability
from app.models.portfolio import Portfolio
from app.models.transaction import Transaction
from app.schemas.entity_change import (
    HoldingRebaselineIn,
    LiabilityRebaselineIn,
    PortfolioRebaselineIn,
)
from app.services.trade_ledger import (
    TradeSyncError,
    normalize_trade_payload,
    rebuild_cash_holdings_for_portfolio,
    rebuild_portfolio_cashflow,
    sync_single_trade_scope,
)


_HOLDING_TXN_TYPES = ("BUY", "SELL")
_PORTFOLIO_TXN_TYPES = ("DEPOSIT", "WITHDRAW")
_LIABILITY_PRINCIPAL_TXN_TYPES = ("LOAN_BORROW", "LOAN_REPAY")


class RebaselineConflictError(Exception):
    pass


@dataclass
class RebaselineResult:
    voided_transactions: int
    baseline_transaction_ids: list[int]
    affected_scope: str


def normalize_effective_at(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value
    return value.astimezone(UTC).replace(tzinfo=None)


def _is_cash_balance_asset(asset: Asset | None) -> bool:
    if asset is None:
        return False
    meta = asset.meta_json if isinstance(asset.meta_json, dict) else {}
    subtype = str(meta.get("asset_subtype") or "").upper()
    if subtype == "CASH_BALANCE":
        return True
    symbol = (asset.symbol or "").upper()
    return symbol.startswith("CASH_")


def _void_txns(txns: list[Transaction]) -> int:
    count = 0
    for txn in txns:
        if txn.status == "POSTED":
            txn.status = "VOID"
            count += 1
    return count


def rebaseline_holding(
    db: Session,
    *,
    owner_user_id: int,
    holding: Holding,
    payload: HoldingRebaselineIn,
    strict_fx: bool,
) -> RebaselineResult:
    if holding.portfolio_id is None:
        raise TradeSyncError("Holding rebaseline requires portfolio-linked holding")
    asset = db.scalar(select(Asset).where(Asset.id == holding.asset_id))
    if _is_cash_balance_asset(asset):
        raise TradeSyncError(
            "Cash balance holding is ledger-derived. "
            "Use DEPOSIT/WITHDRAW/ADJUSTMENT/BALANCE_SET or portfolio rebaseline for cash correction."
        )

    effective_at = normalize_effective_at(payload.effective_at)
    txns_stmt = select(Transaction).where(
        Transaction.owner_user_id == owner_user_id,
        Transaction.portfolio_id == holding.portfolio_id,
        Transaction.asset_id == holding.asset_id,
        Transaction.status == "POSTED",
        Transaction.txn_type.in_(_HOLDING_TXN_TYPES),
    )
    if not payload.rebaseline_all_history:
        txns_stmt = txns_stmt.where(Transaction.executed_at <= effective_at)
    txns = list(db.scalars(txns_stmt).all())
    voided = _void_txns(txns)

    quantity = Decimal(payload.quantity)
    avg_price = Decimal(payload.avg_price)
    invested_amount = (
        Decimal(payload.invested_amount)
        if payload.invested_amount is not None
        else (avg_price * quantity)
    )
    if quantity < 0 or avg_price < 0 or invested_amount < 0:
        raise TradeSyncError("Rebaseline values must be non-negative")

    baseline_ids: list[int] = []
    if quantity > 0 and invested_amount > 0:
        unit_price = invested_amount / quantity
        normalized = normalize_trade_payload(
            db=db,
            owner_user_id=owner_user_id,
            payload={
                "portfolio_id": holding.portfolio_id,
                "txn_type": "BUY",
                "asset_id": holding.asset_id,
                "liability_id": None,
                "quantity": str(quantity),
                "unit_price": str(unit_price),
                "amount": str(invested_amount),
                "currency": (payload.invested_amount_currency or payload.avg_price_currency).upper(),
                "executed_at": effective_at,
                "memo": f"REBASELINE holding_id={holding.id}",
                "source_type": "AUTO",
                "auto_apply_cash_holding": True,
                "auto_apply_portfolio_cashflow": False,
            },
            strict_fx=strict_fx,
        )
        baseline_txn = Transaction(owner_user_id=owner_user_id, **normalized)
        db.add(baseline_txn)
        db.flush()
        baseline_ids.append(int(baseline_txn.id))

    # Session maker uses autoflush=False; flush before rebuilding from queries.
    db.flush()

    try:
        sync_single_trade_scope(
            db=db,
            owner_user_id=owner_user_id,
            portfolio_id=holding.portfolio_id,
            asset_id=holding.asset_id,
            liability_id=None,
        )
    except TradeSyncError as exc:
        raise RebaselineConflictError(str(exc)) from exc

    return RebaselineResult(
        voided_transactions=voided,
        baseline_transaction_ids=baseline_ids,
        affected_scope=f"portfolio:{holding.portfolio_id}/asset:{holding.asset_id}",
    )


def rebaseline_portfolio(
    db: Session,
    *,
    owner_user_id: int,
    portfolio: Portfolio,
    payload: PortfolioRebaselineIn,
    strict_fx: bool,
) -> RebaselineResult:
    effective_at = normalize_effective_at(payload.effective_at)
    txns_stmt = select(Transaction).where(
        Transaction.owner_user_id == owner_user_id,
        Transaction.portfolio_id == portfolio.id,
        Transaction.status == "POSTED",
        Transaction.txn_type.in_(_PORTFOLIO_TXN_TYPES),
    )
    if not payload.rebaseline_all_history:
        txns_stmt = txns_stmt.where(Transaction.executed_at <= effective_at)
    txns = list(db.scalars(txns_stmt).all())
    voided = _void_txns(txns)

    deposit_amount = Decimal(payload.cumulative_deposit_amount)
    withdraw_amount = Decimal(payload.cumulative_withdrawal_amount)
    if deposit_amount < 0 or withdraw_amount < 0:
        raise TradeSyncError("Portfolio rebaseline values must be non-negative")

    baseline_ids: list[int] = []
    if deposit_amount > 0:
        normalized_deposit = normalize_trade_payload(
            db=db,
            owner_user_id=owner_user_id,
            payload={
                "portfolio_id": portfolio.id,
                "txn_type": "DEPOSIT",
                "amount": str(deposit_amount),
                "currency": portfolio.base_currency,
                "executed_at": effective_at,
                "memo": f"REBASELINE portfolio_deposit portfolio_id={portfolio.id}",
                "source_type": "AUTO",
                "auto_apply_cash_holding": True,
                "auto_apply_portfolio_cashflow": True,
            },
            strict_fx=strict_fx,
        )
        deposit_txn = Transaction(owner_user_id=owner_user_id, **normalized_deposit)
        db.add(deposit_txn)
        db.flush()
        baseline_ids.append(int(deposit_txn.id))

    if withdraw_amount > 0:
        normalized_withdraw = normalize_trade_payload(
            db=db,
            owner_user_id=owner_user_id,
            payload={
                "portfolio_id": portfolio.id,
                "txn_type": "WITHDRAW",
                "amount": str(withdraw_amount),
                "currency": portfolio.base_currency,
                "executed_at": effective_at,
                "memo": f"REBASELINE portfolio_withdraw portfolio_id={portfolio.id}",
                "source_type": "AUTO",
                "auto_apply_cash_holding": True,
                "auto_apply_portfolio_cashflow": True,
            },
            strict_fx=strict_fx,
        )
        withdraw_txn = Transaction(owner_user_id=owner_user_id, **normalized_withdraw)
        db.add(withdraw_txn)
        db.flush()
        baseline_ids.append(int(withdraw_txn.id))

    # Session maker uses autoflush=False; flush before rebuilding from queries.
    db.flush()

    try:
        # Rebaseline 결과를 있는 그대로 반영해야 하므로,
        # portfolio cashflow baseline 자동 생성 경로를 우회하고
        # 집계 재계산만 수행한다.
        rebuild_portfolio_cashflow(
            db,
            owner_user_id=owner_user_id,
            portfolio_id=portfolio.id,
        )
        rebuild_cash_holdings_for_portfolio(
            db,
            owner_user_id=owner_user_id,
            portfolio_id=portfolio.id,
        )
    except TradeSyncError as exc:
        raise RebaselineConflictError(str(exc)) from exc

    return RebaselineResult(
        voided_transactions=voided,
        baseline_transaction_ids=baseline_ids,
        affected_scope=f"portfolio:{portfolio.id}",
    )


def rebaseline_liability(
    db: Session,
    *,
    owner_user_id: int,
    liability: Liability,
    payload: LiabilityRebaselineIn,
    strict_fx: bool,
) -> RebaselineResult:
    if liability.portfolio_id is None:
        raise TradeSyncError("Liability rebaseline requires portfolio-linked liability")

    effective_at = normalize_effective_at(payload.effective_at)
    txns_stmt = select(Transaction).where(
        Transaction.owner_user_id == owner_user_id,
        Transaction.liability_id == liability.id,
        Transaction.status == "POSTED",
        Transaction.txn_type.in_(_LIABILITY_PRINCIPAL_TXN_TYPES),
    )
    if not payload.rebaseline_all_history:
        txns_stmt = txns_stmt.where(Transaction.executed_at <= effective_at)
    txns = list(db.scalars(txns_stmt).all())
    voided = _void_txns(txns)

    balance = Decimal(payload.outstanding_balance)
    if balance < 0:
        raise TradeSyncError("Liability outstanding balance must be non-negative")

    baseline_ids: list[int] = []
    if balance > 0:
        normalized = normalize_trade_payload(
            db=db,
            owner_user_id=owner_user_id,
            payload={
                "portfolio_id": liability.portfolio_id,
                "txn_type": "LOAN_BORROW",
                "asset_id": None,
                "liability_id": liability.id,
                "amount": str(balance),
                "currency": liability.currency,
                "executed_at": effective_at,
                "memo": f"REBASELINE liability_id={liability.id}",
                "source_type": "AUTO",
                "auto_apply_cash_holding": False,
                "auto_apply_portfolio_cashflow": False,
            },
            strict_fx=strict_fx,
        )
        baseline_txn = Transaction(owner_user_id=owner_user_id, **normalized)
        db.add(baseline_txn)
        db.flush()
        baseline_ids.append(int(baseline_txn.id))

    # Session maker uses autoflush=False; flush before rebuilding from queries.
    db.flush()

    try:
        sync_single_trade_scope(
            db=db,
            owner_user_id=owner_user_id,
            portfolio_id=liability.portfolio_id,
            asset_id=None,
            liability_id=liability.id,
        )
    except TradeSyncError as exc:
        raise RebaselineConflictError(str(exc)) from exc

    return RebaselineResult(
        voided_transactions=voided,
        baseline_transaction_ids=baseline_ids,
        affected_scope=f"portfolio:{liability.portfolio_id}/liability:{liability.id}",
    )
