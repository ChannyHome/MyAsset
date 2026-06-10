# MyAsset Web Host Design System

The host owns the shell: navigation, global settings, auth-aware routing, remote fallback/loading states, and app-wide settings screens.

The host should visually match the remote dashboard, but it should stay simpler and more stable.

## Stack Decision
- Use Vue 3 + Tailwind CSS + MyAsset custom classes.
- Use `lucide-vue-next` for icons.
- Do not use Ant Design Vue by default.

## Shell Personality
- Dark navy/slate background.
- Clear side navigation and top app controls.
- Compact but readable global settings.
- Remote loading/failure states should be calm and actionable.

## Reusable CSS Classes
`src/style.css` provides semantic helpers shared with the remote style vocabulary:

```html
<section class="ma-card p-4">
  <p class="ma-section-label">App Settings</p>
  <h2 class="text-xl font-black text-slate-950 dark:text-slate-50">Settings</h2>
  <p class="ma-muted mt-1 text-sm">Manage global app behavior.</p>
</section>
```

```html
<button class="ma-btn">Cancel</button>
<button class="ma-btn ma-btn-primary">Save</button>
<input class="ma-input" />
<span class="ma-pill ma-status-info">REMOTE</span>
```

## Host-Specific Rules
- Navigation should be instantly recognizable and not visually compete with dashboard cards.
- Remote loading and error components should explain which remote failed and what the user can do.
- App Settings cards should use the same dark card language as dashboard/admin pages.
- Global controls such as display currency should remain compact and high-contrast.

## What To Avoid
- Do not introduce a separate admin UI look in the host.
- Do not make App Settings look unrelated to Home/Agent.
- Do not use external UI libraries for one-off forms.
