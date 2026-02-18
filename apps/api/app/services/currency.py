from decimal import Decimal, InvalidOperation

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.fx_rate import FxRate


FxCache = dict[tuple[str, str], Decimal | None]


class MissingFxRateError(RuntimeError):
    def __init__(self, from_currency: str, to_currency: str):
        self.from_currency = from_currency
        self.to_currency = to_currency
        super().__init__(f"Missing FX rate for {from_currency}->{to_currency}")


def normalize_currency(currency: str | None, fallback: str = "KRW") -> str:
    value = (currency or fallback).upper().strip()
    return value or fallback


def get_fx_rate(
    db: Session,
    from_currency: str,
    to_currency: str,
    cache: FxCache | None = None,
) -> Decimal | None:
    src = normalize_currency(from_currency)
    dst = normalize_currency(to_currency)
    if src == dst:
        return Decimal("1")

    key = (src, dst)
    if cache is not None and key in cache:
        return cache[key]

    direct = db.scalar(
        select(FxRate.rate)
        .where(FxRate.base_currency == src, FxRate.quote_currency == dst)
        .order_by(FxRate.as_of.desc(), FxRate.id.desc())
        .limit(1)
    )
    if direct is not None:
        rate = Decimal(direct)
        if cache is not None:
            cache[key] = rate
        return rate

    inverse = db.scalar(
        select(FxRate.rate)
        .where(FxRate.base_currency == dst, FxRate.quote_currency == src)
        .order_by(FxRate.as_of.desc(), FxRate.id.desc())
        .limit(1)
    )
    if inverse is None:
        if cache is not None:
            cache[key] = None
        return None

    try:
        rate = Decimal("1") / Decimal(inverse)
    except (InvalidOperation, ZeroDivisionError):
        if cache is not None:
            cache[key] = None
        return None

    if cache is not None:
        cache[key] = rate
    return rate


def convert_amount(
    db: Session,
    amount: Decimal,
    from_currency: str,
    to_currency: str,
    cache: FxCache | None = None,
    fallback_passthrough: bool = True,
    strict: bool = False,
) -> Decimal:
    src = normalize_currency(from_currency)
    dst = normalize_currency(to_currency)
    if src == dst:
        return amount

    rate = get_fx_rate(db=db, from_currency=src, to_currency=dst, cache=cache)
    if rate is None:
        if strict:
            raise MissingFxRateError(src, dst)
        return amount if fallback_passthrough else Decimal("0")
    return amount * rate
