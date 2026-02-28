import json
from dataclasses import dataclass
from datetime import datetime, UTC
from decimal import Decimal
from typing import Any

from sqlalchemy.orm import Session

from app.models.asset import Asset
from app.models.entity_change_log import EntityChangeLog
from app.models.holding import Holding
from app.models.liability import Liability
from app.models.portfolio import Portfolio
from app.models.user import User


def _json_default(value: Any) -> Any:
    if isinstance(value, Decimal):
        return str(value)
    if isinstance(value, datetime):
        if value.tzinfo is None:
            return value.replace(tzinfo=UTC).isoformat()
        return value.astimezone(UTC).isoformat()
    return str(value)


def dumps_json(value: dict[str, Any] | list[str] | None) -> str | None:
    if value is None:
        return None
    return json.dumps(value, ensure_ascii=False, default=_json_default)


def loads_json(value: str | None) -> Any:
    if not value:
        return None
    try:
        return json.loads(value)
    except Exception:
        return None


def _normalize_upper(value: str | None, fallback: str = "") -> str:
    if value is None:
        return fallback
    return str(value).strip().upper()


def snapshot_asset(asset: Asset) -> dict[str, Any]:
    return {
        "id": int(asset.id),
        "asset_class": str(asset.asset_class),
        "symbol": str(asset.symbol),
        "name": str(asset.name),
        "currency": str(asset.currency),
        "quote_mode": str(asset.quote_mode),
        "exchange_code": str(asset.exchange_code),
        "is_trade_supported": bool(asset.is_trade_supported),
        "meta_json": asset.meta_json,
        "updated_at": asset.updated_at,
    }


def snapshot_holding(holding: Holding) -> dict[str, Any]:
    return {
        "id": int(holding.id),
        "owner_user_id": int(holding.owner_user_id),
        "portfolio_id": int(holding.portfolio_id) if holding.portfolio_id is not None else None,
        "asset_id": int(holding.asset_id),
        "quantity": holding.quantity,
        "avg_price": holding.avg_price,
        "avg_price_currency": _normalize_upper(holding.avg_price_currency),
        "invested_amount": holding.invested_amount,
        "invested_amount_currency": _normalize_upper(holding.invested_amount_currency),
        "source_type": str(holding.source_type),
        "is_hidden": bool(holding.is_hidden),
        "memo": holding.memo,
        "updated_at": holding.updated_at,
    }


def snapshot_portfolio(portfolio: Portfolio) -> dict[str, Any]:
    return {
        "id": int(portfolio.id),
        "owner_user_id": int(portfolio.owner_user_id),
        "name": str(portfolio.name),
        "type": str(portfolio.type),
        "base_currency": _normalize_upper(portfolio.base_currency),
        "exchange_code": portfolio.exchange_code,
        "category": portfolio.category,
        "memo": portfolio.memo,
        "is_included": bool(portfolio.is_included),
        "is_hidden": bool(portfolio.is_hidden),
        "cumulative_deposit_amount": portfolio.cumulative_deposit_amount,
        "cumulative_withdrawal_amount": portfolio.cumulative_withdrawal_amount,
        "cashflow_source_type": str(portfolio.cashflow_source_type),
        "updated_at": portfolio.updated_at,
    }


def snapshot_liability(liability: Liability) -> dict[str, Any]:
    return {
        "id": int(liability.id),
        "owner_user_id": int(liability.owner_user_id),
        "portfolio_id": int(liability.portfolio_id) if liability.portfolio_id is not None else None,
        "name": str(liability.name),
        "liability_type": str(liability.liability_type),
        "currency": _normalize_upper(liability.currency),
        "outstanding_balance": liability.outstanding_balance,
        "interest_rate": liability.interest_rate,
        "monthly_payment": liability.monthly_payment,
        "source_type": str(liability.source_type),
        "is_included": bool(liability.is_included),
        "is_hidden": bool(liability.is_hidden),
        "memo": liability.memo,
        "updated_at": liability.updated_at,
    }


def changed_fields(before: dict[str, Any] | None, after: dict[str, Any] | None) -> list[str]:
    if before is None and after is None:
        return []
    if before is None:
        return sorted(list(after.keys() if after else []))
    if after is None:
        return sorted(list(before.keys()))

    fields: list[str] = []
    for key in sorted(set(before.keys()) | set(after.keys())):
        if before.get(key) != after.get(key):
            fields.append(key)
    return fields


@dataclass
class EntityLogInput:
    entity_type: str
    entity_id: int
    owner_user_id: int
    action: str
    before: dict[str, Any] | None
    after: dict[str, Any] | None
    reason: str | None
    actor_user_id: int | None
    actor_email: str | None
    request_id: str | None = None


def write_entity_change_log(db: Session, payload: EntityLogInput) -> EntityChangeLog:
    fields = changed_fields(payload.before, payload.after)
    row = EntityChangeLog(
        entity_type=payload.entity_type.upper(),
        entity_id=payload.entity_id,
        owner_user_id=payload.owner_user_id,
        action=payload.action.upper(),
        before_json=dumps_json(payload.before),
        after_json=dumps_json(payload.after),
        changed_fields_json=dumps_json(fields),
        reason=payload.reason,
        actor_user_id=payload.actor_user_id,
        actor_email=payload.actor_email,
        request_id=payload.request_id,
    )
    db.add(row)
    db.flush()
    return row


def actor_from_user(user: User) -> tuple[int, str]:
    return int(user.id), str(user.email)
