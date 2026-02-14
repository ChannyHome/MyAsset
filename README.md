# MyAsset

## Step-by-step development for beginners

### Step 1 (done): FastAPI minimal skeleton
- `GET /api/v1/health`

### Step 2 (done): JWT login minimal flow (seed users)
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### Step 3 (done): DB foundation (SQLAlchemy + Alembic)
- SQLAlchemy models: `users`, `households`, `household_members`
- Alembic revision: `001_base_auth_scope`

### Step 4 (done): portfolios/assets/holdings CRUD + toggle
- DB models: `portfolios`, `assets`, `holdings`
- Alembic revision: `002_portfolio_asset_holding`
- APIs:
  - `GET/POST/PATCH/DELETE /api/v1/portfolios`
  - `GET/POST/PATCH/DELETE /api/v1/assets`
  - `GET/POST/PATCH/DELETE /api/v1/holdings`
  - `PATCH /api/v1/holdings/{id}/hidden`

### Step 5 (done): USER/HOUSEHOLD scope APIs
- `GET /api/v1/households`
- `GET /api/v1/households/{id}/members`
- `GET /api/v1/holdings?scope_type=USER|HOUSEHOLD|GROUP&scope_id=...`

### Step 6 (done): DDL integration into Alembic (MySQL v0.5 base)
- `003_liabilities_quotes_market`
- `004_dashboard_media_valuation`
- includes: liabilities, quotes/fx/market, dashboards/layouts/settings, media/snapshots, valuation_snapshots

## MySQL first decision
- DB name: `myasset`
- Use Alembic as source of truth.
- Do not run raw ChatGPT SQL directly on top of Alembic-managed DB.
- If you want to adopt more DDL changes, add them as next Alembic revision.

## API access log toggle
- `.env` value:
  - `API_ACCESS_LOG_ENABLED=true` -> write daily log files
  - `API_ACCESS_LOG_ENABLED=false` -> no file log
- path: `API_ACCESS_LOG_DIR` (default `logs/api`)
- file format: `YYYY-MM-DD.log` (JSON line per request)

## One-command run (Windows PowerShell)

From repo root:

```powershell
# 1) first-time setup + install
.\run.ps1 -Setup

# 2) create MySQL DB from DATABASE_URL if missing
.\run.ps1 -InitDb

# 3) migrate schema
.\run.ps1 -Migrate

# 4) seed users/household
.\run.ps1 -Seed

# 5) quick API smoke (health/login/me)
.\run.ps1 -Smoke

# 6) MySQL-backed smoke (CRUD + scope)
.\run.ps1 -SmokeDb

# 7) start server
.\run.ps1 -Run
```

## Seed users (dev only)
- `me@myasset.local / pass1234`
- `wife@myasset.local / pass1234`
- `son@myasset.local / pass1234`