from dataclasses import dataclass, field

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.asset import Asset
from app.models.asset_quote import AssetQuote
from app.models.latest_quote import LatestQuote
from app.services.quote_provider import (
    QuotePayload,
    fetch_crypto_quote,
    fetch_latest_quote,
    fetch_real_estate_quote,
    normalize_symbol,
)
from app.services.secret_vault import resolve_secret_value

SUPPORTED_AUTO_ASSET_CLASSES = {"STOCK", "CRYPTO", "REAL_ESTATE"}


@dataclass
class QuoteUpdateSummary:
    updated_count: int = 0
    skipped_count: int = 0
    failed_count: int = 0
    errors: list[str] = field(default_factory=list)


def _upsert_latest_quote(db: Session, asset_id: int, quote: AssetQuote) -> None:
    latest = db.scalar(select(LatestQuote).where(LatestQuote.asset_id == asset_id))
    if latest is None:
        db.add(
            LatestQuote(
                asset_id=asset_id,
                price=quote.price,
                currency=quote.currency,
                change_value=quote.change_value,
                change_pct=quote.change_pct,
                as_of=quote.as_of,
                source=quote.source,
            )
        )
        return

    latest.price = quote.price
    latest.currency = quote.currency
    latest.change_value = quote.change_value
    latest.change_pct = quote.change_pct
    latest.as_of = quote.as_of
    latest.source = quote.source


def _resolve_data_go_kr_service_key(db: Session) -> str | None:
    value, _ = resolve_secret_value(
        db=db,
        provider="DATA_GO_KR",
        key_name="SERVICE_KEY",
        env_fallback=settings.data_go_kr_service_key,
    )
    return value


def _fetch_payload_for_asset(asset: Asset, data_go_kr_service_key: str | None) -> QuotePayload | None:
    if not asset.symbol:
        return None

    payload = None
    if asset.asset_class == "CRYPTO":
        payload = fetch_crypto_quote(
            exchange_code=asset.exchange_code,
            symbol=asset.symbol,
            asset_currency=asset.currency,
        )
    elif asset.asset_class == "REAL_ESTATE":
        payload = fetch_real_estate_quote(
            exchange_code=asset.exchange_code,
            asset_currency=asset.currency,
            meta_json=asset.meta_json,
            service_key=data_go_kr_service_key,
        )

    if payload is None and asset.asset_class != "REAL_ESTATE":
        symbol = normalize_symbol(asset.asset_class, asset.symbol, asset.currency)
        payload = fetch_latest_quote(symbol)

    return payload


def _apply_payload_for_asset(db: Session, asset: Asset, payload: QuotePayload) -> None:
    history_quote = AssetQuote(
        asset_id=asset.id,
        price=payload.price,
        currency=payload.currency or asset.currency,
        change_value=payload.change_value,
        change_pct=payload.change_pct,
        as_of=payload.as_of,
        source=payload.source,
    )
    db.add(history_quote)
    _upsert_latest_quote(db, asset.id, history_quote)


def refresh_quote_for_asset_id(db: Session, asset_id: int) -> tuple[LatestQuote | None, str | None]:
    asset = db.scalar(select(Asset).where(Asset.id == asset_id))
    if asset is None:
        return None, "Asset not found"
    if asset.quote_mode != "AUTO":
        return None, "Quote mode is not AUTO"
    if asset.asset_class not in SUPPORTED_AUTO_ASSET_CLASSES:
        return None, f"Unsupported asset class: {asset.asset_class}"
    if not asset.symbol:
        return None, "Asset symbol is required"

    data_go_kr_service_key = _resolve_data_go_kr_service_key(db)
    payload = _fetch_payload_for_asset(asset, data_go_kr_service_key)
    if payload is None:
        return None, "Quote provider returned no data"

    try:
        _apply_payload_for_asset(db, asset, payload)
        db.commit()
    except Exception as exc:
        db.rollback()
        return None, str(exc)

    latest = db.scalar(select(LatestQuote).where(LatestQuote.asset_id == asset.id))
    if latest is None:
        return None, "Latest quote upsert failed"
    return latest, None


def refresh_quotes_for_supported_assets(db: Session) -> QuoteUpdateSummary:
    summary = QuoteUpdateSummary()
    data_go_kr_service_key = _resolve_data_go_kr_service_key(db)

    assets = list(
        db.scalars(
            select(Asset).where(
                Asset.symbol.is_not(None),
                Asset.asset_class.in_(list(SUPPORTED_AUTO_ASSET_CLASSES)),
                Asset.quote_mode == "AUTO",
            )
        ).all()
    )

    for asset in assets:
        try:
            if not asset.symbol:
                summary.skipped_count += 1
                continue

            payload = _fetch_payload_for_asset(asset, data_go_kr_service_key)
            if payload is None:
                summary.skipped_count += 1
                continue

            _apply_payload_for_asset(db, asset, payload)
            summary.updated_count += 1
        except Exception as exc:
            summary.failed_count += 1
            summary.errors.append(f"asset_id={asset.id}: {exc}")

    if summary.updated_count > 0:
        db.commit()
    else:
        db.rollback()

    return summary
