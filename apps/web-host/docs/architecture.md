# Web Host Architecture

## Directory Map
- `src/layouts/MainLayout.vue`: shell layout and LNB.
- `src/router`: route definitions and guards.
- `src/remotes.ts`: remote component loading.
- `src/pages`: host-owned pages such as login, settings, fallback, app settings.
- `src/components`: host shell/shared controls.
- `src/stores`: auth, display currency, UI state.
- `src/api`: host-owned API wrappers.

## Module Federation
`web-host` consumes `web_asset` remote pages.

The remote URL is configured by:

```text
VITE_WEB_ASSET_REMOTE_URL
```

Default:

```text
http://127.0.0.1:5174/assets/remoteEntry.js
```

## Host-Owned Concerns
- Authentication and route access.
- LNB navigation and responsive shell.
- Global display currency.
- Global app settings.
- Remote loading/fallback.

Remote page business UI should generally live in `web-asset`.
