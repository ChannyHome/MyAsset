from dataclasses import dataclass
from datetime import UTC, datetime
from decimal import Decimal, InvalidOperation

import httpx
import yfinance as yf


@dataclass
class QuotePayload:
    price: Decimal
    currency: str
    change_value: Decimal | None
    change_pct: Decimal | None
    as_of: datetime
    source: str


def _to_decimal(value: object) -> Decimal | None:
    if value is None:
        return None
    try:
        return Decimal(str(value))
    except (InvalidOperation, ValueError, TypeError):
        return None


def _as_utc_naive_from_epoch(value: object) -> datetime | None:
    if value is None:
        return None
    try:
        ts = float(value)
    except (TypeError, ValueError):
        return None

    # Most crypto APIs return milliseconds; seconds are usually 10-digit.
    if ts > 1_000_000_000_000:
        ts /= 1000.0
    return datetime.fromtimestamp(ts, tz=UTC).replace(tzinfo=None)


def normalize_symbol(asset_class: str, symbol: str, asset_currency: str) -> str:
    raw = symbol.strip().upper()

    if asset_class == "STOCK":
        if "." in raw:
            return raw
        if raw.isdigit() and len(raw) == 6:
            return f"{raw}.KS"
        return raw

    if asset_class == "CRYPTO":
        if "-" in raw:
            return raw
        quote_ccy = "KRW" if asset_currency.upper() == "KRW" else "USD"
        return f"{raw}-{quote_ccy}"

    return raw


def fetch_latest_quote(symbol: str) -> QuotePayload | None:
    return fetch_latest_quote_from_yfinance(symbol)


def fetch_latest_quote_from_yfinance(symbol: str) -> QuotePayload | None:
    ticker = yf.Ticker(symbol)
    history = ticker.history(period="5d", interval="1d", auto_adjust=False)
    if history.empty:
        return None

    closes = history["Close"].dropna()
    if closes.empty:
        return None

    last_close = Decimal(str(float(closes.iloc[-1])))
    prev_close = Decimal(str(float(closes.iloc[-2]))) if len(closes) > 1 else None

    change_value: Decimal | None = None
    change_pct: Decimal | None = None
    if prev_close is not None and prev_close != 0:
        change_value = last_close - prev_close
        change_pct = (change_value / prev_close) * Decimal("100")

    as_of = closes.index[-1].to_pydatetime()
    if as_of.tzinfo is not None:
        as_of = as_of.astimezone(UTC).replace(tzinfo=None)

    currency = "USD"
    try:
        fast_info = ticker.fast_info
        if isinstance(fast_info, dict):
            currency = fast_info.get("currency", currency)
        else:
            currency = getattr(fast_info, "currency", currency)
    except Exception:
        pass

    return QuotePayload(
        price=last_close,
        currency=currency,
        change_value=change_value,
        change_pct=change_pct,
        as_of=as_of,
        source="yfinance",
    )


def fetch_crypto_quote(exchange_code: str | None, symbol: str, asset_currency: str) -> QuotePayload | None:
    exchange = (exchange_code or "").strip().upper()
    if exchange == "UPBIT":
        return fetch_upbit_quote(symbol, asset_currency)
    if exchange == "KORBIT":
        return fetch_korbit_quote(symbol, asset_currency)
    return None


def fetch_upbit_quote(symbol: str, asset_currency: str) -> QuotePayload | None:
    market = f"{asset_currency.strip().upper()}-{symbol.strip().upper()}"
    try:
        response = httpx.get(
            "https://api.upbit.com/v1/ticker",
            params={"markets": market},
            timeout=8.0,
        )
        response.raise_for_status()
        payload = response.json()
    except Exception:
        return None

    if not isinstance(payload, list) or not payload:
        return None

    row = payload[0]
    if not isinstance(row, dict):
        return None

    price = _to_decimal(row.get("trade_price"))
    if price is None:
        return None

    change_value = _to_decimal(row.get("signed_change_price"))
    signed_change_rate = _to_decimal(row.get("signed_change_rate"))
    change_pct = signed_change_rate * Decimal("100") if signed_change_rate is not None else None
    as_of = _as_utc_naive_from_epoch(row.get("timestamp")) or datetime.now(UTC).replace(tzinfo=None)

    return QuotePayload(
        price=price,
        currency=asset_currency.strip().upper(),
        change_value=change_value,
        change_pct=change_pct,
        as_of=as_of,
        source="UPBIT",
    )


def _parse_korbit_payload(payload: object, asset_currency: str) -> QuotePayload | None:
    if not isinstance(payload, dict):
        return None

    price = _to_decimal(payload.get("last") or payload.get("last_price") or payload.get("close"))
    if price is None:
        return None

    change_value = _to_decimal(payload.get("change") or payload.get("signed_change_price"))
    change_pct = _to_decimal(payload.get("changePercent") or payload.get("change_percent") or payload.get("change_rate"))
    if change_pct is not None and abs(change_pct) <= Decimal("1"):
        change_pct = change_pct * Decimal("100")

    if change_pct is None and change_value is not None:
        prev_price = price - change_value
        if prev_price != 0:
            change_pct = (change_value / prev_price) * Decimal("100")

    as_of = _as_utc_naive_from_epoch(payload.get("timestamp")) or datetime.now(UTC).replace(tzinfo=None)

    return QuotePayload(
        price=price,
        currency=asset_currency.strip().upper(),
        change_value=change_value,
        change_pct=change_pct,
        as_of=as_of,
        source="KORBIT",
    )


def fetch_korbit_quote(symbol: str, asset_currency: str) -> QuotePayload | None:
    pair = f"{symbol.strip().lower()}_{asset_currency.strip().lower()}"
    endpoints = (
        "https://api.korbit.co.kr/v1/ticker/detailed",
        "https://api.korbit.co.kr/v1/ticker",
    )

    for endpoint in endpoints:
        try:
            response = httpx.get(endpoint, params={"currency_pair": pair}, timeout=8.0)
            response.raise_for_status()
            payload = response.json()
        except Exception:
            continue

        parsed = _parse_korbit_payload(payload, asset_currency)
        if parsed is not None:
            return parsed

    return None
