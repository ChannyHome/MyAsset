from fastapi import FastAPI

from app.api.routers.auth import router as auth_router
from app.api.routers.health import router as health_router
from app.core.config import settings



def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name)
    app.include_router(health_router, prefix=settings.api_v1_prefix)
    app.include_router(auth_router, prefix=settings.api_v1_prefix)
    return app


app = create_app()