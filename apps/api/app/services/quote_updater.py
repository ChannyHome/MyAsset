from dataclasses import dataclass, field

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.asset import Asset
from app.models.asset_quote import AssetQuote
from app.services.quote_provider import fetch_latest_quote, normalize_symbol


@dataclass
class QuoteUpdateSummary:
    updated_count: int = 0
    skipped_count: int = 0
    failed_count: int = 0
    errors: list[str] = field(default_factory=list)


def refresh_quotes_for_supported_assets(db: Session) -> QuoteUpdateSummary:
    summary = QuoteUpdateSummary()

    assets = list(
        db.scalars(
            select(Asset).where(
                Asset.symbol.is_not(None),
                Asset.asset_class.in_(["STOCK", "CRYPTO"]),
            )
        ).all()
    )

    for asset in assets:
        try:
            if not asset.symbol:
                summary.skipped_count += 1
                continue

            symbol = normalize_symbol(asset.asset_class, asset.symbol, asset.currency)
            payload = fetch_latest_quote(symbol)
            if payload is None:
                summary.skipped_count += 1
                continue

            db.add(
                AssetQuote(
                    asset_id=asset.id,
                    price=payload.price,
                    currency=payload.currency or asset.currency,
                    change_value=payload.change_value,
                    change_pct=payload.change_pct,
                    as_of=payload.as_of,
                    source=payload.source,
                )
            )
            summary.updated_count += 1
        except Exception as exc:
            summary.failed_count += 1
            summary.errors.append(f"asset_id={asset.id}: {exc}")

    if summary.updated_count > 0:
        db.commit()
    else:
        db.rollback()

    return summary
