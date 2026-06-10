# AI Handoff Notes for Web Asset

Read this before changing `web-asset`.

## User Experience Priorities
- Home is the highest-traffic page.
- Mobile usability matters as much as desktop.
- Amount Blur must be respected for money values.
- The visual style is dark, dense, dashboard-like, and custom.

## Current Stack Reality
- Vue 3 + TypeScript + Vite.
- Tailwind CSS is used heavily.
- Ant Design Vue is not installed or used; prefer the MyAsset custom UI system.
- Module Federation exposes remote pages to `web-host`.

## Safe Change Pattern
1. Add/update typed API wrapper.
2. Keep business calculations in backend where possible.
3. Update component/page state.
4. Preserve localStorage keys unless intentionally migrating.
5. Run `npm run build`.

## Frequent Regression Areas
- Remote build output and `remoteEntry.js`.
- AgentPage large table typings.
- NetworthTrend mobile chart sizing/axis behavior.
- Amount Blur missing on new money fields.
- Status tables missing CSV export/search parity.
