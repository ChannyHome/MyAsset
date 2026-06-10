# MyAsset Web Host Overview

`web-host` is the shell application that owns the global app frame and mounts `web-asset` remote pages through Module Federation.

## Responsibilities
- Login/auth shell.
- Main layout and LNB navigation.
- Global display currency toggle.
- Global name clamp toggle.
- App Settings and admin-only global settings.
- Remote fallback/loading UI.
- Remote page mounting for `web-asset`.

## Remote Architecture
`web-host` consumes `web_asset` from `VITE_WEB_ASSET_REMOTE_URL`.

Default remote:

```text
http://127.0.0.1:5174/assets/remoteEntry.js
```

Host dev server:

```text
http://127.0.0.1:5173
```

Remote dev server:

```text
http://127.0.0.1:5174
```

## Settings
App Settings owns global operational settings, including:

- Token refresh settings.
- OpenAI/chat settings.
- Dividend taxable financial income limit.

Portfolio-specific tax profile settings belong to Portfolio Edit, not App Settings.

## Current UI Stack Reality
The host uses Vue 3 + Tailwind CSS custom components and `lucide-vue-next` for icons. `ant-design-vue` is not installed or used, and new host UI should follow the MyAsset custom design system.
