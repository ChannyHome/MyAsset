# MyAsset API Architecture

## Directory Map
- `app/main.py`: FastAPI app factory, middleware, routers, scheduler startup/shutdown.
- `app/api/routers`: HTTP endpoints.
- `app/api/deps.py`: auth/session dependencies.
- `app/api/middleware/access_log.py`: access/audit log middleware entry.
- `app/core`: config, DB session, security, audit/access logging helpers.
- `app/models`: SQLAlchemy ORM models.
- `app/schemas`: Pydantic request/response schemas.
- `app/services`: business logic and provider integrations.
- `app/tasks`: scheduler startup and job registration.
- `alembic/versions`: DB migrations.

## Request Flow
Client -> FastAPI router -> dependency auth/session -> service function -> SQLAlchemy models -> schema response.

Keep routers thin. Most financial calculation logic should live in services.

## Important Services
- `quote_updater.py`: provider/manual quote update orchestration.
- `valuation_snapshots.py`: valuation snapshot creation and export logic.
- `analytics_summary.py`: dashboard summary calculations.
- `quick_insight.py`: valuation snapshot compare insight.
- `composition_series.py`: stacked chart data preparation.
- `goal_progress.py`: target wealth projection.
- `dividend_income.py`: expected dividend/distribution calculation.
- `dividend_provider.py`: DATA_GO_KR and Alpha Vantage dividend provider access.
- `trade_ledger.py`: transaction/trade ledger logic.
- `secret_vault.py`: encrypted secret resolution.

## Scheduler Flow
Quote and dividend schedulers start in `app/main.py` startup.

- Quote scheduler: creates quote update runs and valuation snapshots.
- Dividend scheduler: updates dividend provider events and dividend snapshots.

Both should avoid duplicate overlapping runs.

## DB Migration Rules
Use Alembic for schema changes. MySQL compatibility is required.

Before destructive migrations:

- Confirm backup.
- Note downgrade limitations.
- Keep table drop order FK-safe.
