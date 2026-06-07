from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime
from decimal import Decimal
from typing import Any, Iterable

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.asset import Asset
from app.models.chat_message import ChatMessage
from app.models.chat_session import ChatSession
from app.models.holding import Holding
from app.models.household import HouseholdMember
from app.models.liability import Liability
from app.models.portfolio import Portfolio
from app.models.user import User
from app.models.valuation_snapshot import ValuationSnapshot
from app.schemas.chat import (
    ChatMessageCreateIn,
    ChatMessageOut,
    ChatSessionCreateIn,
    ChatSessionOut,
    ChatSessionUpdateIn,
    ChatStatusOut,
    ChatSourceCard,
    ChatToolTrace,
)
from app.services.analytics_summary import calculate_summary_values
from app.services.currency import MissingFxRateError
from app.services.openai_client import OpenAIConfigError, call_openai_responses, resolve_openai_config
from app.services.quick_insight import get_quick_insight

_PERIOD_ALIASES: list[tuple[str, str]] = [
    ("30D", "30d"),
    ("30D", "30일"),
    ("30D", "30 day"),
    ("7D", "7d"),
    ("7D", "7일"),
    ("7D", "7 day"),
    ("1D", "1d"),
    ("1D", "오늘"),
    ("1D", "today"),
]


@dataclass
class ChatRuntimeContext:
    scope_type: str
    scope_id: int
    scope_user_ids: list[int]
    primary_household_id: int | None


@dataclass
class ToolBundle:
    traces: list[ChatToolTrace]
    cards: list[ChatSourceCard]
    prompt_sections: list[str]


class ChatServiceError(RuntimeError):
    pass


class ChatPermissionError(ChatServiceError):
    pass


class ChatUnavailableError(ChatServiceError):
    pass


class ChatInputError(ChatServiceError):
    pass


def get_chat_status(db: Session, *, current_user: User) -> ChatStatusOut:
    config = resolve_openai_config(db)
    available = bool(config.enabled and config.api_key)
    if available:
        message = "Chat is ready."
    elif config.enabled and not config.api_key:
        message = "Chat is unavailable. Ask an admin to configure the OpenAI API key in App Settings."
    else:
        message = "Chat is currently disabled by admin settings."
    return ChatStatusOut(
        available=available,
        enabled=config.enabled,
        source=config.source,  # type: ignore[arg-type]
        message=message,
        default_model=config.default_model,
    )


def _normalize_display_currency(display_currency: str | None) -> str:
    return "USD" if str(display_currency or "").upper() == "USD" else "KRW"


def _infer_period(text: str) -> str:
    lower = text.lower()
    for period, alias in _PERIOD_ALIASES:
        if alias in lower:
            return period
    return "7D"


def _trim_title(text: str) -> str:
    normalized = " ".join((text or "").split()).strip()
    if not normalized:
        return "New chat"
    return normalized[:80]


def _serialize_card(card: ChatSourceCard) -> dict[str, Any]:
    return card.model_dump(mode="json")


def _serialize_trace(trace: ChatToolTrace) -> dict[str, Any]:
    return trace.model_dump(mode="json")


def _parse_cards(raw: Any) -> list[ChatSourceCard]:
    if not isinstance(raw, list):
        return []
    items: list[ChatSourceCard] = []
    for item in raw:
        if isinstance(item, dict):
            try:
                items.append(ChatSourceCard.model_validate(item))
            except Exception:
                continue
    return items


def _parse_traces(raw: Any) -> list[ChatToolTrace]:
    if not isinstance(raw, list):
        return []
    items: list[ChatToolTrace] = []
    for item in raw:
        if isinstance(item, dict):
            try:
                items.append(ChatToolTrace.model_validate(item))
            except Exception:
                continue
    return items


def _get_primary_household_id(db: Session, user_id: int) -> int | None:
    stmt = (
        select(HouseholdMember.household_id)
        .where(HouseholdMember.user_id == user_id)
        .order_by(HouseholdMember.household_id.asc())
        .limit(1)
    )
    return db.scalar(stmt)


def _resolve_scope_user_ids(db: Session, current_user: User, scope_type: str, scope_id: int) -> list[int]:
    normalized_scope_type = (scope_type or "USER").upper()
    if normalized_scope_type == "HOUSEHOLD":
        member_ids = list(
            db.scalars(
                select(HouseholdMember.user_id).where(HouseholdMember.household_id == scope_id)
            ).all()
        )
        if current_user.id not in member_ids and current_user.role != "ADMIN":
            raise ChatPermissionError("You do not have access to this household scope")
        if not member_ids:
            raise ChatInputError("Household scope has no members")
        return member_ids
    if scope_id != current_user.id and current_user.role != "ADMIN":
        raise ChatPermissionError("You do not have access to this user scope")
    return [scope_id]


def resolve_chat_runtime_context(
    db: Session,
    *,
    current_user: User,
    scope_type: str | None,
    scope_id: int | None,
) -> ChatRuntimeContext:
    primary_household_id = _get_primary_household_id(db, current_user.id)
    normalized_scope_type = (scope_type or "USER").upper()
    if normalized_scope_type == "HOUSEHOLD":
        effective_scope_id = scope_id or primary_household_id
        if effective_scope_id is None:
            raise ChatInputError("No household scope is available for this user")
    else:
        normalized_scope_type = "USER"
        effective_scope_id = scope_id or current_user.id

    scope_user_ids = _resolve_scope_user_ids(db, current_user, normalized_scope_type, effective_scope_id)
    return ChatRuntimeContext(
        scope_type=normalized_scope_type,
        scope_id=effective_scope_id,
        scope_user_ids=scope_user_ids,
        primary_household_id=primary_household_id,
    )


def _summary_tool(
    db: Session,
    *,
    context: ChatRuntimeContext,
    display_currency: str,
) -> ToolBundle:
    values = calculate_summary_values(
        db=db,
        scope_user_ids=context.scope_user_ids,
        include_hidden=False,
        include_excluded_portfolios=False,
        include_excluded_liabilities=False,
        display_currency=display_currency,
        fx_strict_mode=False,
    )
    payload = {
        "gross_assets_total": str(values.gross_assets_total),
        "liabilities_total": str(values.liabilities_total),
        "net_assets_total": str(values.net_assets_total),
        "invested_principal_total": str(values.invested_principal_total),
        "net_contribution_total": str(values.net_contribution_total),
        "as_of": values.as_of.isoformat(),
        "display_currency": display_currency,
    }
    card = ChatSourceCard(
        title="Summary",
        as_of=values.as_of,
        scope=f"{context.scope_type}:{context.scope_id}",
        summary=f"Gross {values.gross_assets_total} / Net {values.net_assets_total} / Liabilities {values.liabilities_total}",
        data=payload,
    )
    trace = ChatToolTrace(tool_name="summary", summary="Loaded current summary", payload=payload)
    prompt = f"[summary]\n{payload}"
    return ToolBundle(traces=[trace], cards=[card], prompt_sections=[prompt])


def _quick_insight_tool(
    db: Session,
    *,
    context: ChatRuntimeContext,
    display_currency: str,
    user_text: str,
) -> ToolBundle:
    period = _infer_period(user_text)
    insight = get_quick_insight(
        db=db,
        scope_type=context.scope_type,
        scope_id=context.scope_id,
        scope_user_ids=context.scope_user_ids,
        display_currency=display_currency,
        period=period,  # type: ignore[arg-type]
    )
    payload = insight.model_dump(mode="json")
    card = ChatSourceCard(
        title=f"Quick Insight {period}",
        as_of=insight.current_as_of,
        scope=f"{context.scope_type}:{context.scope_id}",
        summary=insight.summary_alert.comment,
        data=payload,
    )
    trace = ChatToolTrace(tool_name="quick_insight", summary=f"Loaded Quick Insight {period}", payload={"period": period})
    prompt = f"[quick_insight period={period}]\n{payload}"
    return ToolBundle(traces=[trace], cards=[card], prompt_sections=[prompt])


def _find_matching_portfolios(db: Session, *, user_ids: list[int], user_text: str) -> list[Portfolio]:
    portfolios = list(
        db.scalars(
            select(Portfolio).where(
                Portfolio.owner_user_id.in_(user_ids),
                Portfolio.is_hidden.is_(False),
            )
        ).all()
    )
    lowered = user_text.lower()
    matched = [portfolio for portfolio in portfolios if portfolio.name.lower() in lowered]
    return matched[:3] if matched else portfolios[:3]


def _portfolio_overview_tool(
    db: Session,
    *,
    context: ChatRuntimeContext,
    display_currency: str,
    user_text: str,
) -> ToolBundle:
    portfolios = _find_matching_portfolios(db, user_ids=context.scope_user_ids, user_text=user_text)
    cards: list[ChatSourceCard] = []
    traces: list[ChatToolTrace] = []
    prompt_sections: list[str] = []
    for portfolio in portfolios:
        payload = {
            "portfolio_id": portfolio.id,
            "portfolio_name": portfolio.name,
            "type": portfolio.type,
            "base_currency": portfolio.base_currency,
            "net_contribution_total": str(portfolio.cumulative_deposit_amount - portfolio.cumulative_withdrawal_amount),
            "cumulative_deposit_amount": str(portfolio.cumulative_deposit_amount),
            "cumulative_withdrawal_amount": str(portfolio.cumulative_withdrawal_amount),
            "display_currency": display_currency,
        }
        cards.append(
            ChatSourceCard(
                title=f"Portfolio: {portfolio.name}",
                as_of=portfolio.updated_at,
                scope=f"{context.scope_type}:{context.scope_id}",
                summary=f"Type {portfolio.type}, base {portfolio.base_currency}",
                data=payload,
            )
        )
        traces.append(
            ChatToolTrace(
                tool_name="portfolio_overview",
                summary=f"Loaded portfolio overview for {portfolio.name}",
                payload={"portfolio_id": portfolio.id},
            )
        )
        prompt_sections.append(f"[portfolio_overview]\n{payload}")
    return ToolBundle(traces=traces, cards=cards, prompt_sections=prompt_sections)


def _find_matching_holdings(db: Session, *, user_ids: list[int], user_text: str) -> list[dict[str, Any]]:
    lowered = user_text.lower()
    rows = db.execute(
        select(Asset.name, Asset.symbol, Asset.asset_class, Portfolio.name)
        .select_from(Holding)
        .join(Asset, Asset.id == Holding.asset_id)
        .outerjoin(Portfolio, Portfolio.id == Holding.portfolio_id)
        .where(Holding.owner_user_id.in_(user_ids), Holding.is_hidden.is_(False))
        .limit(100)
    ).all()
    matched: list[dict[str, Any]] = []
    for asset_name, symbol, asset_class, portfolio_name in rows:
        full = f"{asset_name} {symbol or ''} {portfolio_name or ''}".lower()
        if asset_name.lower() in lowered or (symbol and symbol.lower() in lowered) or full in lowered:
            matched.append(
                {
                    "asset_name": asset_name,
                    "symbol": symbol,
                    "asset_class": asset_class,
                    "portfolio_name": portfolio_name or "Unassigned",
                }
            )
    return matched[:5]


def _holding_lookup_tool(
    db: Session,
    *,
    context: ChatRuntimeContext,
    user_text: str,
) -> ToolBundle:
    matches = _find_matching_holdings(db, user_ids=context.scope_user_ids, user_text=user_text)
    if not matches:
        return ToolBundle(traces=[], cards=[], prompt_sections=[])
    card = ChatSourceCard(
        title="Holding matches",
        as_of=None,
        scope=f"{context.scope_type}:{context.scope_id}",
        summary=f"Matched {len(matches)} holdings/assets",
        data={"matches": matches},
    )
    trace = ChatToolTrace(tool_name="holding_lookup", summary=f"Matched {len(matches)} holdings", payload={"count": len(matches)})
    return ToolBundle(traces=[trace], cards=[card], prompt_sections=[f"[holding_lookup]\n{card.data}"])


def _liability_overview_tool(
    db: Session,
    *,
    context: ChatRuntimeContext,
    user_text: str,
) -> ToolBundle:
    liabilities = list(
        db.scalars(
            select(Liability).where(
                Liability.owner_user_id.in_(context.scope_user_ids),
                Liability.is_hidden.is_(False),
            )
        ).all()
    )
    lowered = user_text.lower()
    matched = [row for row in liabilities if row.name.lower() in lowered or row.liability_type.lower() in lowered]
    if not matched:
        matched = liabilities[:5]
    data = [
        {
            "liability_id": row.id,
            "name": row.name,
            "type": row.liability_type,
            "currency": row.currency,
            "outstanding_balance": str(row.outstanding_balance),
            "portfolio_id": row.portfolio_id,
            "interest_rate": str(row.interest_rate) if row.interest_rate is not None else None,
        }
        for row in matched[:5]
    ]
    card = ChatSourceCard(
        title="Liability overview",
        as_of=max((row.updated_at for row in matched[:5]), default=None),
        scope=f"{context.scope_type}:{context.scope_id}",
        summary=f"Loaded {len(data)} liabilities",
        data={"liabilities": data},
    )
    trace = ChatToolTrace(tool_name="liability_overview", summary=f"Loaded {len(data)} liabilities", payload={"count": len(data)})
    return ToolBundle(traces=[trace], cards=[card], prompt_sections=[f"[liability_overview]\n{card.data}"])


def _latest_snapshots(db: Session, *, owner_user_id: int, limit: int) -> list[ValuationSnapshot]:
    return list(
        db.scalars(
            select(ValuationSnapshot)
            .where(
                ValuationSnapshot.scope_type == "USER",
                ValuationSnapshot.scope_id == owner_user_id,
                ValuationSnapshot.display_currency == "KRW",
            )
            .order_by(ValuationSnapshot.snapshot_date.desc(), ValuationSnapshot.id.desc())
            .limit(limit)
        ).all()
    )


def _snapshot_summary_tool(db: Session, *, current_user: User) -> ToolBundle:
    snapshots = _latest_snapshots(db, owner_user_id=current_user.id, limit=3)
    if not snapshots:
        return ToolBundle(traces=[], cards=[], prompt_sections=[])
    data = [
        {
            "snapshot_id": row.id,
            "snapshot_date": row.snapshot_date.isoformat(),
            "as_of": row.as_of.isoformat(),
            "gross_assets_krw": str(row.assets_total),
            "liabilities_krw": str(row.liabilities_total),
            "net_assets_krw": str(row.net_worth_total),
        }
        for row in snapshots
    ]
    card = ChatSourceCard(
        title="Recent valuation snapshots",
        as_of=snapshots[0].as_of,
        scope=f"USER:{current_user.id}",
        summary=f"Loaded {len(data)} recent valuation snapshots",
        data={"snapshots": data},
    )
    trace = ChatToolTrace(tool_name="snapshot_summary", summary="Loaded recent valuation snapshots", payload={"count": len(data)})
    return ToolBundle(traces=[trace], cards=[card], prompt_sections=[f"[snapshot_summary]\n{card.data}"])


def _snapshot_compare_tool(
    db: Session,
    *,
    current_user: User,
    context: ChatRuntimeContext,
    display_currency: str,
) -> ToolBundle:
    latest = _latest_snapshots(db, owner_user_id=current_user.id, limit=1)
    if not latest:
        return ToolBundle(traces=[], cards=[], prompt_sections=[])
    latest_snapshot = latest[0]
    values = calculate_summary_values(
        db=db,
        scope_user_ids=context.scope_user_ids,
        include_hidden=False,
        include_excluded_portfolios=False,
        include_excluded_liabilities=False,
        display_currency=display_currency,
        fx_strict_mode=False,
    )
    if display_currency == "USD":
        snapshot_gross = Decimal(latest_snapshot.gross_assets_usd)
        snapshot_liabilities = Decimal(latest_snapshot.liabilities_usd)
        snapshot_net = Decimal(latest_snapshot.net_assets_usd)
    else:
        snapshot_gross = Decimal(latest_snapshot.gross_assets_krw)
        snapshot_liabilities = Decimal(latest_snapshot.liabilities_krw)
        snapshot_net = Decimal(latest_snapshot.net_assets_krw)
    payload = {
        "snapshot_id": latest_snapshot.id,
        "display_currency": display_currency,
        "snapshot_gross": str(snapshot_gross),
        "snapshot_liabilities": str(snapshot_liabilities),
        "snapshot_net": str(snapshot_net),
        "current_gross": str(values.gross_assets_total),
        "current_liabilities": str(values.liabilities_total),
        "current_net": str(values.net_assets_total),
        "gross_delta": str(values.gross_assets_total - snapshot_gross),
        "liabilities_delta": str(values.liabilities_total - snapshot_liabilities),
        "net_delta": str(values.net_assets_total - snapshot_net),
    }
    card = ChatSourceCard(
        title=f"Snapshot #{latest_snapshot.id} vs current",
        as_of=values.as_of,
        scope=f"{context.scope_type}:{context.scope_id}",
        summary=f"Net delta {payload['net_delta']} {display_currency}",
        data=payload,
    )
    trace = ChatToolTrace(tool_name="snapshot_compare", summary="Compared latest snapshot against current state", payload={"snapshot_id": latest_snapshot.id})
    return ToolBundle(traces=[trace], cards=[card], prompt_sections=[f"[snapshot_compare]\n{payload}"])


def _networth_trend_tool(
    db: Session,
    *,
    context: ChatRuntimeContext,
    display_currency: str,
) -> ToolBundle:
    rows = list(
        db.scalars(
            select(ValuationSnapshot)
            .where(
                ValuationSnapshot.scope_type == context.scope_type,
                ValuationSnapshot.scope_id == context.scope_id,
                ValuationSnapshot.display_currency == display_currency,
            )
            .order_by(ValuationSnapshot.snapshot_date.desc(), ValuationSnapshot.id.desc())
            .limit(30)
        ).all()
    )
    if not rows:
        return ToolBundle(traces=[], cards=[], prompt_sections=[])
    latest = rows[0]
    oldest = rows[-1]
    payload = {
        "display_currency": display_currency,
        "points": [
            {
                "snapshot_date": row.snapshot_date.isoformat(),
                "gross_assets_total": str(row.assets_total),
                "liabilities_total": str(row.liabilities_total),
                "net_assets_total": str(row.net_worth_total),
            }
            for row in reversed(rows)
        ],
        "gross_delta": str(Decimal(latest.assets_total) - Decimal(oldest.assets_total)),
        "net_delta": str(Decimal(latest.net_worth_total) - Decimal(oldest.net_worth_total)),
    }
    card = ChatSourceCard(
        title="Networth trend",
        as_of=latest.as_of,
        scope=f"{context.scope_type}:{context.scope_id}",
        summary=f"Last {len(rows)} points, net delta {payload['net_delta']}",
        data=payload,
    )
    trace = ChatToolTrace(tool_name="networth_trend", summary=f"Loaded {len(rows)} valuation points", payload={"count": len(rows)})
    return ToolBundle(traces=[trace], cards=[card], prompt_sections=[f"[networth_trend]\n{payload}"])


def _combine_bundles(bundles: Iterable[ToolBundle]) -> ToolBundle:
    traces: list[ChatToolTrace] = []
    cards: list[ChatSourceCard] = []
    prompt_sections: list[str] = []
    for bundle in bundles:
        traces.extend(bundle.traces)
        cards.extend(bundle.cards)
        prompt_sections.extend(bundle.prompt_sections)
    return ToolBundle(traces=traces, cards=cards, prompt_sections=prompt_sections)


def _build_tool_context(
    db: Session,
    *,
    current_user: User,
    context: ChatRuntimeContext,
    display_currency: str,
    user_text: str,
) -> ToolBundle:
    lowered = user_text.lower()
    bundles: list[ToolBundle] = [
        _summary_tool(db, context=context, display_currency=display_currency),
        _quick_insight_tool(db, context=context, display_currency=display_currency, user_text=user_text),
    ]

    if any(keyword in lowered for keyword in ["snapshot", "스냅샷"]):
        bundles.append(_snapshot_summary_tool(db, current_user=current_user))
        bundles.append(_snapshot_compare_tool(db, current_user=current_user, context=context, display_currency=display_currency))

    if any(keyword in lowered for keyword in ["trend", "추이", "흐름"]):
        bundles.append(_networth_trend_tool(db, context=context, display_currency=display_currency))

    if any(keyword in lowered for keyword in ["포트폴리오", "portfolio"]):
        bundles.append(_portfolio_overview_tool(db, context=context, display_currency=display_currency, user_text=user_text))

    if any(keyword in lowered for keyword in ["부채", "대출", "liability", "loan"]):
        bundles.append(_liability_overview_tool(db, context=context, user_text=user_text))

    asset_matches = _holding_lookup_tool(db, context=context, user_text=user_text)
    if asset_matches.traces:
        bundles.append(asset_matches)

    return _combine_bundles(bundles)


def _build_system_prompt(context: ChatRuntimeContext, display_currency: str) -> str:
    return (
        "You are MyAsset Chat v1, a read-only financial data explainer. "
        "Do not invent numbers. Use only the provided tool context. "
        "Do not suggest trades or make investment decisions. "
        "Explain in Korean unless the user clearly asks for another language. "
        f"Current scope: {context.scope_type}:{context.scope_id}. "
        f"Display currency: {display_currency}. "
        "At the end, add a short '근거' line that references the most relevant source cards by title."
    )


def _build_user_prompt(*, user_text: str, tool_bundle: ToolBundle) -> str:
    sections = "\n\n".join(tool_bundle.prompt_sections)
    return f"USER QUESTION:\n{user_text}\n\nTOOL CONTEXT:\n{sections}"


def _message_out(row: ChatMessage) -> ChatMessageOut:
    return ChatMessageOut(
        id=row.id,
        session_id=row.session_id,
        role=row.role,  # type: ignore[arg-type]
        content_text=row.content_text,
        source_cards_json=_parse_cards(row.source_cards_json),
        tool_calls_json=_parse_traces(row.tool_calls_json),
        usage_json=row.usage_json if isinstance(row.usage_json, dict) else None,
        latency_ms=row.latency_ms,
        created_at=row.created_at,
    )


def list_chat_sessions(db: Session, *, current_user: User) -> list[ChatSessionOut]:
    rows = list(
        db.scalars(
            select(ChatSession)
            .where(ChatSession.owner_user_id == current_user.id)
            .order_by(
                ChatSession.last_message_at.is_(None).asc(),
                ChatSession.last_message_at.desc(),
                ChatSession.updated_at.desc(),
                ChatSession.id.desc(),
            )
        ).all()
    )
    return [ChatSessionOut.model_validate(row) for row in rows]


def create_chat_session(db: Session, *, current_user: User, payload: ChatSessionCreateIn) -> ChatSessionOut:
    config = resolve_openai_config(db)
    row = ChatSession(
        owner_user_id=current_user.id,
        household_id=_get_primary_household_id(db, current_user.id),
        title=_trim_title(payload.title or "New chat"),
        status="ACTIVE",
        model_name=config.default_model,
        last_message_at=None,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return ChatSessionOut.model_validate(row)


def update_chat_session(
    db: Session,
    *,
    current_user: User,
    session_id: int,
    payload: ChatSessionUpdateIn,
) -> ChatSessionOut:
    row = db.scalar(select(ChatSession).where(ChatSession.id == session_id, ChatSession.owner_user_id == current_user.id))
    if row is None:
        raise ChatInputError("Chat session not found")
    if payload.title is not None:
        row.title = _trim_title(payload.title)
    if payload.status is not None:
        row.status = payload.status
    db.commit()
    db.refresh(row)
    return ChatSessionOut.model_validate(row)


def list_chat_messages(db: Session, *, current_user: User, session_id: int) -> list[ChatMessageOut]:
    session = db.scalar(select(ChatSession).where(ChatSession.id == session_id, ChatSession.owner_user_id == current_user.id))
    if session is None:
        raise ChatInputError("Chat session not found")
    rows = list(
        db.scalars(
            select(ChatMessage)
            .where(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.asc(), ChatMessage.id.asc())
        ).all()
    )
    return [_message_out(row) for row in rows]


def create_chat_message(
    db: Session,
    *,
    current_user: User,
    session_id: int,
    payload: ChatMessageCreateIn,
) -> list[ChatMessageOut]:
    session = db.scalar(select(ChatSession).where(ChatSession.id == session_id, ChatSession.owner_user_id == current_user.id))
    if session is None:
        raise ChatInputError("Chat session not found")

    context = resolve_chat_runtime_context(
        db,
        current_user=current_user,
        scope_type=payload.scope_type,
        scope_id=payload.scope_id,
    )
    display_currency = _normalize_display_currency(payload.display_currency)

    user_message = ChatMessage(
        session_id=session.id,
        role="USER",
        content_text=payload.content_text.strip(),
        source_cards_json=None,
        tool_calls_json=None,
        usage_json=None,
        latency_ms=None,
    )
    db.add(user_message)
    db.flush()

    if session.title == "New chat":
        session.title = _trim_title(payload.content_text)

    tool_bundle = _build_tool_context(
        db,
        current_user=current_user,
        context=context,
        display_currency=display_currency,
        user_text=payload.content_text,
    )

    try:
        openai_result = call_openai_responses(
            db,
            system_prompt=_build_system_prompt(context, display_currency),
            user_prompt=_build_user_prompt(user_text=payload.content_text, tool_bundle=tool_bundle),
            model_name=session.model_name,
        )
    except MissingFxRateError as exc:
        db.rollback()
        raise ChatUnavailableError(f"Missing FX rate for {exc.from_currency}->{exc.to_currency}") from exc
    except OpenAIConfigError as exc:
        db.rollback()
        raise ChatUnavailableError(str(exc)) from exc
    except Exception as exc:
        db.rollback()
        raise ChatServiceError(str(exc)) from exc

    assistant_message = ChatMessage(
        session_id=session.id,
        role="ASSISTANT",
        content_text=openai_result.output_text,
        source_cards_json=[_serialize_card(card) for card in tool_bundle.cards],
        tool_calls_json=[_serialize_trace(trace) for trace in tool_bundle.traces],
        usage_json=openai_result.usage,
        latency_ms=openai_result.latency_ms,
    )
    db.add(assistant_message)
    session.last_message_at = datetime.now(UTC).replace(tzinfo=None)
    session.model_name = openai_result.model_name
    db.commit()
    db.refresh(user_message)
    db.refresh(assistant_message)
    db.refresh(session)
    return [_message_out(user_message), _message_out(assistant_message)]
