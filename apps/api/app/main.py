from fastapi import FastAPI

from app.api.middleware.access_log import ApiAccessLogMiddleware
from app.api.routers.assets import router as assets_router
from app.api.routers.auth import router as auth_router
from app.api.routers.health import router as health_router
from app.api.routers.holdings import router as holdings_router
from app.api.routers.households import router as households_router
from app.api.routers.portfolios import router as portfolios_router
from app.core.config import settings



def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name)
    app.add_middleware(ApiAccessLogMiddleware)
    app.include_router(health_router, prefix=settings.api_v1_prefix)
    app.include_router(auth_router, prefix=settings.api_v1_prefix)
    app.include_router(households_router, prefix=settings.api_v1_prefix)
    app.include_router(portfolios_router, prefix=settings.api_v1_prefix)
    app.include_router(assets_router, prefix=settings.api_v1_prefix)
    app.include_router(holdings_router, prefix=settings.api_v1_prefix)
    return app


app = create_app()
