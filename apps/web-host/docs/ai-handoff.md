# AI Handoff Notes for Web Host

Read this before changing `web-host`.

## Current Stack Reality
- Vue 3 + TypeScript + Vite.
- Tailwind CSS custom layout.
- lucide-vue-next icons.
- Ant Design Vue is not installed or used; prefer the MyAsset custom UI system.
- Module Federation host for `web-asset`.

## Safe Change Pattern
1. Check whether the feature belongs in host or remote.
2. Host is for shell, navigation, auth, and global settings.
3. Remote business pages belong in `web-asset`.
4. Update typed API wrappers under `src/api`.
5. Run `npm run build`.

## Do Not
- Do not put portfolio-specific settings in App Settings.
- Do not hardcode remote URLs inside Vue pages.
- Do not duplicate remote page business logic in host fallback pages.
