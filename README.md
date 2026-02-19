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
- Alembic revisions: `011_portfolio_networth_view`, `015_portfolio_networth_align`, `016_minus_debt_views`, `020_portfolio_drop_owned`, `021_portfolio_col_order`, `023_portfolio_drop_networth`
- Added view:
  - `v_user_portfolio_networth_v2`
- Core fields:
  - `gross_assets_total`
  - `liabilities_total`
  - `net_assets_total` (assets - liabilities)
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

### Step 17 (done): Trade menu + manual ledger sync
- Added DB table:
  - `transactions` (trade/cashflow ledger)
  - migration: `029_trade_ledger`
- Added trade auto-apply flags:
  - `auto_apply_cash_holding` (default ON)
  - `auto_apply_portfolio_cashflow` (default ON for DEPOSIT/WITHDRAW)
  - migration: `030_trade_auto_apply_flags`
- Added APIs:
  - `GET /api/v1/trades`
  - `POST /api/v1/trades`
  - `PATCH /api/v1/trades/{id}`
  - `POST /api/v1/trades/{id}/void`
  - `POST /api/v1/trades/rebuild`
- Sync behavior:
  - BUY/SELL sync holding qty/avg/invested (moving average)
  - DEPOSIT/WITHDRAW sync portfolio net contribution (`cumulative_deposit_amount`/`cumulative_withdrawal_amount`)
  - Optional auto cash-holding sync by portfolio+currency for BUY/SELL/DEPOSIT/WITHDRAW/DIVIDEND/FEE/ADJUSTMENT
- Frontend:
  - New LNB menu + page: `/trade`
  - Manual create/edit/void/rebuild trade journal UI
  - Filtered journal table with server-side pagination
- Role policy:
  - `Trade`: USER/SUPERUSER/MAINTAINER/ADMIN
- `Lab`: MAINTAINER/ADMIN only
- `Guest`: blocked from real-data trade endpoints (403)

## KPI / Accounting Standard (Commercial Terms)
The UI and API now use the same KPI vocabulary across `Home / Report / Agent / Trade`.

- `gross_assets_total`
  - Definition: total owned asset value.
- `liabilities_total`
  - Definition: total included liabilities.
- `net_assets_total`
  - Definition: `gross_assets_total - liabilities_total`.
- `net_contribution_total`
  - Definition: portfolio net contribution.
  - Formula: `cumulative_deposit_amount - cumulative_withdrawal_amount`.
- `debt_adjusted_principal_total`
  - Definition: principal baseline adjusted by liabilities.
  - Formula: `invested_principal_total - liabilities_total`.
- `portfolio_profit_total`
  - Definition: portfolio profit value for display.
  - Formula (alias): same as `total_pnl_amount`.

### API Compatibility Aliases
For backward compatibility, old and new names are both served in key responses.

- `principal_minus_debt_total` + `debt_adjusted_principal_total`
- `total_pnl_amount` + `portfolio_profit_total`
- `avg_price` + `avg_cost`
- `invested_amount` + `cost_basis_total`
- Portfolio table server sort keys include both `principal_net` and `net_contribution_total`
  (same formula: `cumulative_deposit_amount - cumulative_withdrawal_amount`).

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

## Trade stage test checklist
1. `apps/api`에서 마이그레이션 적용:
```powershell
cd apps/api
.\.venv\Scripts\alembic.exe upgrade head
```
2. `/trade` 진입 후 `DEPOSIT` 거래 생성
  - `auto_apply_cash_holding=ON`, `auto_apply_portfolio_cashflow=ON`
3. 같은 포트폴리오에서 `BUY` 거래 생성
  - `auto_apply_cash_holding=ON`, `auto_apply_portfolio_cashflow=OFF`
4. 기대결과
  - `portfolios.cumulative_deposit_amount` 증가
  - 대상 통화 CASH holding 자동 증감
  - 매수한 자산 holding 수량/평단/투입원금 자동 반영
5. `VOID` 동작 확인
  - 거래 취소 후 holdings/portfolio 수치가 역반영되는지 확인

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












### Step 17 (done): Admin Secret Vault + Real-Estate AUTO quote path
- New env keys:
  - `DATA_GO_KR_SERVICE_KEY`
  - `DATA_GO_KR_APARTMENT_TRADE_URL`
  - `DATA_GO_KR_TIMEOUT_SECONDS`
  - `DATA_GO_KR_ROWS_PER_CALL`
  - `DATA_GO_KR_LOOKBACK_MONTHS`
  - `APP_SECRETS_MASTER_KEY`
- Real estate AUTO quote behavior:
  - `asset_class=REAL_ESTATE`, `quote_mode=AUTO`, `exchange_code=DATA_GO_KR` (or `MOLIT`/`REAL_ESTATE`)
  - `meta_json` requires at least:
    - `lawd_cd` (region code)
    - `apt_name` (apartment name)
  - optional filters:
    - `jibun`
    - `area_m2`
    - `lookback_months`
  - service key resolution order: `Secret Vault(DB)` first, `.env(DATA_GO_KR_SERVICE_KEY)` fallback
  - DB key convention: `provider=DATA_GO_KR`, `key_name=SERVICE_KEY`, `is_active=true`
- Admin-only Secret Vault API:
  - `GET /api/v1/admin/secrets`
  - `POST /api/v1/admin/secrets`
  - `PATCH /api/v1/admin/secrets/{id}`
  - `DELETE /api/v1/admin/secrets/{id}` (soft disable)
- Agent page now includes `Secrets Vault (Admin)` card:
  - masked list view
  - create/update
  - disable
