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
from app.models.liability import Liability
from app.models.portfolio import Portfolio
from app.models.portfolio_cash_account import PortfolioCashAccount
from app.models.transaction import Transaction
from app.services.currency import MissingFxRateError

_MONEY_Q = Decimal("0.01")
_PRICE_Q = Decimal("0.00000001")
_QTY_Q = Decimal("0.00000001")
_BUY_SELL_TYPES = {"BUY", "SELL"}
_PORTFOLIO_CASHFLOW_TYPES = {"DEPOSIT", "WITHDRAW"}
_LOAN_PRINCIPAL_TYPES = {"LOAN_BORROW", "LOAN_REPAY"}
_LOAN_INTEREST_TYPES = {"LOAN_INTEREST"}
_LOAN_EVENT_TYPES = _LOAN_PRINCIPAL_TYPES | _LOAN_INTEREST_TYPES
_CASH_APPLY_TYPES = {
    "BUY",
    "SELL",
    "DEPOSIT",
    "WITHDRAW",
    "DIVIDEND",
    "FEE",
    "ADJUSTMENT",
    "BALANCE_SET",
    "LOAN_BORROW",
    "LOAN_REPAY",
    "LOAN_INTEREST",
}


class TradeSyncError(RuntimeError):
    pass


@dataclass
class RebuildResult:
    affected_portfolios: int
    affected_holdings: int
    affected_liabilities: int


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


def _get_owned_liability(db: Session, owner_user_id: int, liability_id: int | None) -> Liability | None:
    if liability_id is None:
        return None
    return db.scalar(
        select(Liability).where(
            Liability.id == liability_id,
            Liability.owner_user_id == owner_user_id,
        )
    )


def _is_cash_balance_asset(asset: Asset) -> bool:
    meta = asset.meta_json if isinstance(asset.meta_json, dict) else {}
    subtype = str(meta.get("asset_subtype") or "").upper()
    if subtype == "CASH_BALANCE":
        return True

    symbol = (asset.symbol or "").upper()
    if symbol.startswith("CASH_"):
        return True
    return False


def _is_auto_generated_cash_asset(asset: Asset) -> bool:
    meta = asset.meta_json if isinstance(asset.meta_json, dict) else {}
    auto_generated = bool(meta.get("auto_generated"))
    symbol = (asset.symbol or "").upper()
    return auto_generated or symbol.startswith("CASH_AUTO_")


def _get_cash_account_mapping(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
    currency: str,
) -> PortfolioCashAccount | None:
    normalized_currency = _normalize_currency(currency)
    return db.scalar(
        select(PortfolioCashAccount).where(
            PortfolioCashAccount.owner_user_id == owner_user_id,
            PortfolioCashAccount.portfolio_id == portfolio_id,
            PortfolioCashAccount.currency == normalized_currency,
        )
    )


def _bind_cash_account_mapping(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
    currency: str,
    asset_id: int,
) -> PortfolioCashAccount:
    normalized_currency = _normalize_currency(currency)
    mapping = _get_cash_account_mapping(
        db,
        owner_user_id=owner_user_id,
        portfolio_id=portfolio_id,
        currency=normalized_currency,
    )
    if mapping is None:
        mapping = PortfolioCashAccount(
            owner_user_id=owner_user_id,
            portfolio_id=portfolio_id,
            currency=normalized_currency,
            asset_id=asset_id,
        )
        db.add(mapping)
        db.flush()
        return mapping

    if mapping.asset_id != asset_id:
        mapping.asset_id = asset_id
        db.flush()
    return mapping


def _get_or_create_cash_holding_for_asset(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
    currency: str,
    asset: Asset,
) -> Holding:
    holding = db.scalar(
        select(Holding).where(
            Holding.owner_user_id == owner_user_id,
            Holding.portfolio_id == portfolio_id,
            Holding.asset_id == asset.id,
        )
    )
    if holding is not None:
        return holding

    holding = Holding(
        owner_user_id=owner_user_id,
        portfolio_id=portfolio_id,
        asset_id=asset.id,
        quantity=_quantize_qty(Decimal("0")),
        avg_price=Decimal("1"),
        avg_price_currency=_normalize_currency(currency),
        invested_amount=Decimal("0"),
        invested_amount_currency=_normalize_currency(currency),
        source_type="AUTO",
        is_hidden=False,
        memo="Auto-created cash balance holding",
    )
    db.add(holding)
    db.flush()
    return holding


def _find_cash_holding_for_currency(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
    currency: str,
) -> tuple[Holding, Asset] | None:
    normalized_currency = _normalize_currency(currency)

    mapped = _get_cash_account_mapping(
        db,
        owner_user_id=owner_user_id,
        portfolio_id=portfolio_id,
        currency=normalized_currency,
    )
    if mapped is not None:
        mapped_asset = db.scalar(select(Asset).where(Asset.id == mapped.asset_id))
        if (
            mapped_asset is not None
            and _is_cash_balance_asset(mapped_asset)
            and _normalize_currency(mapped_asset.currency) == normalized_currency
        ):
            mapped_holding = _get_or_create_cash_holding_for_asset(
                db,
                owner_user_id=owner_user_id,
                portfolio_id=portfolio_id,
                currency=normalized_currency,
                asset=mapped_asset,
            )
            return mapped_holding, mapped_asset

    rows = db.execute(
        select(Holding, Asset)
        .join(Asset, Asset.id == Holding.asset_id)
        .where(
            Holding.owner_user_id == owner_user_id,
            Holding.portfolio_id == portfolio_id,
            Asset.currency == normalized_currency,
        )
        .order_by(Holding.id.asc())
    ).all()
    candidates: list[tuple[Holding, Asset]] = [
        (holding, asset) for holding, asset in rows if _is_cash_balance_asset(asset)
    ]
    if candidates:
        # Prefer Auto Cash Balance asset if multiple cash-like assets exist.
        candidates.sort(
            key=lambda pair: (
                0 if _is_auto_generated_cash_asset(pair[1]) else 1,
                pair[0].id,
            )
        )
        selected_holding, selected_asset = candidates[0]
        _bind_cash_account_mapping(
            db,
            owner_user_id=owner_user_id,
            portfolio_id=portfolio_id,
            currency=normalized_currency,
            asset_id=selected_asset.id,
        )
        return selected_holding, selected_asset
    return None


def _get_or_create_cash_asset(
    db: Session,
    *,
    currency: str,
) -> Asset:
    normalized_currency = _normalize_currency(currency)
    symbol = f"CASH_AUTO_{normalized_currency}"
    asset = db.scalar(
        select(Asset).where(
            Asset.asset_class == "ETC",
            Asset.symbol == symbol,
            Asset.exchange_code == "GLOBAL",
        )
    )
    if asset is not None:
        return asset

    asset = Asset(
        asset_class="ETC",
        symbol=symbol,
        name=f"Auto Cash Balance ({normalized_currency})",
        currency=normalized_currency,
        quote_mode="MANUAL",
        exchange_code="GLOBAL",
        is_trade_supported=False,
        meta_json={"asset_subtype": "CASH_BALANCE", "auto_generated": True},
    )
    db.add(asset)
    db.flush()
    return asset


def _ensure_cash_holding_for_currency(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
    currency: str,
) -> tuple[Holding, Asset]:
    normalized_currency = _normalize_currency(currency)
    existing = _find_cash_holding_for_currency(
        db,
        owner_user_id=owner_user_id,
        portfolio_id=portfolio_id,
        currency=normalized_currency,
    )
    if existing is not None:
        _existing_holding, existing_asset = existing
        _bind_cash_account_mapping(
            db,
            owner_user_id=owner_user_id,
            portfolio_id=portfolio_id,
            currency=normalized_currency,
            asset_id=existing_asset.id,
        )
        return existing

    asset = _get_or_create_cash_asset(db, currency=normalized_currency)
    holding = _get_or_create_cash_holding_for_asset(
        db,
        owner_user_id=owner_user_id,
        portfolio_id=portfolio_id,
        currency=normalized_currency,
        asset=asset,
    )
    _bind_cash_account_mapping(
        db,
        owner_user_id=owner_user_id,
        portfolio_id=portfolio_id,
        currency=normalized_currency,
        asset_id=asset.id,
    )
    return holding, asset


def ensure_portfolio_cash_account_for_currency(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
    currency: str,
) -> tuple[Holding, Asset]:
    _get_owned_portfolio(db, owner_user_id, portfolio_id)
    return _ensure_cash_holding_for_currency(
        db,
        owner_user_id=owner_user_id,
        portfolio_id=portfolio_id,
        currency=currency,
    )


def list_portfolio_cash_account_mappings(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
) -> list[tuple[PortfolioCashAccount, Asset | None]]:
    _get_owned_portfolio(db, owner_user_id, portfolio_id)
    rows = db.execute(
        select(PortfolioCashAccount, Asset)
        .outerjoin(Asset, Asset.id == PortfolioCashAccount.asset_id)
        .where(
            PortfolioCashAccount.owner_user_id == owner_user_id,
            PortfolioCashAccount.portfolio_id == portfolio_id,
        )
        .order_by(PortfolioCashAccount.currency.asc())
    ).all()
    return rows


def set_portfolio_cash_account_mapping(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
    currency: str,
    asset_id: int,
) -> tuple[PortfolioCashAccount, Holding, Asset]:
    _get_owned_portfolio(db, owner_user_id, portfolio_id)
    normalized_currency = _normalize_currency(currency)
    asset = _get_asset(db, asset_id)
    if asset is None:
        raise TradeSyncError("Asset does not exist")
    if not _is_cash_balance_asset(asset):
        raise TradeSyncError("Selected asset is not a cash balance asset")
    if _normalize_currency(asset.currency) != normalized_currency:
        raise TradeSyncError("Asset currency must match mapping currency")

    holding = _get_or_create_cash_holding_for_asset(
        db,
        owner_user_id=owner_user_id,
        portfolio_id=portfolio_id,
        currency=normalized_currency,
        asset=asset,
    )
    mapping = _bind_cash_account_mapping(
        db,
        owner_user_id=owner_user_id,
        portfolio_id=portfolio_id,
        currency=normalized_currency,
        asset_id=asset.id,
    )
    # Normalize mapped cash holding immediately from ledger transactions.
    # This guarantees canonical cash representation:
    # quantity=balance, avg_price=1, invested_amount=balance.
    rebuild_cash_holding_from_trades(
        db,
        owner_user_id=owner_user_id,
        portfolio_id=portfolio_id,
        currency=normalized_currency,
    )
    return mapping, holding, asset


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
    if txn.txn_type == "BALANCE_SET":
        return None
    if txn.txn_type == "LOAN_BORROW":
        return amount
    if txn.txn_type == "LOAN_REPAY":
        return -amount
    if txn.txn_type == "LOAN_INTEREST":
        return -amount
    return None


def _clear_cash_latest_quote(
    db: Session,
    *,
    asset_id: int,
) -> None:
    row = db.scalar(select(LatestQuote).where(LatestQuote.asset_id == asset_id))
    if row is not None:
        db.delete(row)


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
                Transaction.txn_type.in_(list(_CASH_APPLY_TYPES)),
            )
            .order_by(Transaction.executed_at.asc(), Transaction.id.asc())
        ).all()
    )

    balance = Decimal("0")
    for txn in txns:
        if txn.txn_type == "BALANCE_SET":
            balance = Decimal(txn.amount)
            continue
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
        cash_holding, cash_asset = _ensure_cash_holding_for_currency(
            db,
            owner_user_id=owner_user_id,
            portfolio_id=portfolio_id,
            currency=normalized_currency,
        )
    else:
        cash_holding, cash_asset = cash_ref
    # Cash balance is represented as quantity=balance and fixed unit price=1.
    # This avoids writing a misleading latest quote price equal to total balance.
    cash_holding.quantity = _quantize_qty(balance)
    cash_holding.avg_price = Decimal("1")
    cash_holding.avg_price_currency = normalized_currency
    cash_holding.invested_amount = balance
    cash_holding.invested_amount_currency = normalized_currency
    cash_holding.source_type = "AUTO"

    _clear_cash_latest_quote(
        db,
        asset_id=cash_asset.id,
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
                Transaction.txn_type.in_(list(_CASH_APPLY_TYPES)),
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
                Asset.symbol.ilike("CASH_%"),
            )
        ).all()
    ]
    mapped_currencies = list(
        db.scalars(
            select(PortfolioCashAccount.currency).where(
                PortfolioCashAccount.owner_user_id == owner_user_id,
                PortfolioCashAccount.portfolio_id == portfolio_id,
            )
        ).all()
    )
    liability_currencies = list(
        db.scalars(
            select(Liability.currency).where(
                Liability.owner_user_id == owner_user_id,
                Liability.portfolio_id == portfolio_id,
            )
        ).all()
    )

    currencies = {
        _normalize_currency(ccy)
        for ccy in [
            *txn_currencies,
            *auto_cash_holding_currencies,
            *mapped_currencies,
            *liability_currencies,
        ]
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

    raw_txn_type = normalized.get("txn_type")
    if hasattr(raw_txn_type, "value"):
        raw_txn_type = raw_txn_type.value
    txn_type = str(raw_txn_type).upper().strip()
    allowed_types = _BUY_SELL_TYPES | _PORTFOLIO_CASHFLOW_TYPES | _LOAN_EVENT_TYPES | {"DIVIDEND", "FEE", "ADJUSTMENT", "BALANCE_SET"}
    if txn_type not in allowed_types:
        raise TradeSyncError("txn_type is invalid")

    normalized["txn_type"] = txn_type
    normalized["portfolio_id"] = portfolio_id

    asset_id = normalized.get("asset_id")
    if asset_id is not None:
        asset_id = int(asset_id)
    normalized["asset_id"] = asset_id

    liability_id = normalized.get("liability_id")
    if liability_id is not None:
        liability_id = int(liability_id)
    normalized["liability_id"] = liability_id

    asset = _get_asset(db, asset_id)
    if asset_id is not None and asset is None:
        raise TradeSyncError("Asset does not exist")
    liability = _get_owned_liability(db, owner_user_id, liability_id)
    if liability_id is not None and liability is None:
        raise TradeSyncError("Liability does not exist")

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
        auto_apply_portfolio_cashflow = txn_type in _PORTFOLIO_CASHFLOW_TYPES
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

    if txn_type in _BUY_SELL_TYPES:
        if asset is None:
            raise TradeSyncError("asset_id is required for BUY/SELL")
        if liability_id is not None:
            raise TradeSyncError("liability_id must be null for BUY/SELL")
        if currency != _normalize_currency(asset.currency):
            raise TradeSyncError("BUY/SELL currency must match asset currency")

        quantity = _validate_positive(quantity, "quantity")
        unit_price = _validate_positive(unit_price, "unit_price")
        amount = amount if amount is not None else (quantity * unit_price)
        amount = _validate_positive(amount, "amount")
    elif txn_type in _PORTFOLIO_CASHFLOW_TYPES:
        if asset_id is not None:
            raise TradeSyncError("asset_id must be null for DEPOSIT/WITHDRAW")
        if liability_id is not None:
            raise TradeSyncError("liability_id must be null for DEPOSIT/WITHDRAW")
        amount = _validate_positive(amount, "amount")
        quantity = None
        unit_price = None
    elif txn_type in _LOAN_EVENT_TYPES:
        if asset_id is not None:
            raise TradeSyncError("asset_id must be null for LOAN_BORROW/LOAN_REPAY/LOAN_INTEREST")
        if liability is None:
            raise TradeSyncError("liability_id is required for LOAN_BORROW/LOAN_REPAY/LOAN_INTEREST")
        if liability.portfolio_id != portfolio_id:
            raise TradeSyncError("Liability must be linked to the same portfolio")
        if currency != _normalize_currency(liability.currency):
            raise TradeSyncError("Loan transaction currency must match liability currency")
        amount = _validate_positive(amount, "amount")
        quantity = None
        unit_price = None
    elif txn_type == "DIVIDEND":
        if liability_id is not None:
            raise TradeSyncError("liability_id must be null for DIVIDEND")
        if asset is not None:
            if currency != _normalize_currency(asset.currency):
                raise TradeSyncError("DIVIDEND currency must match selected asset currency")
            has_holding = db.scalar(
                select(Holding.id).where(
                    Holding.owner_user_id == owner_user_id,
                    Holding.portfolio_id == portfolio_id,
                    Holding.asset_id == asset_id,
                )
            )
            if has_holding is None:
                raise TradeSyncError("Selected dividend asset is not held in this portfolio")
        amount = _validate_positive(amount, "amount")
        quantity = None
        unit_price = None
    elif txn_type == "ADJUSTMENT":
        if amount is None or Decimal(amount) == 0:
            raise TradeSyncError("amount is required and must not be 0 for ADJUSTMENT")
        amount = Decimal(amount)
        if asset_id is not None or liability_id is not None:
            raise TradeSyncError("asset_id/liability_id must be null for ADJUSTMENT")
        quantity = None
        unit_price = None
    elif txn_type == "BALANCE_SET":
        if amount is None:
            raise TradeSyncError("amount is required for BALANCE_SET")
        amount = Decimal(amount)
        if asset_id is not None or liability_id is not None:
            raise TradeSyncError("asset_id/liability_id must be null for BALANCE_SET")
        quantity = None
        unit_price = None
    else:
        # MVP scope: these types are stored and can affect cash holding only.
        amount = _validate_positive(amount, "amount")
        if asset_id is not None or liability_id is not None:
            raise TradeSyncError("asset_id/liability_id must be null for this txn_type")
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


def ensure_liability_baseline_transaction(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
    liability_id: int | None,
    executed_at: datetime,
    strict_fx: bool,
    exclude_transaction_id: int | None = None,
) -> bool:
    if liability_id is None:
        return False

    liability = _get_owned_liability(db, owner_user_id, liability_id)
    if liability is None:
        raise TradeSyncError("Liability does not exist")
    if liability.portfolio_id != portfolio_id:
        raise TradeSyncError("Liability must be linked to the same portfolio")
    existing_stmt = select(Transaction.id).where(
        Transaction.owner_user_id == owner_user_id,
        Transaction.liability_id == liability_id,
        Transaction.status == "POSTED",
        Transaction.txn_type.in_(list(_LOAN_PRINCIPAL_TYPES)),
    )
    if exclude_transaction_id is not None:
        existing_stmt = existing_stmt.where(Transaction.id != exclude_transaction_id)
    existing_id = db.scalar(existing_stmt.limit(1))
    if existing_id is not None:
        return False

    opening_balance = _quantize_money(Decimal(liability.outstanding_balance or 0))
    if opening_balance <= 0:
        return False

    portfolio = _get_owned_portfolio(db, owner_user_id, portfolio_id)
    fx_rate_used, fx_as_of, fx_source, fx_rate_raw = _resolve_fx_for_portfolio_currency(
        db,
        from_currency=liability.currency,
        to_currency=portfolio.base_currency,
        strict=strict_fx,
    )
    amount_in_portfolio_currency = _quantize_money(opening_balance * fx_rate_raw)

    baseline_txn = Transaction(
        owner_user_id=owner_user_id,
        portfolio_id=portfolio_id,
        asset_id=None,
        liability_id=liability_id,
        txn_type="LOAN_BORROW",
        quantity=None,
        unit_price=None,
        amount=opening_balance,
        currency=_normalize_currency(liability.currency),
        amount_in_portfolio_currency=amount_in_portfolio_currency,
        fx_rate_used=fx_rate_used,
        fx_as_of=fx_as_of,
        fx_source=fx_source or "BASELINE",
        executed_at=executed_at,
        memo=f"SYSTEM_BASELINE liability_id={liability_id}",
        source_type="AUTO",
        auto_apply_cash_holding=False,
        auto_apply_portfolio_cashflow=False,
        status="POSTED",
    )
    db.add(baseline_txn)
    db.flush()
    return True


def ensure_portfolio_cashflow_baseline_transactions(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
    executed_at: datetime,
    exclude_transaction_id: int | None = None,
) -> int:
    portfolio = _get_owned_portfolio(db, owner_user_id, portfolio_id)
    base_currency = _normalize_currency(portfolio.base_currency)

    counts_stmt = (
        select(Transaction.txn_type, func.count())
        .where(
            Transaction.owner_user_id == owner_user_id,
            Transaction.portfolio_id == portfolio_id,
            Transaction.status == "POSTED",
            Transaction.auto_apply_portfolio_cashflow.is_(True),
            Transaction.txn_type.in_(list(_PORTFOLIO_CASHFLOW_TYPES)),
        )
        .group_by(Transaction.txn_type)
    )
    if exclude_transaction_id is not None:
        counts_stmt = counts_stmt.where(Transaction.id != exclude_transaction_id)

    counts = dict(db.execute(counts_stmt).all())

    has_deposit = int(counts.get("DEPOSIT", 0)) > 0
    has_withdraw = int(counts.get("WITHDRAW", 0)) > 0

    created = 0
    cumulative_deposit = _quantize_money(Decimal(portfolio.cumulative_deposit_amount or 0))
    cumulative_withdraw = _quantize_money(Decimal(portfolio.cumulative_withdrawal_amount or 0))

    if not has_deposit and cumulative_deposit > 0:
        db.add(
            Transaction(
                owner_user_id=owner_user_id,
                portfolio_id=portfolio_id,
                asset_id=None,
                liability_id=None,
                txn_type="DEPOSIT",
                quantity=None,
                unit_price=None,
                amount=cumulative_deposit,
                currency=base_currency,
                amount_in_portfolio_currency=cumulative_deposit,
                fx_rate_used=Decimal("1"),
                fx_as_of=None,
                fx_source="BASELINE",
                executed_at=executed_at,
                memo=f"SYSTEM_BASELINE portfolio_deposit portfolio_id={portfolio_id}",
                source_type="AUTO",
                auto_apply_cash_holding=False,
                auto_apply_portfolio_cashflow=True,
                status="POSTED",
            )
        )
        created += 1

    if not has_withdraw and cumulative_withdraw > 0:
        db.add(
            Transaction(
                owner_user_id=owner_user_id,
                portfolio_id=portfolio_id,
                asset_id=None,
                liability_id=None,
                txn_type="WITHDRAW",
                quantity=None,
                unit_price=None,
                amount=cumulative_withdraw,
                currency=base_currency,
                amount_in_portfolio_currency=cumulative_withdraw,
                fx_rate_used=Decimal("1"),
                fx_as_of=None,
                fx_source="BASELINE",
                executed_at=executed_at,
                memo=f"SYSTEM_BASELINE portfolio_withdraw portfolio_id={portfolio_id}",
                source_type="AUTO",
                auto_apply_cash_holding=False,
                auto_apply_portfolio_cashflow=True,
                status="POSTED",
            )
        )
        created += 1

    if created > 0:
        db.flush()
    return created


def ensure_holding_baseline_transaction(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
    asset_id: int | None,
    executed_at: datetime,
    strict_fx: bool,
    exclude_transaction_id: int | None = None,
) -> bool:
    if asset_id is None:
        return False

    asset = _get_asset(db, asset_id)
    if asset is None:
        raise TradeSyncError("Asset does not exist")

    if _is_cash_balance_asset(asset):
        # Cash balance holdings are derived from cash-applicable transactions.
        # Do not create BUY baseline transactions for these assets.
        return False

    existing_stmt = select(Transaction.id).where(
        Transaction.owner_user_id == owner_user_id,
        Transaction.portfolio_id == portfolio_id,
        Transaction.asset_id == asset_id,
        Transaction.status == "POSTED",
        Transaction.txn_type.in_(list(_BUY_SELL_TYPES)),
    )
    if exclude_transaction_id is not None:
        existing_stmt = existing_stmt.where(Transaction.id != exclude_transaction_id)
    existing_id = db.scalar(existing_stmt.limit(1))
    if existing_id is not None:
        return False

    holding = db.scalar(
        select(Holding).where(
            Holding.owner_user_id == owner_user_id,
            Holding.portfolio_id == portfolio_id,
            Holding.asset_id == asset_id,
        )
    )
    if holding is None:
        return False

    qty = _quantize_qty(Decimal(holding.quantity or 0))
    if qty <= 0:
        return False

    invested_raw = Decimal(holding.invested_amount or 0)
    if invested_raw <= 0:
        invested_raw = Decimal(holding.avg_price or 0) * qty
    invested = _quantize_money(invested_raw)
    if invested <= 0:
        return False

    txn_currency = _normalize_currency(
        getattr(holding, "invested_amount_currency", None)
        or getattr(holding, "avg_price_currency", None)
        or asset.currency
    )
    unit_price = _quantize_price(invested / qty)

    portfolio = _get_owned_portfolio(db, owner_user_id, portfolio_id)
    fx_rate_used, fx_as_of, fx_source, fx_rate_raw = _resolve_fx_for_portfolio_currency(
        db,
        from_currency=txn_currency,
        to_currency=portfolio.base_currency,
        strict=strict_fx,
    )
    amount_in_portfolio_currency = _quantize_money(invested * fx_rate_raw)

    db.add(
        Transaction(
            owner_user_id=owner_user_id,
            portfolio_id=portfolio_id,
            asset_id=asset_id,
            liability_id=None,
            txn_type="BUY",
            quantity=qty,
            unit_price=unit_price,
            amount=invested,
            currency=txn_currency,
            amount_in_portfolio_currency=amount_in_portfolio_currency,
            fx_rate_used=fx_rate_used,
            fx_as_of=fx_as_of,
            fx_source=fx_source or "BASELINE",
            executed_at=executed_at,
            memo=f"SYSTEM_BASELINE holding_id={holding.id}",
            source_type="AUTO",
            auto_apply_cash_holding=False,
            auto_apply_portfolio_cashflow=False,
            status="POSTED",
        )
    )
    db.flush()
    return True


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


def rebuild_liability_from_trades(
    db: Session,
    *,
    owner_user_id: int,
    liability_id: int,
) -> bool:
    liability = _get_owned_liability(db, owner_user_id, liability_id)
    if liability is None:
        raise TradeSyncError("Liability not found while rebuilding")

    txns = list(
        db.scalars(
            select(Transaction)
            .where(
                Transaction.owner_user_id == owner_user_id,
                Transaction.liability_id == liability_id,
                Transaction.status == "POSTED",
                Transaction.txn_type.in_(list(_LOAN_PRINCIPAL_TYPES)),
            )
            .order_by(Transaction.executed_at.asc(), Transaction.id.asc())
        ).all()
    )

    outstanding = Decimal("0")
    for txn in txns:
        amount = Decimal(txn.amount)
        if txn.txn_type == "LOAN_BORROW":
            outstanding += amount
            continue
        if amount > outstanding:
            raise TradeSyncError(
                f"LOAN_REPAY exceeds outstanding balance for liability_id={liability_id}"
            )
        outstanding -= amount

    liability.outstanding_balance = _quantize_money(outstanding)
    return True


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

    if _is_cash_balance_asset(asset):
        # Auto cash balance holdings are rebuilt from cash deltas, not BUY/SELL lot logic.
        return False

    txns = list(
        db.scalars(
            select(Transaction)
            .where(
                Transaction.owner_user_id == owner_user_id,
                Transaction.portfolio_id == portfolio_id,
                Transaction.asset_id == asset_id,
                Transaction.status == "POSTED",
                Transaction.txn_type.in_(list(_BUY_SELL_TYPES)),
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
    return True


def sync_single_trade_scope(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int,
    asset_id: int | None,
    liability_id: int | None,
) -> None:
    ensure_portfolio_cashflow_baseline_transactions(
        db,
        owner_user_id=owner_user_id,
        portfolio_id=portfolio_id,
        executed_at=datetime.now(UTC).replace(tzinfo=None),
    )
    rebuild_portfolio_cashflow(db, owner_user_id=owner_user_id, portfolio_id=portfolio_id)
    rebuild_cash_holdings_for_portfolio(db, owner_user_id=owner_user_id, portfolio_id=portfolio_id)
    if asset_id is not None:
        rebuild_holding_from_trades(
            db,
            owner_user_id=owner_user_id,
            portfolio_id=portfolio_id,
            asset_id=asset_id,
        )
    if liability_id is not None:
        rebuild_liability_from_trades(
            db,
            owner_user_id=owner_user_id,
            liability_id=liability_id,
        )


def rebuild_trade_scope(
    db: Session,
    *,
    owner_user_id: int,
    portfolio_id: int | None = None,
    asset_id: int | None = None,
    liability_id: int | None = None,
) -> RebuildResult:
    if portfolio_id is not None:
        portfolio_ids = [portfolio_id]
    else:
        portfolio_ids = list(
            db.scalars(select(Portfolio.id).where(Portfolio.owner_user_id == owner_user_id)).all()
        )

    for pid in portfolio_ids:
        ensure_portfolio_cashflow_baseline_transactions(
            db,
            owner_user_id=owner_user_id,
            portfolio_id=pid,
            executed_at=datetime.now(UTC).replace(tzinfo=None),
        )
        rebuild_portfolio_cashflow(db, owner_user_id=owner_user_id, portfolio_id=pid)
        rebuild_cash_holdings_for_portfolio(db, owner_user_id=owner_user_id, portfolio_id=pid)

    txn_pairs = list(
        db.execute(
            select(Transaction.portfolio_id, Transaction.asset_id)
            .where(
                Transaction.owner_user_id == owner_user_id,
                Transaction.status == "POSTED",
                Transaction.txn_type.in_(list(_BUY_SELL_TYPES)),
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

    txn_liability_ids = list(
        db.scalars(
            select(Transaction.liability_id)
            .where(
                Transaction.owner_user_id == owner_user_id,
                Transaction.status == "POSTED",
                Transaction.txn_type.in_(list(_LOAN_EVENT_TYPES)),
                Transaction.liability_id.is_not(None),
            )
            .where(Transaction.portfolio_id == portfolio_id if portfolio_id is not None else True)
            .where(Transaction.liability_id == liability_id if liability_id is not None else True)
            .distinct()
        ).all()
    )
    auto_liability_ids = list(
        db.scalars(
            select(Liability.id)
            .where(
                Liability.owner_user_id == owner_user_id,
            )
            .where(Liability.portfolio_id == portfolio_id if portfolio_id is not None else True)
            .where(Liability.id == liability_id if liability_id is not None else True)
            .distinct()
        ).all()
    )
    liability_set = {
        int(lid)
        for lid in [*txn_liability_ids, *auto_liability_ids]
        if lid is not None
    }
    for lid in liability_set:
        rebuild_liability_from_trades(
            db,
            owner_user_id=owner_user_id,
            liability_id=lid,
        )

    return RebuildResult(
        affected_portfolios=len(portfolio_ids),
        affected_holdings=len(pair_set),
        affected_liabilities=len(liability_set),
    )
