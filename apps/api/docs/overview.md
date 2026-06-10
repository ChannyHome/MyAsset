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
