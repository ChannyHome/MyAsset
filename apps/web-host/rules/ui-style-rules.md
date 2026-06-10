# MyAsset Web Host UI Style Rules

Use these rules when developing `apps/web-host`.

## Core Rule
The host should preserve the MyAsset shell identity and should not introduce Ant Design Vue or another external UI library without an explicit migration plan.

## Required Patterns
- Use `src/style.css` semantic classes for new host UI:
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

## Host UX Rules
- Keep global navigation stable.
- Remote fallback/loading states should be clear, not decorative.
- App Settings should use compact MyAsset cards and plain validation.
- Do not put portfolio-specific settings into global settings unless explicitly required.
- Global settings that affect financial display must be described in user-facing language.

## AI Handoff Rule
When another AI tool continues host development, it should read:
- `docs/design-system.md`
- `rules/ui-style-rules.md`
- `rules/development-rules.md`
