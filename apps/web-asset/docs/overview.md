# MyAsset Web Asset Overview

`web-asset` is the Vue 3 remote application that renders asset-facing pages through Module Federation.

## Pages
- `HomePage.vue`: primary live dashboard and most-used daily view.
- `DashboardPage.vue`: dashboard-oriented remote page.
- `SnapshotPage.vue`: valuation snapshot workspace.
- `AgentPage.vue`: operational status and management screen.
- `TradePage.vue`: trade/cash-flow ledger workflows.
- `ReportPage.vue`: report-oriented summaries.
- `HistoryPage.vue`: history/audit views.
- `ChatPage.vue`: LLM/chat workspace, currently dependent on configured model provider.

## Important Components
- `DashboardPanelContainer.vue`: shared dashboard panel container.
- `KpiSummaryCard.vue`: gross/liabilities/net/dividend KPI.
- `KpiPortfolioSummaryCard.vue`: portfolio table summary.
- `NetworthTrendCard.vue`: range/bucket/zoom trend chart.
- `CompositionStackedCard.vue`: amount breakdown and allocation trend.
- `QuickInsightPanel.vue`: snapshot-to-snapshot insight summary.
- `GoalProgressForecastCard.vue`: target wealth progress and forecast.
- `DividendIncomeTableCard.vue`: expected/received dividend income table.

## Dashboard Data Flow
The frontend should prefer API-provided calculations. Charts and cards should render backend-calculated values rather than duplicating financial logic in Vue.

Display currency is global and should use `useDisplayCurrency`.

Amount Blur is a privacy feature and must apply consistently to money values.

## Dividend UX
- `Asset Dividend Status` is for provider/reference data by asset.
- `Dividend Status` is for portfolio/holding-level expected annual dividend analysis.
- Received dividends are entered manually and should remain separate from expected dividend forecasts.
- Dividend rows show portfolio tax profile, inferred asset tax profile, effective tax profile, tax rate, and taxable inclusion.
- Dividend/distribution naming should be user-friendly: UI may say `Dividend Income`, but internal logic should include ETF distributions.

## Current UI Stack Reality
The current UI is Vue 3 + Tailwind CSS custom components. As of this document, `ant-design-vue` is not installed and current UI components are not Ant Design components.

Do not introduce Ant Design Vue by default. New UI should follow the MyAsset custom design system documented in `docs/design-system.md` and `rules/ui-style-rules.md`.
