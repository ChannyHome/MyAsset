# Web Host Development Rules

## Stack
- Vue 3
- TypeScript
- Vite
- Module Federation host via `@originjs/vite-plugin-federation`
- Pinia
- Vue Router
- Axios
- Tailwind CSS
- lucide-vue-next
- MyAsset custom UI system in `src/style.css`

## Host Rules
- Keep global settings in App Settings only when the setting is app-wide.
- Do not place portfolio-specific tax settings in App Settings.
- Remote page integration should preserve host navigation, auth guards, and shell behavior.
- Prefer small API wrappers under `src/api` for host-owned settings.
- If a remote fails to load, keep `RemoteFallback` clear and actionable.

## Module Federation Rules
- The host remote URL comes from `VITE_WEB_ASSET_REMOTE_URL`.
- Do not hardcode production remote URLs in page components.
- Shared dependencies must stay compatible with the remote app.

## MyAsset UI System Rules
- Do not introduce Ant Design Vue or another external UI library without an explicit design/maintenance plan.
- Keep shell navigation, App Settings, remote loading/error states, and global controls visually consistent with the MyAsset dark layout.
- Prefer semantic `ma-*` classes from `src/style.css` for new cards, buttons, inputs, badges, and tables.
- Dense admin/settings forms should use MyAsset compact controls rather than importing a separate component visual language.

## Build
- Run `npm run build` after host changes.
