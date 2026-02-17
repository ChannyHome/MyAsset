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
- `POST /api/v1/quotes/manual/real-estate` (manual real estate price upsert)
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
- `GET /api/v1/analytics/summary`
- net worth formula:
  - `/summary`: `gross_assets_total = sum(owned assets)`, `net_assets_total = gross_assets_total - liabilities_total`

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
- Alembic revisions: `011_portfolio_networth_view`, `015_portfolio_networth_align`, `016_minus_debt_views`, `020_portfolio_drop_owned`, `021_portfolio_col_order`
- Added view:
  - `v_user_portfolio_networth_v2`
- Core fields:
  - `gross_assets_total`
  - `liabilities_total`
  - `net_assets_total` (assets - liabilities)
  - `net_worth_total` (assets - liabilities)
  - `principal_minus_debt_total`
  - `net_assets_profit_total`
  - `net_assets_return_pct`

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

### Step 14 (done): Net-basis return metrics
- Alembic revisions: `013_summary_gross_return_metrics`, `016_minus_debt_views`, `019_summary_drop_owned`, `022_summary_col_order`
- Updated views:
  - `v_user_summary_v2`
  - `v_household_summary_v2`
- `gross`-based fields removed:
  - `principal_plus_debt_total`
  - `gross_assets_profit_total`
  - `gross_assets_return_pct`
- Added fields (net-assets / principal-minus-debt):
  - `principal_minus_debt_total`
  - `net_assets_profit_total`
  - `net_assets_return_pct`

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

### Step 16 (done): Agent menu + frontend runtime quality
- LNB menu: `Home > Dashboard > Agent > Report > Chat > Budget > Lab`
- LNB account block:
  - settings icon (`⚙`)
  - `/settings` placeholder page for household member/owner management
- `Agent`/`Lab` are loaded from `web-asset` remote (host is kept thin)
- `run.ps1` enhancements:
  - `-KillPortOwner` option: if target port is occupied, kill existing process then start
  - `RunAsset` now uses watch mode (`vite build --watch + vite preview`) for faster remote refresh

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

# Optional: kill existing port owner automatically then start
.\run.ps1 -RunAsset -KillPortOwner
.\run.ps1 -RunHost -KillPortOwner
.\run.ps1 -Run -KillPortOwner
```

## Quick launch scripts (3 terminals)
If you prefer simple commands, use these wrapper scripts from repo root:

```powershell
# terminal 1: API
.\run-api.ps1

# terminal 2: Asset Remote
.\run-asset.ps1

# terminal 3: Host
.\run-host.ps1
```

Each wrapper calls `run.ps1` with `-KillPortOwner` enabled.

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
  1. `.\run.ps1 -RunAsset` 먼저 실행 (Remote는 `watch build + preview` 모드)
  2. 그 다음 `.\run.ps1 -RunHost`
  3. 포트 충돌 시 `-KillPortOwner` 옵션으로 자동 종료 후 실행 가능

## Production deploy (Nginx)
- Deployment docs: `deploy/README.md`
- Nginx template: `deploy/nginx/myasset.conf`
- Nginx Windows template: `deploy/nginx/myasset-windows.conf`
- Nginx HTTPS template: `deploy/nginx/myasset-https.conf`
- Frontend build/package script (Windows): `deploy/scripts/build-frontend.ps1`
- Frontend copy-to-Windows-Nginx script: `deploy/scripts/deploy-frontend-windows.ps1`
- Let's Encrypt script: `deploy/scripts/setup-letsencrypt.sh`
- systemd docs (FastAPI + Nginx): `deploy/systemd/README.md`

## Seed users (dev only)
- `me@myasset.local / pass1234`
- `wife@myasset.local / pass1234`
- `son@myasset.local / pass1234`

## Quote interval design
- `.env` value is fallback/default only.
- Runtime interval changes should be stored in DB (`app_settings`) via API.
- Scheduler is rescheduled immediately when interval is updated by API.











