# Claude Code Project Memory

## Git Workflow
- Always push changes directly to `main` branch
- Commit with clear, descriptive messages
- Push after every commit — do not batch pushes
- Bump version number with EVERY change in: `VERSION`, `CHANGELOG.md`, and `CLAUDE.md`

## Project Overview
- The Growth Hub — a focused growth-marketing PWA (strategy, quarterly priorities, campaigns, content, metrics, personas, AI assistant, integrations)
- Hosted on GitHub Pages at https://cathcoach4u.github.io/yourmarketingcoach/
- Uses email + password sign-in via Supabase (no magic-link / OTP)
- Membership-gated: every page checks `users.membership_status = 'active'` and routes inactive users to `inactive.html`

## Source-of-truth Setup Contract
This project follows the Coach4U App Setup Guide. Key rules:
- **Inline Supabase init in every HTML page.** Use `<script type="module">` with `import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'`. Do not import from an external config file.
- **Auth = email + password** via `supabase.auth.signInWithPassword`. Magic-link / OTP flows are not used.
- **Forgot-password redirect must be built from `window.location.href`**, not `window.location.origin`.
- **Membership gate**: after auth, query `users.membership_status` and redirect to `inactive.html` if not `'active'`.

## Supabase
- Project URL: `https://eekefsuaefgpqmjdyniy.supabase.co`
- Anon key (publishable): `sb_publishable_pcXHwQVMpvEojb4K3afEMw_RMvgZM-Y`
- Import always unversioned: `import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'`

## Design System (v2.2)
- Primary (navy): `#003366`
- Accent (teal): `#0D9488` — buttons, active borders, links
- Accent dark (hover): `#0F766E`
- Background: `#ffffff`
- Text: `#333333`
- Font: Aptos system stack — **no Google Fonts**
- Touch targets: 44px minimum height on mobile
- Card border-radius: 12px

## Login Page Standard (Gold Standard v2.2)

All auth pages (`login.html`, `forgot-password.html`, `reset-password.html`) use gold standard:
- No inline `<style>` blocks
- No Google Fonts
- `css/style.css` handles all login styling
- Post-login redirect: `index.html`

Required `<head>` structure:
```html
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#003366">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Your Marketing Coach">
<link rel="stylesheet" href="css/style.css">
```

Service worker registration on login page:
```html
<script>
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
</script>
```

## Key Files
- `login.html` — gold standard email + password sign-in
- `forgot-password.html` / `reset-password.html` — password reset flow
- `inactive.html` — membership-not-active landing
- `index.html` — the Growth Hub application (inlines its own Supabase client + membership gate)
- `growth/index.html` — redirect to `index.html` (backward compat)
- `css/spa.css` — Growth Hub SPA styles
- `js/app.js`, `strategy.js`, `quarterly.js`, `campaigns.js`, `content.js`, `metrics.js`, `ai-growth.js` — Growth Hub modules
- `js/ai.js` — `askAI` / `askAISimple` wrappers around the Supabase Edge Function
- `css/style.css` — shared design tokens (v2.2)
- `sw.js`, `manifest.json`, `offline.html`, `404.html` — PWA shell

## Adding a Member
After the user signs up, run in the Supabase SQL editor:
```sql
INSERT INTO users (id, email, membership_status)
SELECT id, email, 'active'
FROM auth.users
WHERE LOWER(email) = LOWER('email@here.com');
```

## Current Version
v0.9.0

## Recent Changes (v0.9.0)
- Moved Growth Hub from `growth/index.html` to root `index.html`
- Dashboard now accessible at https://cathcoach4u.github.io/yourmarketingcoach/
- Moved `growth/js/` → `js/`, `growth/css/spa.css` → `css/spa.css`
- `growth/js/ai.js` renamed to `js/ai-growth.js` to avoid collision with API wrapper
- `growth/index.html` now redirects to root for backward compat
- Updated all `login.html` post-auth redirects to `index.html`

## Recent Changes (v0.8.0)
- Standardised `login.html`, `forgot-password.html`, `reset-password.html` to gold standard (no Google Fonts, no inline styles, PWA meta)
- Upgraded `css/style.css` to v2.2 design system (`#003366` navy, `#0D9488` teal, Aptos font, white background)
- Fixed post-login redirect to `growth/index.html`
- Unpinned Supabase import (was `@2.x`, now unversioned)

## Current Status
- **Growth Hub**: WORKING — strategy, Q-plan, campaigns, content, metrics
- **Login**: Gold standard v2.2
- **PWA**: Service worker + manifest active
