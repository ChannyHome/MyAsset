# MyAsset Web Asset Design System

This document defines the visual language for MyAsset remote pages.

The goal is not to look like a generic admin template. MyAsset should feel like a focused financial cockpit: dark, dense, readable, and calm under heavy data.

## Stack Decision
- Use Vue 3 + Tailwind CSS + MyAsset custom classes.
- Do not use Ant Design Vue by default.
- Do not introduce another component library unless there is an explicit maintenance and migration plan.

## Visual Personality
- Base mood: dark navy/slate dashboard.
- Primary accent: indigo/violet for selected controls and active tabs.
- Positive money movement: emerald.
- Negative money movement: rose.
- Warnings/dividend highlights: amber.
- Informational states: sky/cyan.
- Surfaces should be layered, not flat: page background, card surface, soft inner panel, pill/badge.

## Typography
- Use the global font stack from `src/style.css`.
- Preserve Korean readability first.
- Use bold labels for financial values.
- Use uppercase tracking labels for section headers such as `RANGE`, `BUCKET`, `ACTIONS`, `STATUS`.

## Reusable CSS Classes
`src/style.css` provides semantic helpers for new UI.

Use these when building new standalone cards or status panels:

```html
<article class="ma-card p-4">
  <div class="flex items-start justify-between gap-3">
    <div>
      <p class="ma-section-label">Dividend</p>
      <h2 class="text-xl font-black text-slate-950 dark:text-slate-50">Dividend Income</h2>
      <p class="ma-muted mt-1 text-sm">Expected dividends and ETF distributions.</p>
    </div>
    <button class="ma-btn">Collapse</button>
  </div>
</article>
```

```html
<button class="ma-btn ma-btn-primary">Save</button>
<button class="ma-btn ma-btn-success">Update Now</button>
<button class="ma-btn ma-btn-warning">Review</button>
<button class="ma-btn ma-btn-danger">Disable</button>
```

```html
<input class="ma-input" />
<select class="ma-select"></select>
<span class="ma-pill ma-status-success">COMPLETED</span>
```

```html
<div class="ma-table-wrap">
  <table class="ma-table">
    <thead>
      <tr><th>Asset</th><th>Status</th></tr>
    </thead>
    <tbody>
      <tr><td>VOO</td><td>READY</td></tr>
    </tbody>
  </table>
</div>
```

## Cards
- Use rounded borders, slate surfaces, and compact spacing.
- Prefer full-width cards for charts and dense tables.
- Nested panels should use softer surfaces, not another heavy card.
- Every operational card should have a short subtitle explaining its purpose.
- Expand/collapse should be available for heavy cards and stored in localStorage only when it helps returning users.

## Controls
- Use compact segmented buttons for modes/tabs.
- Active state should be visually clear with indigo/violet border or fill.
- Dangerous actions should not look like primary actions.
- `Update Quotes Now` and `Update Dividend Now` should use success styling.
- `Disable`, `Delete`, and destructive actions should use danger styling.

## Tables
- Tables are operational tools, not decoration.
- Include search/clear/export when the table is status-like or operationally useful.
- Long labels should use two-line clamp or safe truncation.
- Amount columns should align right when possible.
- Status/source/tax profile columns should stay readable and should not be blurred.

## Charts
- Charts should respect the same dark cockpit style.
- Use backend-calculated values where possible.
- Do not fabricate missing points on the frontend.
- Money axis labels should follow Amount Blur.
- Percentage axis labels do not use Amount Blur.
- Color meaning must stay consistent across charts:
  - Gross/current value: emerald/green
  - Liabilities/loss/risk: rose/red
  - Net: sky/blue
  - Asset/portfolio comparison lines: stable palette per key

## Amount Blur
Amount Blur is a privacy feature.

Blur:
- Current value
- Gross/net/liabilities amounts
- Dividend gross/tax/net/received amounts
- Cost basis/invested/profit amounts
- Y-axis money labels

Do not blur:
- Percentages
- Dates
- Status labels
- Tax profiles
- Source names
- Payment months
- Confidence/status badges

## Mobile
- Cards should stack vertically.
- Controls can wrap, but avoid body-level horizontal overflow.
- Tables and charts may use internal horizontal scroll.
- Touch targets should be large enough for mobile use.
- Dense information should degrade into cards/pills rather than tiny table cells.

## What To Avoid
- Do not introduce Ant Design Vue for a single form or table.
- Do not mix unrelated component visual systems inside the same page.
- Do not use default browser-looking controls without MyAsset styling.
- Do not use purple as a generic default everywhere; indigo/violet is for active selection, not all emphasis.
- Do not hide important status/error information behind icon-only UI.
