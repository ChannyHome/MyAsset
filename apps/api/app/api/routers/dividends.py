from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.asset import Asset
from app.models.user import User
from app.schemas.dividend import DividendEventOut, DividendLookupOut
from app.services.dividend_provider import (
    DividendProviderError,
    fetch_alpha_vantage_stock_dividends,
    fetch_data_go_kr_stock_dividends,
    fetch_dividends_for_asset,
)

router = APIRouter(prefix="/dividends", tags=["dividends"])


def _raise_provider_error(exc: DividendProviderError) -> None:
    raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


def _hide_raw(payload: DividendLookupOut, *, include_raw: bool) -> DividendLookupOut:
    if include_raw:
        return payload
    payload.items = [item.model_copy(update={"raw": None}) for item in payload.items]
    return payload


@router.get("/providers/data-go-kr/stock", response_model=DividendLookupOut)
def get_data_go_kr_stock_dividends(
    stock_name: str | None = Query(default=None, description="주식발행회사명. 예: 삼성전자"),
    crno: str | None = Query(default=None, description="법인등록번호. 예: 삼성전자 1301110006246"),
    isin_code: str | None = Query(default=None, description="ISIN code. 예: KR7005930003"),
    bas_dt: str | None = Query(default=None, description="기준일자 YYYYMMDD. 비우면 전체 최신 적재 기준에서 조회"),
    year: int | None = Query(default=None, ge=1900, le=2200),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=100, ge=1, le=1000),
    max_pages: int = Query(default=5, ge=1, le=20),
    tax_rate_pct: Decimal = Query(default=Decimal("15.4"), ge=0, le=100),
    include_raw: bool = Query(default=False),
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> DividendLookupOut:
    if not any([stock_name, crno, isin_code]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One of stock_name, crno, or isin_code is required.",
        )
    try:
        result = fetch_data_go_kr_stock_dividends(
            db,
            stock_name=stock_name,
            crno=crno,
            isin_code=isin_code,
            bas_dt=bas_dt,
            year=year,
            page=page,
            page_size=page_size,
            max_pages=max_pages,
            tax_rate_pct=tax_rate_pct,
        )
    except DividendProviderError as exc:
        _raise_provider_error(exc)
    return _hide_raw(result, include_raw=include_raw)


@router.get("/providers/alpha-vantage/stock", response_model=DividendLookupOut)
def get_alpha_vantage_stock_dividends(
    symbol: str = Query(..., min_length=1, max_length=32, description="US ticker. 예: VOO"),
    year: int | None = Query(default=None, ge=1900, le=2200),
    tax_rate_pct: Decimal = Query(default=Decimal("15"), ge=0, le=100),
    include_raw: bool = Query(default=False),
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> DividendLookupOut:
    try:
        result = fetch_alpha_vantage_stock_dividends(
            db,
            symbol=symbol,
            year=year,
            tax_rate_pct=tax_rate_pct,
        )
    except DividendProviderError as exc:
        _raise_provider_error(exc)
    return _hide_raw(result, include_raw=include_raw)


@router.get("/assets/{asset_id}/events", response_model=DividendLookupOut)
def get_asset_dividend_events(
    asset_id: int,
    year: int | None = Query(default=None, ge=1900, le=2200),
    tax_rate_pct: Decimal | None = Query(default=None, ge=0, le=100),
    include_raw: bool = Query(default=False),
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> DividendLookupOut:
    asset = db.scalar(select(Asset).where(Asset.id == asset_id))
    if asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
    try:
        result = fetch_dividends_for_asset(
            db,
            asset=asset,
            year=year,
            tax_rate_pct=tax_rate_pct,
        )
    except DividendProviderError as exc:
        _raise_provider_error(exc)
    return _hide_raw(result, include_raw=include_raw)

