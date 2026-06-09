# Web Asset Development Rules

## Stack
- Vue 3
- TypeScript
- Vite
- Module Federation remote
- Tailwind CSS utility styling

## UI Rules
- Preserve existing dark dashboard visual language.
- Keep status tables searchable and exportable where operationally useful.
- Long labels in dense tables should truncate or wrap safely.
- Expand/collapse state should use localStorage only when it improves return visits.

## Dividend Rules
- Show both forecast/reference status and holding-level dividend analysis separately.
- Do not mix expected dividend and received dividend as the same source of truth.
- Apply Amount Blur to dividend gross, tax, net, received, and expected money values.
- Do not blur dividend yield, tax rate, tax profile, source, status, or payment months.

## Build
- Run `npm run build` after frontend changes.
