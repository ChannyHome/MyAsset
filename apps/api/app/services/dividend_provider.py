from __future__ import annotations

from datetime import date
from decimal import Decimal, InvalidOperation
from typing import Any
from urllib.parse import unquote

import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.asset import Asset
from app.models.dividend import AssetProviderIdentifier
from app.schemas.dividend import DividendEventOut, DividendLookupOut
from app.services.secret_vault import resolve_secret_value

DATA_GO_KR_PROVIDER = "DATA_GO_KR"
ALPHA_VANTAGE_PROVIDER = "ALPHA_VANTAGE"


class DividendProviderError(Exception):
    def __init__(self, message: str, *, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.message = message


def _normalize_data_go_kr_service_key(service_key: str | None) -> str:
    value = (service_key or "").strip()
    if not value:
        return ""
    return unquote(value) if "%" in value else value


def _resolve_data_go_kr_service_key(db: Session) -> tuple[str, str]:
    value, source = resolve_secret_value(
        db=db,
        provider=DATA_GO_KR_PROVIDER,
        key_name="SERVICE_KEY",
        env_fallback=settings.data_go_kr_service_key,
    )
    normalized = _normalize_data_go_kr_service_key(value)
    if not normalized:
        raise DividendProviderError("DATA_GO_KR/SERVICE_KEY is not configured", status_code=503)
    return normalized, source


def _resolve_alpha_vantage_api_key(db: Session) -> tuple[str, str]:
    value, source = resolve_secret_value(
        db=db,
        provider=ALPHA_VANTAGE_PROVIDER,
        key_name="API_KEY",
        env_fallback=settings.alpha_vantage_api_key,
    )
    normalized = (value or "").strip()
    if not normalized:
        raise DividendProviderError("ALPHA_VANTAGE/API_KEY is not configured", status_code=503)
    return normalized, source


def _to_decimal(value: Any, default: Decimal = Decimal("0")) -> Decimal:
    if value is None:
        return default
    if isinstance(value, Decimal):
        return value
    text = str(value).strip().replace(",", "")
    if not text:
        return default
    try:
        return Decimal(text)
    except (InvalidOperation, ValueError):
        return default


def _parse_yyyymmdd(value: Any) -> date | None:
    text = str(value or "").strip()
    if len(text) != 8 or not text.isdigit():
        return None
    try:
        return date(int(text[:4]), int(text[4:6]), int(text[6:8]))
    except ValueError:
        return None


def _parse_iso_date(value: Any) -> date | None:
    text = str(value or "").strip()
    if not text or text in {"0000-00-00", "None"}:
        return None
    try:
        return date.fromisoformat(text)
    except ValueError:
        return None


def _estimated_tax(gross: Decimal, tax_rate_pct: Decimal) -> tuple[Decimal, Decimal]:
    tax = (gross * tax_rate_pct / Decimal("100")).quantize(Decimal("0.00000001"))
    net = (gross - tax).quantize(Decimal("0.00000001"))
    return tax, net


def _event_year(event: DividendEventOut) -> int | None:
    for candidate in (
        event.payment_date,
        event.ex_dividend_date,
        event.record_date,
        event.dividend_base_date,
        event.declaration_date,
    ):
        if candidate is not None:
            return candidate.year
    return event.fiscal_year


def _matches_year(event: DividendEventOut, year: int | None) -> bool:
    if year is None:
        return True
    return _event_year(event) == year


def _sort_key(event: DividendEventOut) -> tuple[date, str]:
    fallback = date.min
    event_date = event.payment_date or event.ex_dividend_date or event.record_date or event.dividend_base_date or fallback
    return event_date, event.provider_event_id


def _asset_provider_identifier_map(db: Session, *, asset_id: int, provider: str) -> dict[str, str]:
    rows = db.scalars(
        select(AssetProviderIdentifier).where(
            AssetProviderIdentifier.asset_id == asset_id,
            AssetProviderIdentifier.provider == provider,
        )
    ).all()
    values: dict[str, str] = {}
    for row in rows:
        key = str(row.identifier_type or "").upper().strip()
        value = str(row.identifier_value or "").strip()
        if key and value and key not in values:
            values[key] = value
    return values


def _extract_data_go_kr_items(payload: dict[str, Any]) -> tuple[list[dict[str, Any]], int, dict[str, Any]]:
    response = payload.get("response", {}) if isinstance(payload, dict) else {}
    header = response.get("header", {}) if isinstance(response, dict) else {}
    body = response.get("body", {}) if isinstance(response, dict) else {}
    total_count = int(body.get("totalCount") or 0) if isinstance(body, dict) else 0
    items = body.get("items", {}) if isinstance(body, dict) else {}
    item = items.get("item", []) if isinstance(items, dict) else items
    if isinstance(item, dict):
        return [item], total_count, header
    if isinstance(item, list):
        return [row for row in item if isinstance(row, dict)], total_count, header
    return [], total_count, header


def _data_go_kr_event(row: dict[str, Any], *, tax_rate_pct: Decimal) -> DividendEventOut:
    gross = _to_decimal(row.get("stckGenrDvdnAmt"))
    tax, net = _estimated_tax(gross, tax_rate_pct)
    base_date = _parse_yyyymmdd(row.get("dvdnBasDt"))
    payment_date = _parse_yyyymmdd(row.get("cashDvdnPayDt"))
    isin_code = str(row.get("isinCd") or "").strip() or None
    crno = str(row.get("crno") or "").strip() or None
    dividend_type = str(row.get("stckDvdnRcdNm") or row.get("stckDvdnRcd") or "").strip() or None
    provider_event_id = ":".join(
        [
            DATA_GO_KR_PROVIDER,
            isin_code or "",
            str(row.get("dvdnBasDt") or ""),
            str(row.get("cashDvdnPayDt") or ""),
            str(row.get("stckDvdnRcd") or ""),
        ]
    )
    return DividendEventOut(
        provider=DATA_GO_KR_PROVIDER,
        provider_event_id=provider_event_id,
        market="KR",
        symbol=None,
        isin_code=isin_code,
        crno=crno,
        asset_name=str(row.get("isinCdNm") or row.get("stckIssuCmpyNm") or "").strip() or None,
        dividend_type=dividend_type,
        declaration_date=None,
        ex_dividend_date=None,
        record_date=base_date,
        payment_date=payment_date,
        dividend_base_date=base_date,
        fiscal_year=base_date.year if base_date else None,
        dividend_currency="KRW",
        dividend_per_share_gross=gross,
        tax_rate_pct=tax_rate_pct,
        withholding_tax_amount_per_share=tax,
        dividend_per_share_net_estimated=net,
        raw=row,
    )


def fetch_data_go_kr_stock_dividends(
    db: Session,
    *,
    stock_name: str | None = None,
    crno: str | None = None,
    isin_code: str | None = None,
    bas_dt: str | None = None,
    year: int | None = None,
    page: int = 1,
    page_size: int = 100,
    max_pages: int = 5,
    tax_rate_pct: Decimal = Decimal("15.4"),
) -> DividendLookupOut:
    service_key, source = _resolve_data_go_kr_service_key(db)
    normalized_page = max(1, int(page))
    normalized_page_size = min(max(1, int(page_size)), 1000)
    normalized_max_pages = min(max(1, int(max_pages)), 20)
    params: dict[str, Any] = {
        "serviceKey": service_key,
        "pageNo": normalized_page,
        "numOfRows": normalized_page_size,
        "resultType": "json",
    }
    if stock_name:
        params["stckIssuCmpyNm"] = stock_name.strip()
    if crno:
        params["crno"] = crno.strip()
    if isin_code:
        params["isinCd"] = isin_code.strip().upper()
    if bas_dt:
        params["basDt"] = bas_dt.strip()

    all_rows: list[dict[str, Any]] = []
    total_count = 0
    header: dict[str, Any] = {}
    with httpx.Client(timeout=settings.data_go_kr_timeout_seconds) as client:
        for offset in range(normalized_max_pages):
            params["pageNo"] = normalized_page + offset
            try:
                response = client.get(settings.data_go_kr_stock_dividend_url, params=params)
                response.raise_for_status()
                payload = response.json()
            except httpx.HTTPStatusError as exc:
                raise DividendProviderError(
                    f"DATA_GO_KR dividend request failed ({exc.response.status_code})",
                    status_code=502,
                ) from exc
            except Exception as exc:
                raise DividendProviderError("DATA_GO_KR dividend response could not be parsed", status_code=502) from exc

            rows, total_count, header = _extract_data_go_kr_items(payload)
            result_code = str(header.get("resultCode") or "")
            if result_code and result_code not in {"00", "000"}:
                message = str(header.get("resultMsg") or "DATA_GO_KR returned an error")
                raise DividendProviderError(message, status_code=502)
            all_rows.extend(rows)
            if not rows or len(all_rows) >= total_count:
                break

    events = [_data_go_kr_event(row, tax_rate_pct=tax_rate_pct) for row in all_rows]
    filtered = sorted([event for event in events if _matches_year(event, year)], key=_sort_key)
    warnings: list[str] = []
    if year is not None and events and not filtered:
        warnings.append(f"No DATA_GO_KR dividend rows matched year {year}.")
    return DividendLookupOut(
        provider=DATA_GO_KR_PROVIDER,
        source=source,
        market="KR",
        symbol=isin_code,
        asset_name=stock_name,
        display_name=stock_name or isin_code or crno,
        currency="KRW",
        tax_rate_pct=tax_rate_pct,
        total_count=total_count,
        returned_count=len(filtered),
        year=year,
        items=filtered,
        warnings=warnings,
    )


def _alpha_vantage_event(symbol: str, row: dict[str, Any], *, tax_rate_pct: Decimal) -> DividendEventOut:
    gross = _to_decimal(row.get("amount"))
    tax, net = _estimated_tax(gross, tax_rate_pct)
    ex_date = _parse_iso_date(row.get("ex_dividend_date"))
    payment_date = _parse_iso_date(row.get("payment_date"))
    record_date = _parse_iso_date(row.get("record_date"))
    declaration_date = _parse_iso_date(row.get("declaration_date"))
    provider_event_id = ":".join(
        [
            ALPHA_VANTAGE_PROVIDER,
            symbol.upper(),
            str(row.get("ex_dividend_date") or ""),
            str(row.get("payment_date") or ""),
        ]
    )
    return DividendEventOut(
        provider=ALPHA_VANTAGE_PROVIDER,
        provider_event_id=provider_event_id,
        market="US",
        symbol=symbol.upper(),
        isin_code=None,
        crno=None,
        asset_name=symbol.upper(),
        dividend_type="Cash Dividend",
        declaration_date=declaration_date,
        ex_dividend_date=ex_date,
        record_date=record_date,
        payment_date=payment_date,
        dividend_base_date=record_date or ex_date,
        fiscal_year=(payment_date or ex_date or record_date or declaration_date).year
        if (payment_date or ex_date or record_date or declaration_date)
        else None,
        dividend_currency="USD",
        dividend_per_share_gross=gross,
        tax_rate_pct=tax_rate_pct,
        withholding_tax_amount_per_share=tax,
        dividend_per_share_net_estimated=net,
        raw=row,
    )


def fetch_alpha_vantage_stock_dividends(
    db: Session,
    *,
    symbol: str,
    year: int | None = None,
    tax_rate_pct: Decimal = Decimal("15"),
) -> DividendLookupOut:
    normalized_symbol = (symbol or "").strip().upper()
    if not normalized_symbol:
        raise DividendProviderError("symbol is required", status_code=400)

    api_key, source = _resolve_alpha_vantage_api_key(db)
    try:
        response = httpx.get(
            "https://www.alphavantage.co/query",
            params={"function": "DIVIDENDS", "symbol": normalized_symbol, "apikey": api_key},
            timeout=settings.alpha_vantage_timeout_seconds,
        )
        response.raise_for_status()
        payload = response.json()
    except httpx.HTTPStatusError as exc:
        raise DividendProviderError(
            f"Alpha Vantage dividend request failed ({exc.response.status_code})",
            status_code=502,
        ) from exc
    except Exception as exc:
        raise DividendProviderError("Alpha Vantage dividend response could not be parsed", status_code=502) from exc

    warnings: list[str] = []
    for key in ("Error Message", "Note", "Information"):
        value = payload.get(key) if isinstance(payload, dict) else None
        if value:
            warnings.append(str(value))
    rows = payload.get("data") if isinstance(payload, dict) else None
    if not isinstance(rows, list):
        raise DividendProviderError("Alpha Vantage returned an unexpected dividend payload", status_code=502)

    events = [
        _alpha_vantage_event(normalized_symbol, row, tax_rate_pct=tax_rate_pct)
        for row in rows
        if isinstance(row, dict)
    ]
    filtered = sorted([event for event in events if _matches_year(event, year)], key=_sort_key)
    if year is not None and events and not filtered:
        warnings.append(f"No Alpha Vantage dividend rows matched year {year}.")
    return DividendLookupOut(
        provider=ALPHA_VANTAGE_PROVIDER,
        source=source,
        market="US",
        symbol=normalized_symbol,
        asset_name=normalized_symbol,
        display_name=normalized_symbol,
        currency="USD",
        tax_rate_pct=tax_rate_pct,
        total_count=len(events),
        returned_count=len(filtered),
        year=year,
        items=filtered,
        warnings=warnings,
    )


def fetch_dividends_for_asset(
    db: Session,
    *,
    asset: Asset,
    year: int | None = None,
    tax_rate_pct: Decimal | None = None,
) -> DividendLookupOut:
    currency = (asset.currency or "").upper()
    exchange_code = (asset.exchange_code or "").upper()
    meta = asset.meta_json or {}
    if asset.asset_class != "STOCK":
        raise DividendProviderError("Dividend provider lookup supports STOCK assets only", status_code=400)

    if currency == "KRW" or exchange_code in {"KRX", "KOSPI", "KOSDAQ", "KR"}:
        identifiers = _asset_provider_identifier_map(db, asset_id=asset.id, provider=DATA_GO_KR_PROVIDER)
        result = fetch_data_go_kr_stock_dividends(
            db,
            stock_name=str(
                identifiers.get("STOCK_NAME")
                or identifiers.get("STCK_ISSU_CMPY_NM")
                or meta.get("stckIssuCmpyNm")
                or meta.get("stock_name")
                or asset.name
            ),
            crno=str(identifiers.get("CRNO") or meta.get("crno") or "").strip() or None,
            isin_code=str(
                identifiers.get("ISIN")
                or identifiers.get("ISIN_CODE")
                or meta.get("isinCd")
                or meta.get("isin_code")
                or ""
            ).strip()
            or None,
            year=year,
            tax_rate_pct=tax_rate_pct or Decimal("15.4"),
            page_size=100,
            max_pages=10,
        )
        result.asset_id = asset.id
        result.symbol = asset.symbol
        result.asset_name = asset.name
        result.display_name = asset.name
        return result

    if not asset.symbol:
        identifiers = _asset_provider_identifier_map(db, asset_id=asset.id, provider=ALPHA_VANTAGE_PROVIDER)
        symbol = identifiers.get("SYMBOL")
        if not symbol:
            raise DividendProviderError("US dividend lookup requires asset symbol", status_code=400)
    else:
        identifiers = _asset_provider_identifier_map(db, asset_id=asset.id, provider=ALPHA_VANTAGE_PROVIDER)
        symbol = identifiers.get("SYMBOL") or asset.symbol
    result = fetch_alpha_vantage_stock_dividends(
        db,
        symbol=symbol,
        year=year,
        tax_rate_pct=tax_rate_pct or Decimal("15"),
    )
    result.asset_id = asset.id
    result.asset_name = asset.name
    result.display_name = f"{asset.name} ({asset.symbol})" if asset.symbol else asset.name
    return result
