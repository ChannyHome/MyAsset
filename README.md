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

### Step 7 (done): Live quote + holding performance
- Quote source: `yfinance`
- `POST /api/v1/quotes/update-now` (manual refresh)
- `GET /api/v1/quotes/latest` (latest quotes)
- `GET /api/v1/holdings/performance` (invested/current/pnl/pnl%)
- Scheduler (optional): `QUOTE_AUTO_UPDATE_ENABLED=true`, default `QUOTE_UPDATE_INTERVAL_MINUTES=10`
- Runtime interval API:
  - `GET /api/v1/settings/quote-interval`
  - `PUT /api/v1/settings/quote-interval`

### Step 8 (done): latest_quotes upsert + portfolio performance baseline
- Alembic revision: `007_latest_quote_cashflow`
- `asset_quotes` keeps full history (append)
- `latest_quotes` keeps one latest row per asset (upsert)
- Portfolio metadata fields added:
  - `category` enum: `KR_STOCK`, `US_STOCK`, `CRYPTO`, `REAL_ESTATE`, `BOND`, `CASH`, `DEPOSIT_SAVING`, `ETC`
  - `memo`
  - `cumulative_deposit_amount`
  - `cumulative_withdrawal_amount`
  - `cashflow_source_type` (`MANUAL` / `AUTO`)
- New API:
  - `GET /api/v1/portfolios/performance`
- Formula:
  - `total_pnl_amount = nav_amount + cumulative_withdrawal_amount - cumulative_deposit_amount`


### Step 9 (done): liabilities CRUD + analytics summary
- `GET/POST/PATCH/DELETE /api/v1/liabilities`
- `PATCH /api/v1/liabilities/{id}/hidden`
- `GET /api/v1/analytics/summary-old` (legacy)
- `GET /api/v1/analytics/summary` (recommended)
- net worth formula:
  - legacy `/summary-old`: `total_assets_total = assets_total + liabilities_total`, `net_worth_total = assets_total`
  - recommended `/summary`: `gross_assets_total = owned_assets_total + liabilities_total`, `net_assets_total = owned_assets_total`

### Step 10 (done): DB views for HeidiSQL
- Alembic revision: `009_asset_views`
- Added reporting views:
  - `v_user_holding_performance`
  - `v_user_asset_class_performance`
  - `v_user_liability_summary`
  - `v_user_summary_v2`
  - `v_user_portfolio_performance`

### Step 11 (done): Household summary view
- Alembic revision: `010_household_summary_view`
- Added view:
  - `v_household_summary_v2`

### Step 12 (done): Portfolio net worth view
- Alembic revision: `011_portfolio_networth_view`
- Added view:
  - `v_user_portfolio_networth_v2`
- Core fields:
  - `owned_assets_total`
  - `liabilities_total`
  - `gross_assets_total`
  - `net_worth_total` (assets - liabilities)
  - `net_assets_total` (legacy-compatible alias = owned_assets_total)

### Step 13 (done): Summary views principal metrics
- Alembic revision: `012_summary_principal_metrics`
- Updated views:
  - `v_user_summary_v2`
  - `v_household_summary_v2`
- Added fields:
  - `invested_principal_total`
  - `withdrawn_total`
  - `principal_profit_total`
  - `principal_return_pct`

### Step 14 (done): Gross return metrics
- Alembic revision: `013_summary_gross_return_metrics`
- Updated views:
  - `v_user_summary_v2`
  - `v_household_summary_v2`
- Added fields (`??+??` ??):
  - `principal_plus_debt_total`
  - `gross_assets_profit_total`
  - `gross_assets_return_pct`

### Step 15 (done): Frontend foundation (Host + Asset Remote)
- Stack: Vue3 + Tailwind + Module Federation
- `apps/web-host`
  - login/auth guard
  - responsive LNB (mobile hamburger, desktop collapse)
  - Light/Dark theme toggle (default Light, localStorage persisted)
  - bottom account + household info
  - remote loading fallback
- `apps/web-asset`
  - Home / Dashboard / Report remote pages
  - Dashboard edit starter with WPF-style toolbox UX:
    - search
    - double-click to add widget
    - drag & drop to canvas
    - simple dashboard compare modal

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

# 2) frontend dependency setup
.\run.ps1 -SetupWeb

# 3) create MySQL DB from DATABASE_URL if missing
.\run.ps1 -InitDb

# 4) migrate schema
.\run.ps1 -Migrate

# 5) seed users/household
.\run.ps1 -Seed

# 6) update quotes once
.\run.ps1 -UpdateQuotes

# 7) quick API smoke (health/login/me)
.\run.ps1 -Smoke

# 8) MySQL-backed smoke (CRUD + scope)
.\run.ps1 -SmokeDb

# 9) start API server
.\run.ps1 -Run

# 10) start asset remote server (separate terminal)
.\run.ps1 -RunAsset

# 11) start host server (separate terminal)
.\run.ps1 -RunHost
```

## Frontend step-1 test checklist
1. API 실행 후 `http://127.0.0.1:5173` 접속
2. 로그인 페이지에서 `me@myasset.local / pass1234` 로그인
3. 로그인 후 Home 진입 확인
4. 모바일 폭(브라우저 devtools)에서 좌상단 햄버거 버튼으로 LNB 열기/닫기 확인
5. 데스크탑에서 LNB 접기/펼치기 확인
6. Light/Dark 전환 후 새로고침해도 유지되는지 확인
7. `apps/web-asset`를 끄면 Host에서 remote fallback 메시지 노출되는지 확인

## Frontend troubleshooting
- `Remote 모듈 연결에 실패했습니다`가 보이면:
  1. `.\run.ps1 -RunAsset` 먼저 실행 (Remote는 `build + preview` 모드로 실행됨)
  2. 그 다음 `.\run.ps1 -RunHost`
  3. 포트 충돌 시 `run.ps1`가 점유 PID를 보여주므로 해당 프로세스를 종료 후 재실행

## Seed users (dev only)
- `me@myasset.local / pass1234`
- `wife@myasset.local / pass1234`
- `son@myasset.local / pass1234`

## Quote interval design
- `.env` value is fallback/default only.
- Runtime interval changes should be stored in DB (`app_settings`) via API.
- Scheduler is rescheduled immediately when interval is updated by API.











