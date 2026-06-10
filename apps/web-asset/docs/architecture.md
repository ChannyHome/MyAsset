# Web Asset Architecture

## Directory Map
- `src/pages`: remote pages exposed by Module Federation.
- `src/components`: reusable dashboard/status/chart cards.
- `src/api`: typed Axios API wrappers.
- `src/composables`: cross-page composition helpers.
- `src/stores`: Pinia stores.
- `src/utils`: formatting/date helpers.
- `src/style.css`: global Tailwind/app style entry.

## Exposed Remote Pages
Configured in `vite.config.ts`:

- `./HomePage`
- `./DashboardPage`
- `./SnapshotPage`
- `./ReportPage`
- `./AgentPage`
- `./TradePage`
- `./ChatPage`
- `./LabPage`
- `./HistoryPage`

## Dashboard Composition
Home and Snapshot should share dashboard card logic when possible.

Important card/component families:

- KPI cards
- Networth trend
- Quick Insight
- Goal progress
- Allocation donut/treemap
- Composition stacked charts
- Status tables
- Dividend income table

## API Wrapper Rule
Every backend endpoint used by Vue should have a typed wrapper under `src/api`.

Avoid raw Axios calls directly inside large components unless there is a clear one-off reason.

## Current UI System
Current UI is hand-built Tailwind components plus MyAsset semantic helper classes in `src/style.css`.

Do not introduce external UI component libraries by default. Prefer MyAsset card/button/input/table patterns so Home, Snapshot, Agent, and App Settings stay visually coherent.
