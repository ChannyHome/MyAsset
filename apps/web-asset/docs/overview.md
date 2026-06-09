# MyAsset Web Asset Overview

`web-asset` is the Vue 3 remote application that renders asset-facing pages such as Home, Snapshot, Agent, Trade, Chat, and dashboard widgets.

## User-Facing Areas
- Home: live asset dashboard, valuation trends, quote update, dividend income table.
- Snapshot: valuation snapshot workspace.
- Agent: operational status and management screens for portfolios, holdings, liabilities, and dividends.
- Trade: transaction and ledger workflows.

## Dividend UX
- `Asset Dividend Status` is for provider/reference data by asset.
- `Dividend Status` is for portfolio/holding-level expected annual dividend analysis.
- Received dividends are entered manually and should remain separate from expected dividend forecasts.
- Dividend rows show portfolio tax profile, inferred asset tax profile, effective tax profile, tax rate, and taxable inclusion.

## Amount Blur
- Money amounts must honor Amount Blur.
- Percentages, dates, status labels, tax profile names, and confidence/status badges should not be blurred.
