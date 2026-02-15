from dataclasses import dataclass
from datetime import UTC, datetime
from decimal import Decimal

import yfinance as yf


@dataclass
class QuotePayload:
    price: Decimal
    currency: str
    change_value: Decimal | None
    change_pct: Decimal | None
    as_of: datetime
    source: str


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
