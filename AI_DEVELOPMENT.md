# MyAsset AI Development Workflow

MyAsset uses **Rules-first AI Development**.

This means project rules and documentation are treated as part of the source of truth. Code changes should not drift away from the documented architecture, business rules, and UI style.

Use this document before starting a new task in Codex, Claude, or another AI coding tool.

## Required Development Order
1. Read relevant `docs/*.md` and `rules/*.md`.
2. Inspect the current code structure.
3. Implement the change.
4. Run build/tests appropriate to the change.
5. If UX, business logic, style, operations, or data semantics changed, update the relevant docs/rules.
6. Provide a commit message and release notes.

## Where To Read First
Backend:
- `apps/api/docs/overview.md`
- `apps/api/docs/architecture.md`
- `apps/api/docs/ai-handoff.md`
- `apps/api/rules/development-rules.md`

Asset remote frontend:
- `apps/web-asset/docs/overview.md`
- `apps/web-asset/docs/architecture.md`
- `apps/web-asset/docs/design-system.md`
- `apps/web-asset/docs/ai-handoff.md`
- `apps/web-asset/rules/development-rules.md`
- `apps/web-asset/rules/ui-style-rules.md`

Host frontend:
- `apps/web-host/docs/overview.md`
- `apps/web-host/docs/architecture.md`
- `apps/web-host/docs/design-system.md`
- `apps/web-host/docs/ai-handoff.md`
- `apps/web-host/rules/development-rules.md`
- `apps/web-host/rules/ui-style-rules.md`

## Documentation Update Rule
Update documentation when a change affects any of these areas:
- new card tone or visual style
- button/control behavior
- table UX
- Amount Blur behavior
- chart axis, legend, hover, tap, zoom, or mobile behavior
- mobile layout rules
- dividend/tax calculation or display semantics
- valuation snapshot semantics
- quote/dividend scheduler behavior
- API contract or response meaning
- database schema or migration behavior
- operational scripts or deployment flow

Small bug fixes that do not change behavior or conventions do not need docs updates.

## UI Style Rule
Do not introduce Ant Design Vue or another external UI library by default.

MyAsset uses Vue 3, Tailwind CSS, and a custom MyAsset design system. New UI should follow:
- `apps/web-asset/docs/design-system.md`
- `apps/web-asset/rules/ui-style-rules.md`
- `apps/web-host/docs/design-system.md`
- `apps/web-host/rules/ui-style-rules.md`

Reusable CSS templates live in:
- `apps/web-asset/src/style.css`
- `apps/web-host/src/style.css`

Preferred semantic classes include:
- `ma-card`
- `ma-card-soft`
- `ma-section-label`
- `ma-muted`
- `ma-btn`
- `ma-btn-primary`
- `ma-btn-success`
- `ma-btn-warning`
- `ma-btn-danger`
- `ma-input`
- `ma-select`
- `ma-pill`
- `ma-table-wrap`
- `ma-table`

## Financial Display Rule
Amount Blur is a privacy feature and must be respected.

Blur money values:
- asset value
- gross/net/liabilities
- invested/cost basis/profit
- dividend gross/tax/net/received
- money axis labels

Do not blur:
- percentages
- dates
- statuses
- source names
- tax profile names
- payment months
- confidence/status badges

## Business Logic Rule
Prefer backend-owned financial calculations.

Frontend should render typed API results and avoid duplicating calculations such as:
- net worth
- dividend/tax estimates
- valuation snapshot deltas
- quote/dividend scheduler status
- portfolio/asset movers
- taxable financial income summaries

If frontend must derive a small display value, keep it presentational and document it if the meaning can affect user decisions.

## Build/Test Guidance
Use the smallest relevant verification:
- API Python changes: `python -m compileall app`
- API migrations: `python -m alembic upgrade head`
- web-asset changes: `npm run build` in `apps/web-asset`
- web-host changes: `npm run build` in `apps/web-host`

If a task changes multiple apps, verify each affected app.

## Commit Message Format
Use this shape when the user asks for a commit message:

```text
feat: short summary

what:
- change 1
- change 2

why:
- reason 1
- reason 2

test:
- verification command/result
```

Use `fix`, `docs`, `refactor`, `chore`, or `test` when more appropriate than `feat`.

## Release Notes Format
Release notes should be user-facing:
- what changed
- what users can do now
- any migration or operational note
- any known limitation

Avoid listing every internal file unless the user asks for implementation detail.

## AI Handoff Principle
When continuing work in a new chat, first summarize:
- current goal
- related docs/rules read
- files likely to change
- validation plan

Then implement. Do not skip directly to code when the change affects established MyAsset rules.
