from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.middleware.access_log import ApiAccessLogMiddleware
from app.api.routers.admin_secrets import router as admin_secrets_router
from app.api.routers.admin_history import router as admin_history_router
from app.api.routers.admin_users import router as admin_users_router
from app.api.routers.analytics import router as analytics_router
from app.api.routers.assets import router as assets_router
from app.api.routers.auth import router as auth_router
from app.api.routers.health import router as health_router
from app.api.routers.holdings import router as holdings_router
from app.api.routers.households import router as households_router
from app.api.routers.liabilities import router as liabilities_router
from app.api.routers.portfolios import router as portfolios_router
from app.api.routers.quotes import router as quotes_router
from app.api.routers.release_notes import router as release_notes_router
from app.api.routers.settings import router as settings_router
from app.api.routers.user_settings import router as user_settings_router
from app.core.config import settings
from app.tasks.quotes_scheduler import start_quote_scheduler, stop_quote_scheduler


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name)
    origins = settings.cors_allow_origins_list()
    if origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    app.add_middleware(ApiAccessLogMiddleware)
    app.include_router(health_router, prefix=settings.api_v1_prefix)
    app.include_router(auth_router, prefix=settings.api_v1_prefix)
    app.include_router(admin_users_router, prefix=settings.api_v1_prefix)
    app.include_router(admin_secrets_router, prefix=settings.api_v1_prefix)
    app.include_router(admin_history_router, prefix=settings.api_v1_prefix)
    app.include_router(households_router, prefix=settings.api_v1_prefix)
    app.include_router(portfolios_router, prefix=settings.api_v1_prefix)
    app.include_router(assets_router, prefix=settings.api_v1_prefix)
    app.include_router(holdings_router, prefix=settings.api_v1_prefix)
    app.include_router(liabilities_router, prefix=settings.api_v1_prefix)
    app.include_router(quotes_router, prefix=settings.api_v1_prefix)
    app.include_router(release_notes_router, prefix=settings.api_v1_prefix)
    app.include_router(settings_router, prefix=settings.api_v1_prefix)
    app.include_router(user_settings_router, prefix=settings.api_v1_prefix)
    app.include_router(analytics_router, prefix=settings.api_v1_prefix)

    @app.on_event("startup")
    def on_startup() -> None:
        start_quote_scheduler()

    @app.on_event("shutdown")
    def on_shutdown() -> None:
        stop_quote_scheduler()

    return app


app = create_app()
