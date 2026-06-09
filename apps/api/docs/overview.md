# MyAsset API Overview

MyAsset API is the FastAPI backend for asset, quote, valuation snapshot, dividend, and operational admin workflows.

## Core Purpose
- Keep current holdings, liabilities, portfolios, and valuation snapshots consistent.
- Run quote and dividend update jobs separately.
- Store secrets in the app secret vault instead of plain environment variables where possible.
- Provide analytics APIs for Home, Snapshot, Agent, and dashboard widgets.

## Dividend Tax Logic
Dividend income uses two contexts:

- Portfolio tax profile: account-level tax treatment such as `GENERAL`, `PENSION`, or `ISA`.
- Asset tax profile: inferred from asset currency, market, exchange, and symbol.

Effective tax profile rules:

- `PENSION`, `ISA`, and `TAX_EXEMPT` portfolios override asset tax and are excluded from taxable financial income summary.
- `CUSTOM` portfolios use `portfolio.dividend_tax_rate_pct`.
- `GENERAL_KR` and `GENERAL_US` portfolios force the corresponding country profile.
- `GENERAL` portfolios use asset-inferred tax profile.

The taxable financial income limit is stored in `app_settings.financial_income_taxable_limit_krw`. The default is `20,000,000 KRW`.

## Operational Notes
- Quote update creates valuation snapshots.
- Dividend update creates expected dividend events/snapshots and is intentionally separate from quote update.
- Actual received dividends are managed manually and should be treated as the cash-flow source of truth.
