# MyAsset Web Asset UI Style Rules

Use these rules when developing `apps/web-asset`.

## Core Rule
Build new UI in the existing MyAsset visual language. Do not add Ant Design Vue or another external UI library unless the user explicitly approves a separate migration plan.

## Required Patterns
- Use `src/style.css` semantic classes for new standalone UI:
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
- Existing mature Tailwind components may keep local styling, but new pieces should converge toward these templates.

## Color Semantics
- Indigo/violet: selected tabs, active range/bucket/mode controls.
- Emerald: positive values, successful jobs, update actions.
- Rose: negative values, errors, destructive actions.
- Amber: warnings, dividend/tax highlights, manual review.
- Sky/cyan: informational states.
- Slate/navy: surfaces and neutral controls.

## Financial UI Rules
- Money values must respect Amount Blur.
- Percentage, date, status, source, tax profile, and payment month labels must not be blurred.
- Do not calculate financial business logic in Vue when the backend can return the value.
- When showing deltas, clarify whether they are value, profit, return, invested/cost basis, or dividend deltas.

## Status Table Rules
- Status tables should provide search and clear when rows can become numerous.
- Operational status tables should provide CSV export when useful.
- Long asset/portfolio/provider labels should clamp or truncate safely.
- Keep action buttons compact and visually ordered:
  - primary/normal actions first
  - risky/destructive actions last

## Chart Rules
- Missing dates should not be fabricated.
- If a chart uses amount values, Amount Blur must apply to money axis labels and inspect cards.
- If a chart uses percentages, do not blur the labels.
- Chart controls should be compact and live near chart explanations.
- Mobile charts can scroll internally; page-level horizontal overflow is not acceptable.

## Form Rules
- Inputs/selects should use MyAsset compact styling.
- Use clear labels, not placeholder-only forms.
- Validation messages should be visible and plain.
- Use inline edit/save/cancel patterns for dashboard settings where possible.

## AI Handoff Rule
When another AI tool continues development, it should read:
- `docs/design-system.md`
- `rules/ui-style-rules.md`
- `rules/development-rules.md`

These files are the source of truth for frontend UI style decisions.
