# Web Asset Development Rules

## Stack
- Vue 3
- TypeScript
- Vite
- Module Federation remote via `@originjs/vite-plugin-federation`
- Pinia
- Vue Router
- Axios
- Tailwind CSS
- MyAsset custom UI system in `src/style.css`

## Module Federation Rules
- `web-asset` exposes remote pages through `vite.config.ts`.
- Host-visible pages must remain stable: Home, Dashboard, Snapshot, Report, Agent, Trade, Chat, Lab, History.
- Shared dependencies are `vue`, `pinia`, and `vue-router`.
- Do not add a new exposed page without updating host routing/remotes if needed.

## UI Rules
- Preserve existing dark dashboard visual language.
- Keep status tables searchable and exportable where operationally useful.
- Long labels in dense tables should truncate or wrap safely.
- Expand/collapse state should use localStorage only when it improves return visits.
- Money values must respect Amount Blur.
- Percentages, statuses, dates, tax profile names, and source labels should not be blurred.

## MyAsset UI System Rules
- Do not introduce Ant Design Vue or another external UI library without an explicit design/maintenance plan.
- Prefer existing Tailwind patterns and semantic `ma-*` classes from `src/style.css`.
- Dense forms, modals, selects, date pickers, and admin/status tables should still look like MyAsset cards: slate/navy surfaces, rounded borders, compact controls, and clear status colors.
- Reuse `ma-card`, `ma-card-soft`, `ma-btn`, `ma-input`, `ma-select`, `ma-pill`, and `ma-table` when creating new standalone UI.
- If a component already has mature local Tailwind styling, extend it instead of partially migrating it to a different visual system.

## Dividend Rules
- Show both forecast/reference status and holding-level dividend analysis separately.
- Do not mix expected dividend and received dividend as the same source of truth.
- Apply Amount Blur to dividend gross, tax, net, received, and expected money values.
- Do not blur dividend yield, tax rate, tax profile, source, status, or payment months.
- `PENSION`, `ISA`, and `TAX_EXEMPT` rows should be visibly distinguishable when showing taxable summaries.
- Use the word `Profile` for asset-level dividend/distribution master data and provider coverage.
- Use `Events` for provider/manual dividend history rows.
- Show `NO_PROVIDER_DATA`, `MANUAL_PROFILE`, and `MANUAL_ESTIMATE_NEEDED` as actionable states, not generic failures.
- If an asset has manual monthly/quarterly amounts, show it as a manual/profile estimate even when provider identifiers are missing.
- Keep `Asset Dividend Status` above holding-level `Dividend Status` when both are shown, because profile/provider data explains portfolio-level zeros.

## Chart Rules
- Networth Trend uses range, bucket, zoom, and viewport-aware axis behavior.
- Stacked charts use backend-prepared segment/ratio data.
- If data is missing for a date, do not fabricate points on the frontend.

## Build
- Run `npm run build` after frontend changes.
