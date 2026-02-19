from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime
from decimal import Decimal, ROUND_HALF_UP

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.asset import Asset
from app.models.fx_rate import FxRate
from app.models.holding import Holding
from app.models.latest_quote import LatestQuote
from app.models.portfolio import Portfolio
from app.models.transaction import Transaction
from app.services.currency import MissingFxRateError

_MONEY_Q = Decimal("0.01")
_PRICE_Q = Decimal("0.00000001")
_QTY_Q = Decimal("0.00000001")


class TradeSyncError(RuntimeError):
    pass


@dataclass
class RebuildResult:
    affected_portfolios: int
    affected_holdings: int


def _quantize_money(value: Decimal) -> Decimal:
    return value.quantize(_MONEY_Q, rounding=ROUND_HALF_UP)


def _quantize_price(value: Decimal) -> Decimal:
    return value.quantize(_PRICE_Q, rounding=ROUND_HALF_UP)


def _quantize_qty(value: Decimal) -> Decimal:
    return value.quantize(_QTY_Q, rounding=ROUND_HALF_UP)


def _normalize_currency(value: str | None, default: str = "KRW") -> str:
    normalized = (value or default).upper().strip()
    return normalized or default


def _validate_positive(value: Decimal | None, field_name: str) -> Decimal:
    if value is None:
        raise TradeSyncError(f"{field_name} is required")
    if value <= 0:
        raise TradeSyncError(f"{field_name} must be > 0")
    return value


def _get_owned_portfolio(db: Session, owner_user_id: int, portfolio_id: int) -> Portfolio:
    portfolio = db.scalar(
        select(Portfolio).where(
            Portfolio.id == portfolio_id,
            Portfolio.owner_user_id == owner_user_id,
        )
    )
    if portfolio is None:
        raise TradeSyncError("Portfolio does not exist")
    return portfolio


def _get_asset(db: Session, asset_id: int | None) -> Asset | None:
    if asset_id is None:
        return None
    return db.scalar(select(Asset).where(Asset.id == asset_id))


def _is_cash_balance_asset(asset: Asset) -> bool:
    meta = asset.meta_json if isinstance(asset.meta_json, dict) else {}
    subtype = str(meta.get("asset_subtype") or "").upper()
    if subtype == "CASH_BALANCE":
        return True

    symbol = (asset.symbol or "").upper()
    if symbol.startswith("CASH_"):
        return True
    return False


def _find_cash_holding_for_currency(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
    currency: str,
) -> tuple[Holding, Asset] | None:
    rows = db.execute(
        select(Holding, Asset)
        .join(Asset, Asset.id == Holding.asset_id)
        .where(
            Holding.owner_user_id == owner_user_id,
            Holding.portfolio_id == portfolio_id,
            Asset.currency == currency,
        )
        .order_by(Holding.id.asc())
    ).all()
    for holding, asset in rows:
        if _is_cash_balance_asset(asset):
            return holding, asset
    return None


def _cash_delta_for_transaction(txn: Transaction) -> Decimal | None:
    if txn.status != "POSTED" or not txn.auto_apply_cash_holding:
        return None

    amount = Decimal(txn.amount)
    if txn.txn_type == "DEPOSIT":
        return amount
    if txn.txn_type == "WITHDRAW":
        return -amount
    if txn.txn_type == "BUY":
        return -amount
    if txn.txn_type == "SELL":
        return amount
    if txn.txn_type == "DIVIDEND":
        return amount
    if txn.txn_type == "FEE":
        return -amount
    if txn.txn_type == "ADJUSTMENT":
        return amount
    return None


def _upsert_cash_latest_quote(
    db: Session,
    *,
    asset_id: int,
    currency: str,
    balance: Decimal,
) -> None:
    now = datetime.now(UTC).replace(tzinfo=None)
    row = db.scalar(select(LatestQuote).where(LatestQuote.asset_id == asset_id))
    if row is None:
        db.add(
            LatestQuote(
                asset_id=asset_id,
                price=_quantize_price(balance),
                currency=currency,
                change_value=None,
                change_pct=None,
                as_of=now,
                source="TRADE_LEDGER",
            )
        )
        return

    row.price = _quantize_price(balance)
    row.currency = currency
    row.change_value = None
    row.change_pct = None
    row.as_of = now
    row.source = "TRADE_LEDGER"


def rebuild_cash_holding_from_trades(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
    currency: str,
) -> bool:
    normalized_currency = _normalize_currency(currency)
    txns = list(
        db.scalars(
            select(Transaction)
            .where(
                Transaction.owner_user_id == owner_user_id,
                Transaction.portfolio_id == portfolio_id,
                Transaction.currency == normalized_currency,
                Transaction.status == "POSTED",
                Transaction.auto_apply_cash_holding.is_(True),
                Transaction.txn_type.in_(
                    ["BUY", "SELL", "DEPOSIT", "WITHDRAW", "DIVIDEND", "FEE", "ADJUSTMENT"]
                ),
            )
            .order_by(Transaction.executed_at.asc(), Transaction.id.asc())
        ).all()
    )

    balance = Decimal("0")
    for txn in txns:
        delta = _cash_delta_for_transaction(txn)
        if delta is not None:
            balance += delta
    balance = _quantize_money(balance)

    cash_ref = _find_cash_holding_for_currency(
        db,
        owner_user_id=owner_user_id,
        portfolio_id=portfolio_id,
        currency=normalized_currency,
    )
    if cash_ref is None:
        if txns:
            raise TradeSyncError(
                "No CASH_BALANCE holding found for "
                f"portfolio_id={portfolio_id}, currency={normalized_currency}. "
                "Create one or disable auto cash apply."
            )
        return False

    cash_holding, cash_asset = cash_ref
    cash_holding.quantity = _quantize_qty(Decimal("1"))
    cash_holding.avg_price = _quantize_price(balance)
    cash_holding.avg_price_currency = normalized_currency
    cash_holding.invested_amount = balance
    cash_holding.invested_amount_currency = normalized_currency
    cash_holding.source_type = "AUTO"

    _upsert_cash_latest_quote(
        db,
        asset_id=cash_asset.id,
        currency=normalized_currency,
        balance=balance,
    )
    return True


def rebuild_cash_holdings_for_portfolio(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
) -> int:
    txn_currencies = list(
        db.scalars(
            select(Transaction.currency)
            .where(
                Transaction.owner_user_id == owner_user_id,
                Transaction.portfolio_id == portfolio_id,
                Transaction.status == "POSTED",
                Transaction.auto_apply_cash_holding.is_(True),
                Transaction.txn_type.in_(
                    ["BUY", "SELL", "DEPOSIT", "WITHDRAW", "DIVIDEND", "FEE", "ADJUSTMENT"]
                ),
            )
            .distinct()
        ).all()
    )
    auto_cash_holding_currencies = [
        asset_currency
        for asset_currency in db.scalars(
            select(Asset.currency)
            .join(Holding, Holding.asset_id == Asset.id)
            .where(
                Holding.owner_user_id == owner_user_id,
                Holding.portfolio_id == portfolio_id,
                Holding.source_type == "AUTO",
            )
        ).all()
    ]

    currencies = {
        _normalize_currency(ccy)
        for ccy in [*txn_currencies, *auto_cash_holding_currencies]
        if ccy is not None
    }
    affected = 0
    for ccy in currencies:
        if rebuild_cash_holding_from_trades(
            db,
            owner_user_id=owner_user_id,
            portfolio_id=portfolio_id,
            currency=ccy,
        ):
            affected += 1
    return affected


def _resolve_fx_for_portfolio_currency(
    db: Session,
    *,
    from_currency: str,
    to_currency: str,
    strict: bool,
) -> tuple[Decimal | None, datetime | None, str | None, Decimal]:
    src = _normalize_currency(from_currency)
    dst = _normalize_currency(to_currency)
    if src == dst:
        return Decimal("1"), None, "IDENTITY", Decimal("1")

    direct = db.scalar(
        select(FxRate)
        .where(FxRate.base_currency == src, FxRate.quote_currency == dst)
        .order_by(FxRate.as_of.desc(), FxRate.id.desc())
        .limit(1)
    )
    if direct is not None:
        rate = Decimal(direct.rate)
        return _quantize_price(rate), direct.as_of, direct.source, rate

    inverse = db.scalar(
        select(FxRate)
        .where(FxRate.base_currency == dst, FxRate.quote_currency == src)
        .order_by(FxRate.as_of.desc(), FxRate.id.desc())
        .limit(1)
    )
    if inverse is not None and inverse.rate != 0:
        rate = Decimal("1") / Decimal(inverse.rate)
        return _quantize_price(rate), inverse.as_of, f"{inverse.source}:INVERSE", rate

    if strict:
        raise MissingFxRateError(src, dst)

    # Fallback mode keeps service running while showing intent in metadata.
    fallback_rate = Decimal("1")
    return fallback_rate, None, "FALLBACK_NO_FX", fallback_rate


def normalize_trade_payload(
    db: Session,
    *,
    owner_user_id: int,
    payload: dict,
    strict_fx: bool,
) -> dict:
    normalized = dict(payload)

    portfolio_id = int(normalized["portfolio_id"])
    portfolio = _get_owned_portfolio(db, owner_user_id, portfolio_id)

    txn_type = str(normalized["txn_type"]).upper().strip()
    if txn_type not in {"BUY", "SELL", "DEPOSIT", "WITHDRAW", "DIVIDEND", "FEE", "ADJUSTMENT"}:
        raise TradeSyncError("txn_type is invalid")

    normalized["txn_type"] = txn_type
    normalized["portfolio_id"] = portfolio_id

    asset_id = normalized.get("asset_id")
    if asset_id is not None:
        asset_id = int(asset_id)
    normalized["asset_id"] = asset_id

    asset = _get_asset(db, asset_id)
    if asset_id is not None and asset is None:
        raise TradeSyncError("Asset does not exist")

    currency = _normalize_currency(normalized.get("currency"), default=portfolio.base_currency)
    normalized["currency"] = currency

    source_type = str(normalized.get("source_type") or "MANUAL").upper().strip()
    if source_type not in {"MANUAL", "AUTO"}:
        raise TradeSyncError("source_type must be MANUAL or AUTO")
    normalized["source_type"] = source_type

    auto_apply_cash_holding = normalized.get("auto_apply_cash_holding")
    if auto_apply_cash_holding is None:
        auto_apply_cash_holding = True
    normalized["auto_apply_cash_holding"] = bool(auto_apply_cash_holding)

    auto_apply_portfolio_cashflow = normalized.get("auto_apply_portfolio_cashflow")
    if auto_apply_portfolio_cashflow is None:
        auto_apply_portfolio_cashflow = txn_type in {"DEPOSIT", "WITHDRAW"}
    normalized["auto_apply_portfolio_cashflow"] = bool(auto_apply_portfolio_cashflow)

    executed_at = normalized.get("executed_at")
    if executed_at is None:
        executed_at = datetime.now(UTC).replace(tzinfo=None)
    normalized["executed_at"] = executed_at

    quantity = normalized.get("quantity")
    if quantity is not None:
        quantity = Decimal(quantity)
    unit_price = normalized.get("unit_price")
    if unit_price is not None:
        unit_price = Decimal(unit_price)
    amount = normalized.get("amount")
    if amount is not None:
        amount = Decimal(amount)

    if txn_type in {"BUY", "SELL"}:
        if asset is None:
            raise TradeSyncError("asset_id is required for BUY/SELL")
        if currency != _normalize_currency(asset.currency):
            raise TradeSyncError("BUY/SELL currency must match asset currency")

        quantity = _validate_positive(quantity, "quantity")
        unit_price = _validate_positive(unit_price, "unit_price")
        amount = amount if amount is not None else (quantity * unit_price)
        amount = _validate_positive(amount, "amount")
    elif txn_type in {"DEPOSIT", "WITHDRAW"}:
        if asset_id is not None:
            raise TradeSyncError("asset_id must be null for DEPOSIT/WITHDRAW")
        amount = _validate_positive(amount, "amount")
        quantity = None
        unit_price = None
    elif txn_type == "ADJUSTMENT":
        if amount is None or Decimal(amount) == 0:
            raise TradeSyncError("amount is required and must not be 0 for ADJUSTMENT")
        amount = Decimal(amount)
        quantity = None
        unit_price = None
    else:
        # MVP scope: these types are stored and can affect cash holding only.
        amount = _validate_positive(amount, "amount")
        quantity = None
        unit_price = None

    fx_rate_used, fx_as_of, fx_source, fx_rate_raw = _resolve_fx_for_portfolio_currency(
        db,
        from_currency=currency,
        to_currency=portfolio.base_currency,
        strict=strict_fx,
    )
    amount_in_portfolio_currency = _quantize_money(Decimal(amount) * fx_rate_raw)

    normalized["quantity"] = _quantize_qty(quantity) if quantity is not None else None
    normalized["unit_price"] = _quantize_price(unit_price) if unit_price is not None else None
    normalized["amount"] = _quantize_money(Decimal(amount))
    normalized["amount_in_portfolio_currency"] = amount_in_portfolio_currency
    normalized["fx_rate_used"] = fx_rate_used
    normalized["fx_as_of"] = fx_as_of
    normalized["fx_source"] = fx_source
    normalized["status"] = "POSTED"
    return normalized


def rebuild_portfolio_cashflow(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
) -> None:
    portfolio = _get_owned_portfolio(db, owner_user_id, portfolio_id)

    deposit_total = db.scalar(
        select(func.coalesce(func.sum(Transaction.amount_in_portfolio_currency), 0))
        .where(
            Transaction.owner_user_id == owner_user_id,
            Transaction.portfolio_id == portfolio_id,
            Transaction.status == "POSTED",
            Transaction.auto_apply_portfolio_cashflow.is_(True),
            Transaction.txn_type == "DEPOSIT",
        )
    )
    withdraw_total = db.scalar(
        select(func.coalesce(func.sum(Transaction.amount_in_portfolio_currency), 0))
        .where(
            Transaction.owner_user_id == owner_user_id,
            Transaction.portfolio_id == portfolio_id,
            Transaction.status == "POSTED",
            Transaction.auto_apply_portfolio_cashflow.is_(True),
            Transaction.txn_type == "WITHDRAW",
        )
    )
    portfolio.cumulative_deposit_amount = _quantize_money(Decimal(deposit_total or 0))
    portfolio.cumulative_withdrawal_amount = _quantize_money(Decimal(withdraw_total or 0))


def rebuild_holding_from_trades(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
    asset_id: int,
) -> bool:
    asset = _get_asset(db, asset_id)
    if asset is None:
        raise TradeSyncError("Asset not found while rebuilding holding")

    txns = list(
        db.scalars(
            select(Transaction)
            .where(
                Transaction.owner_user_id == owner_user_id,
                Transaction.portfolio_id == portfolio_id,
                Transaction.asset_id == asset_id,
                Transaction.status == "POSTED",
                Transaction.txn_type.in_(["BUY", "SELL"]),
            )
            .order_by(Transaction.executed_at.asc(), Transaction.id.asc())
        ).all()
    )

    qty = Decimal("0")
    invested = Decimal("0")
    avg = Decimal("0")

    for txn in txns:
        txn_qty = Decimal(txn.quantity or 0)
        if txn.txn_type == "BUY":
            qty += txn_qty
            invested += Decimal(txn.amount)
            avg = (invested / qty) if qty > 0 else Decimal("0")
            continue

        if txn_qty > qty:
            raise TradeSyncError(
                f"SELL quantity exceeds current position for portfolio_id={portfolio_id}, asset_id={asset_id}"
            )
        cost_out = avg * txn_qty
        qty -= txn_qty
        invested -= cost_out
        if qty <= 0:
            qty = Decimal("0")
            invested = Decimal("0")
            avg = Decimal("0")
        else:
            avg = invested / qty

    holding = db.scalar(
        select(Holding).where(
            Holding.owner_user_id == owner_user_id,
            Holding.portfolio_id == portfolio_id,
            Holding.asset_id == asset_id,
        )
    )

    if holding is None and qty <= 0:
        return False

    if holding is None:
        holding = Holding(
            owner_user_id=owner_user_id,
            portfolio_id=portfolio_id,
            asset_id=asset_id,
            quantity=_quantize_qty(qty),
            avg_price=_quantize_price(avg),
            avg_price_currency=_normalize_currency(asset.currency),
            invested_amount=_quantize_money(invested),
            invested_amount_currency=_normalize_currency(asset.currency),
            source_type="AUTO",
            is_hidden=False,
        )
        db.add(holding)
        return True

    holding.quantity = _quantize_qty(qty)
    holding.avg_price = _quantize_price(avg) if qty > 0 else Decimal("0")
    holding.avg_price_currency = _normalize_currency(asset.currency)
    holding.invested_amount = _quantize_money(invested) if qty > 0 else Decimal("0")
    holding.invested_amount_currency = _normalize_currency(asset.currency)
    holding.source_type = "AUTO"
    return True


def sync_single_trade_scope(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
    asset_id: int | None,
) -> None:
    rebuild_portfolio_cashflow(db, owner_user_id=owner_user_id, portfolio_id=portfolio_id)
    rebuild_cash_holdings_for_portfolio(db, owner_user_id=owner_user_id, portfolio_id=portfolio_id)
    if asset_id is not None:
        rebuild_holding_from_trades(
            db,
            owner_user_id=owner_user_id,
            portfolio_id=portfolio_id,
            asset_id=asset_id,
        )


def rebuild_trade_scope(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int | None = None,
    asset_id: int | None = None,
) -> RebuildResult:
    if portfolio_id is not None:
        portfolio_ids = [portfolio_id]
    else:
        portfolio_ids = list(
            db.scalars(select(Portfolio.id).where(Portfolio.owner_user_id == owner_user_id)).all()
        )

    for pid in portfolio_ids:
        rebuild_portfolio_cashflow(db, owner_user_id=owner_user_id, portfolio_id=pid)
        rebuild_cash_holdings_for_portfolio(db, owner_user_id=owner_user_id, portfolio_id=pid)

    txn_pairs = list(
        db.execute(
            select(Transaction.portfolio_id, Transaction.asset_id)
            .where(
                Transaction.owner_user_id == owner_user_id,
                Transaction.status == "POSTED",
                Transaction.txn_type.in_(["BUY", "SELL"]),
                Transaction.asset_id.is_not(None),
            )
            .where(Transaction.portfolio_id == portfolio_id if portfolio_id is not None else True)
            .where(Transaction.asset_id == asset_id if asset_id is not None else True)
            .distinct()
        ).all()
    )

    auto_holding_pairs = list(
        db.execute(
            select(Holding.portfolio_id, Holding.asset_id)
            .where(
                Holding.owner_user_id == owner_user_id,
                Holding.source_type == "AUTO",
                Holding.portfolio_id.is_not(None),
            )
            .where(Holding.portfolio_id == portfolio_id if portfolio_id is not None else True)
            .where(Holding.asset_id == asset_id if asset_id is not None else True)
            .distinct()
        ).all()
    )

    pair_set = {
        (int(pid), int(aid))
        for pid, aid in [*txn_pairs, *auto_holding_pairs]
        if pid is not None and aid is not None
    }

    for pid, aid in pair_set:
        rebuild_holding_from_trades(
            db,
            owner_user_id=owner_user_id,
            portfolio_id=pid,
            asset_id=aid,
        )

    return RebuildResult(
        affected_portfolios=len(portfolio_ids),
        affected_holdings=len(pair_set),
    )
