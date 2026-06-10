# MyAsset API Overview

MyAsset API is the FastAPI backend for a personal asset-management system. It owns assets, portfolios, holdings, liabilities, quotes, valuation snapshots, dividend income, trade ledger, admin settings, and analytics APIs.

## Product Purpose
MyAsset helps the user answer:

- How much are my gross assets, liabilities, net worth, invested principal, profit, and return?
- Which portfolio, asset, liability, or dividend source moved my wealth?
- Am I progressing toward my target wealth?
- How much dividend/distribution income can I expect, and how much is taxable?
- Can I explain changes using persisted valuation snapshots rather than volatile live-only data?

## Core Domains
- `users`, `households`: ownership and future multi-user scope.
- `portfolios`: account/bucket context such as broker, bank, exchange, real estate, pension, or ISA.
- `assets`: investable or trackable items such as stocks, ETFs, crypto, cash, and real estate.
- `holdings`: portfolio-owned asset positions.
- `liabilities`: debts and loans.
- `quotes`: latest prices, FX rates, and manual/provider quote updates.
- `valuation_snapshots`: historical valuation archive created by quote update.
- `dividends`: expected dividend/distribution data, actual receipts, snapshots, and scheduler runs.
- `transactions`: cash flow and trade ledger.
- `app_settings`: global configurable app settings.
- `app_secrets`: encrypted provider/API credentials.

## Snapshot Principle
`valuation_snapshots` are the canonical historical archive. Quote update is the user action that creates or refreshes valuation snapshots. Read-only dashboard refresh should not create new snapshots.

Legacy `snapshot_*` tables are not the future direction. New analytics should use `valuation_snapshots` and related row tables.

## Quote and Dividend Jobs
Quote update and dividend update are separate:

- Quote update: frequent, price-sensitive, creates valuation snapshots.
- Dividend update: slower-changing, provider/event based, creates dividend events and dividend snapshots.
- Actual received dividends are entered manually and are the cash-flow source of truth.

## Dividend Domain Model
Dividend income is split into master/profile data, provider history, calculated snapshots, and actual receipts:

- `asset_dividend_profiles`: asset-level dividend/distribution master profile. This is the source of truth for whether an asset is dividend-enabled, which provider strategy to use, manual annual DPS, payment months, monthly/quarterly expected per-share amounts, and coverage status.
- `asset_provider_identifiers`: provider lookup identifiers such as `ALPHA_VANTAGE / SYMBOL`, `DATA_GO_KR / STOCK_NAME`, and `DATA_GO_KR / STOCK_CODE`.
- `asset_dividend_events`: provider/manual imported event history. This table should contain dividend/distribution events only, not profile settings.
- `dividend_snapshots`: expected dividend snapshot calculated from current holdings, profile data, provider events, tax context, and FX.
- `dividend_receipts`: manually entered actual received dividends/distributions.

`Update Dividend Now` performs these steps:

1. Find currently held dividend/distribution candidate assets.
2. Create a missing `asset_dividend_profiles` row when needed.
3. Auto-fill provider identifiers when possible.
4. Fetch provider events from DATA_GO_KR or Alpha Vantage.
5. Upsert `asset_dividend_events`.
6. Calculate expected annual dividend/distribution by current holdings.
7. Create `dividend_snapshots` and persist `dividend_update_runs`.

Auto identifier rules:

- USD assets with a symbol get `ALPHA_VANTAGE / SYMBOL = asset.symbol`.
- KRW assets get `DATA_GO_KR / STOCK_NAME = asset.name`.
- KRW assets with a 6-digit symbol also get `DATA_GO_KR / STOCK_CODE = asset.symbol`.
- Domestic ETF distributions may still require manual/forecast fallback because the current DATA_GO_KR stock dividend API can miss ETF distribution data.

Forecast priority:

1. Current-year provider events.
2. Previous-year same-month events.
3. Recent event average.
4. `asset_dividend_profiles.monthly_amounts_json`.
5. `asset_dividend_profiles.manual_annual_dividend_per_share`.
6. `MANUAL_ESTIMATE_NEEDED`.

`monthly_amounts_json` stores expected per-share amounts by month. Monthly example: `{ "1": 0.25, "2": 0.25 }`. Quarterly example: `{ "3": 361, "6": 361, "9": 361, "12": 361 }`. Annual DPS is the sum of the monthly values.

## Dividend Tax Logic
Dividend income uses two tax contexts:

- Portfolio tax profile: account-level tax treatment such as `GENERAL`, `PENSION`, or `ISA`.
- Asset tax profile: inferred from asset currency, exchange, market, symbol, and ETF/distribution character.

Effective tax profile rules:

- `PENSION`, `ISA`, and `TAX_EXEMPT` portfolios override asset tax and are excluded from taxable financial income summary.
- `CUSTOM` portfolios use `portfolio.dividend_tax_rate_pct`.
- `GENERAL_KR` and `GENERAL_US` portfolios force the corresponding country profile.
- `GENERAL` portfolios use asset-inferred tax profile.

The taxable financial income limit is stored in `app_settings.financial_income_taxable_limit_krw`. The default is `20,000,000 KRW`.

## Provider Secrets
Provider credentials should be stored in `app_secrets` where possible.

Current important providers:

- `DATA_GO_KR / SERVICE_KEY`
- `ALPHA_VANTAGE / API_KEY`
- `OPENAI / API_KEY`

Environment variables are fallback or operational bootstrap values, not the preferred long-term secret store.
