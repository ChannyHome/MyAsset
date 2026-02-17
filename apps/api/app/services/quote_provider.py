from dataclasses import dataclass
from datetime import UTC, datetime
from decimal import Decimal, InvalidOperation
from typing import Any
from urllib.parse import unquote
from xml.etree import ElementTree as ET

import httpx
import yfinance as yf

from app.core.config import settings


@dataclass
class QuotePayload:
    price: Decimal
    currency: str
    change_value: Decimal | None
    change_pct: Decimal | None
    as_of: datetime
    source: str


@dataclass
class FxRatePayload:
    base_currency: str
    quote_currency: str
    rate: Decimal
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


def fetch_usd_krw_rate() -> FxRatePayload | None:
    try:
        response = httpx.get(
            "https://open.er-api.com/v6/latest/USD",
            timeout=8.0,
        )
        response.raise_for_status()
        payload = response.json()
    except Exception:
        return None

    if not isinstance(payload, dict):
        return None

    result = str(payload.get("result", "")).lower()
    if result and result != "success":
        return None

    rates = payload.get("rates")
    if not isinstance(rates, dict):
        return None

    rate = _to_decimal(rates.get("KRW"))
    if rate is None or rate <= 0:
        return None

    as_of = _as_utc_naive_from_epoch(payload.get("time_last_update_unix")) or datetime.now(UTC).replace(tzinfo=None)

    return FxRatePayload(
        base_currency="USD",
        quote_currency="KRW",
        rate=rate,
        as_of=as_of,
        source="open.er-api.com",
    )


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


def fetch_real_estate_quote(
    exchange_code: str | None,
    asset_currency: str,
    meta_json: dict[str, Any] | None,
    service_key: str | None = None,
) -> QuotePayload | None:
    exchange = (exchange_code or "").strip().upper()
    if exchange not in {"DATA_GO_KR", "MOLIT", "REAL_ESTATE"}:
        return None

    resolved_service_key = _normalize_service_key(service_key or settings.data_go_kr_service_key)
    if not resolved_service_key:
        return None

    meta = meta_json or {}
    lawd_cd = str(meta.get("lawd_cd", "")).strip()
    apt_name = str(meta.get("apt_name", "")).strip()
    if not lawd_cd or not apt_name:
        return None

    jibun = str(meta.get("jibun", "")).strip()
    area_m2 = _to_decimal(meta.get("area_m2"))

    lookback_months_raw = _to_decimal(meta.get("lookback_months"))
    lookback_months = int(lookback_months_raw) if lookback_months_raw is not None else settings.data_go_kr_lookback_months
    if lookback_months <= 0:
        lookback_months = settings.data_go_kr_lookback_months

    now = datetime.now()
    for month_index in range(lookback_months):
        target_ymd = _shift_yyyymm(now.year, now.month, month_index)
        rows = _fetch_molit_apt_trade_rows(
            service_key=resolved_service_key,
            lawd_cd=lawd_cd,
            deal_ymd=target_ymd,
        )
        month_candidates: list[tuple[datetime, Decimal]] = []

        for row in rows:
            row_apt_name = _text_or_none(row, ["아파트", "aptNm"])
            if row_apt_name is None or row_apt_name.strip() != apt_name:
                continue

            if jibun:
                row_jibun = _text_or_none(row, ["지번", "jibun"])
                if row_jibun is None or row_jibun.strip() != jibun:
                    continue

            if area_m2 is not None:
                row_area = _to_decimal(_text_or_none(row, ["전용면적", "excluUseAr"]))
                if row_area is None:
                    continue
                # Area values can include small floating-point precision differences.
                if abs(row_area - area_m2) > Decimal("0.05"):
                    continue

            # data.go.kr apartment trade API returns dealAmount in 만원 units.
            price = _parse_trade_amount(
                _text_or_none(row, ["거래금액", "dealAmount"]),
                unit_multiplier=Decimal("10000"),
            )
            if price is None:
                continue

            deal_dt = _parse_deal_datetime(row)
            if deal_dt is None:
                continue

            month_candidates.append((deal_dt, price))

        # We iterate from recent month to older month.
        # As soon as we find matched trades in a month, this month is the latest period.
        if month_candidates:
            deal_dt, latest_price = max(month_candidates, key=lambda item: item[0])
            return QuotePayload(
                price=latest_price,
                currency=asset_currency.strip().upper() or "KRW",
                change_value=None,
                change_pct=None,
                as_of=deal_dt,
                source="DATA_GO_KR_MOLIT",
            )

    return None


def _normalize_service_key(service_key: str) -> str:
    key = (service_key or "").strip()
    if not key:
        return ""
    # data.go.kr keys are often copied as URL-encoded values.
    return unquote(key) if "%" in key else key


def _shift_yyyymm(year: int, month: int, offset_months: int) -> str:
    month_index = year * 12 + (month - 1) - offset_months
    target_year = month_index // 12
    target_month = (month_index % 12) + 1
    return f"{target_year:04d}{target_month:02d}"


def _fetch_molit_apt_trade_rows(service_key: str, lawd_cd: str, deal_ymd: str) -> list[dict[str, str]]:
    try:
        response = httpx.get(
            settings.data_go_kr_apartment_trade_url,
            params={
                "serviceKey": service_key,
                "LAWD_CD": lawd_cd,
                "DEAL_YMD": deal_ymd,
                "pageNo": 1,
                "numOfRows": settings.data_go_kr_rows_per_call,
            },
            timeout=settings.data_go_kr_timeout_seconds,
        )
        response.raise_for_status()
    except Exception:
        return []

    try:
        root = ET.fromstring(response.text)
    except ET.ParseError:
        return []

    result_code = root.findtext("./header/resultCode")
    if result_code not in {None, "", "00", "000"}:
        return []

    rows: list[dict[str, str]] = []
    for item in root.findall("./body/items/item"):
        mapped: dict[str, str] = {}
        for child in list(item):
            if child.tag:
                mapped[child.tag] = (child.text or "").strip()
        if mapped:
            rows.append(mapped)
    return rows


def _text_or_none(row: dict[str, str], keys: list[str]) -> str | None:
    for key in keys:
        value = row.get(key)
        if value is not None and str(value).strip():
            return str(value).strip()
    return None


def _parse_trade_amount(value: str | None, *, unit_multiplier: Decimal = Decimal("1")) -> Decimal | None:
    if value is None:
        return None
    normalized = value.replace(",", "").replace(" ", "").strip()
    amount = _to_decimal(normalized)
    if amount is None:
        return None
    return amount * unit_multiplier


def _parse_deal_datetime(row: dict[str, str]) -> datetime | None:
    year_text = _text_or_none(row, ["년", "dealYear"])
    month_text = _text_or_none(row, ["월", "dealMonth"])
    day_text = _text_or_none(row, ["일", "dealDay"])
    if year_text is None or month_text is None or day_text is None:
        return None

    try:
        year = int(year_text)
        month = int(month_text)
        day = int(day_text)
        return datetime(year, month, day)
    except ValueError:
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
