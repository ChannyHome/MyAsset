# Web Host Development Rules

## Stack
- Vue 3
- TypeScript
- Vite
- Module Federation host
- Tailwind CSS utility styling

## Rules
- Keep global settings in App Settings only when the setting is app-wide.
- Do not place portfolio-specific tax settings in App Settings.
- Remote page integration should preserve the host navigation and shell behavior.
- Prefer small API wrappers under `src/api` for host-owned settings.

## Build
- Run `npm run build` after host changes.
