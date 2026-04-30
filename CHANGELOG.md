# Changelog

## v0.7.0 — 2026-04-30

### Align to Coach4U App Setup Guide (source-of-truth)
- **Supabase project switched** to `eekefsuaefgpqmjdyniy` with the new publishable anon key (`sb_publishable_...`)
- **Auth flow switched from magic-link to email + password** (`supabase.auth.signInWithPassword`)
- New pages:
  - `login.html` — dedicated email + password sign-in (was the old root `index.html`)
  - `forgot-password.html` — password-reset email; redirect built from `window.location.href`
  - `reset-password.html` — sets a new password via `supabase.auth.updateUser`
  - `inactive.html` — landing for users whose `users.membership_status` is not `'active'`
- Root `index.html` is now an **auth gateway**: checks session, queries `users.membership_status`, then routes to `growth/index.html`, `inactive.html`, or `login.html`
- **Inlined Supabase init** (`<script type="module">` + ESM import) in every HTML page; deleted `js/supabase.js` and `js/auth.js`
- `growth/index.html` now does its own membership gate inline; exposes `window.supabaseClient`, `window.SUPABASE_URL`, `window.SUPABASE_ANON_KEY` and `window.signOut` for the existing growth modules
- `js/ai.js` reads the Supabase URL + anon key from `window` globals set by the host page; default URL points at the new project
- **Simplified `sw.js`** to a minimal relative-path cache-first worker; cache version bumped to `coach4u-growth-v0.7.0`
- **Aligned `manifest.json`**: relative paths, scope `./`, start_url `index.html`, theme + background `#003366`
- 404 page CTAs updated to `login.html` and `/Coach4U-Growth/`
- README + CLAUDE.md rewritten to reflect the source-of-truth contract

## v0.6.1 — 2026-04-30

### Re-host under `/Coach4U-Growth/` base path
- Repointed every hardcoded `/external-Coach4u-app/` reference to `/Coach4U-Growth/` so the app deploys cleanly at https://cathcoach4u.github.io/Coach4U-Growth/
- Updated `manifest.json` (start_url, scope, icon and screenshot paths)
- Updated `sw.js` precache URLs and origin checks; cache version bumped to `coach4u-growth-v0.6.1`
- Updated `index.html`, `growth/index.html` (manifest links + service worker registration)
- Updated `js/auth.js` path-detection regex and login-page detection
- Updated `404.html`, `offline.html`, `README.md`, `CLAUDE.md`

## v0.6.0 — 2026-04-30

### Cleanup: growth-only repo
- Removed `business/` module entirely (HTML, CSS, JS)
- Removed `Prototypes-coach4Uexternal/` (Coach4U-EOS, Growth Hub, People-Hub prototypes)
- Removed unused root `js/app.js` and `js/app-business.js`
- Login (`index.html`) now redirects authenticated users straight to `/growth/index.html` instead of the missing `dashboard.html`
- `js/auth.js` redirects (sign-in, sign-out, magic-link callback, auth state change) updated to use `growth/index.html` and `index.html`; removed unused `getUserProfile` helper
- Trimmed `js/supabase.js` to just the client init (removed unused `getUserModules` and `getOrganisation`)
- Trimmed `js/ai.js` to a growth-focused demo fallback (removed strategic / operations / team / leadership / couples / family / community etc. prompt templates)
- Service worker `sw.js` now precaches only Growth Hub assets; cache version bumped to `coach4u-growth-v0.6.0`; added Chart.js CDN to precache
- `manifest.json` renamed to "The Growth Hub — Coach4U" with a growth-specific description
- `offline.html` and `404.html` re-pointed to the Growth Hub; 404 secondary CTA goes to `/growth/index.html` instead of `/dashboard.html`
- `index.html` rebranded to "The Growth Hub — Login"

## v0.5.4 — 2026-04-29

### Design system alignment (v1.3)
- Updated brand colours across all pages: primary navy `#1B3664`, blue-teal `#5684C4`, body text `#2D2D2D`, borders `#DDDDDD`
- Added Inter Bold and Montserrat Regular (Google Fonts) to all pages
- Updated `manifest.json` `theme_color` to `#1B3664`
- Inlined all module CSS — removed external `<link rel="stylesheet">` from business and growth pages
- Added missing `<head>` meta block to `business/index.html` (manifest, theme-color, favicons, PWA tags)
- Inlined Supabase client initialisation in every page
- Added `.sign-out-btn` to business and growth authenticated pages
- Standardised login form IDs to `signInForm`, `login-btn`, `message`
- Removed em-dash from login success message
- Removed exclamation mark from auth alert message
- Fixed `offline.html` footer copy to use correct practice description
- Removed duplicate `ai.js` load from `growth/index.html`
- Removed duplicate `apple-mobile-web-app-capable` meta tag from `growth/index.html`
- Bumped service worker cache version to `coach4u-v0.5.3`
- Updated version badge in `business/index.html` to v0.5.4

## v0.5.3 — prior

- Built complete ThriveHQ external PWA app (Phase 1)
- Added ThriveHQ to `/thrivehq/` with separate Supabase project
- Configured PWA manifest and service worker for `/external-Coach4u-app/thrivehq/` path
- Magic link authentication with Supabase integration
- Brain Pulse dashboard with 4 sections
- Resources hub, account page, and offline support

## v0.5.2 — prior

- Standardised typography: consolidated font sizes to 7 standard steps
- Bumped service worker cache version

## v0.5.1 — prior

- Fixed critical bug: `business/index.html` loading wrong `app.js`
- Nav pills now functional
- Removed error toasts from load functions
- Redesigned header layout
- Nav tabs styled as true pills
