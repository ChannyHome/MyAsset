from dataclasses import dataclass, field

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.asset import Asset
from app.models.asset_quote import AssetQuote
from app.models.latest_quote import LatestQuote
from app.services.quote_provider import fetch_crypto_quote, fetch_latest_quote, normalize_symbol


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


def refresh_quotes_for_supported_assets(db: Session) -> QuoteUpdateSummary:
    summary = QuoteUpdateSummary()

    assets = list(
        db.scalars(
            select(Asset).where(
                Asset.symbol.is_not(None),
                Asset.asset_class.in_(["STOCK", "CRYPTO"]),
                Asset.quote_mode == "AUTO",
            )
        ).all()
    )

    for asset in assets:
        try:
            if not asset.symbol:
                summary.skipped_count += 1
                continue

            payload = None
            if asset.asset_class == "CRYPTO":
                payload = fetch_crypto_quote(
                    exchange_code=asset.exchange_code,
                    symbol=asset.symbol,
                    asset_currency=asset.currency,
                )

            if payload is None:
                symbol = normalize_symbol(asset.asset_class, asset.symbol, asset.currency)
                payload = fetch_latest_quote(symbol)

            if payload is None:
                summary.skipped_count += 1
                continue

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
            summary.updated_count += 1
        except Exception as exc:
            summary.failed_count += 1
            summary.errors.append(f"asset_id={asset.id}: {exc}")

    if summary.updated_count > 0:
        db.commit()
    else:
        db.rollback()

    return summary

