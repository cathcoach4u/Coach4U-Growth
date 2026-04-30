# Claude Code Project Memory

## Git Workflow
- Always push changes directly to `main` branch
- Commit with clear, descriptive messages
- Push after every commit — do not batch pushes
- Bump version number with EVERY change in: `VERSION`, `CHANGELOG.md`, and `CLAUDE.md`

## Project Overview
- The Growth Hub — a focused growth-marketing PWA (strategy, quarterly priorities, campaigns, content, metrics, personas, AI assistant, integrations)
- Hosted on GitHub Pages at https://cathcoach4u.github.io/Coach4U-Growth/ (project pages base path `/Coach4U-Growth/`)
- Uses email + password sign-in via Supabase (no magic-link / OTP)
- Membership-gated: every page checks `users.membership_status = 'active'` and routes inactive users to `inactive.html`

## Source-of-truth Setup Contract
This project follows the Coach4U App Setup Guide. Key rules:
- **Inline Supabase init in every HTML page.** Use `<script type="module">` with `import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'`. Do not import auth/data operations from an external config file — GitHub Pages does not reliably load external `.js` modules.
- **Auth = email + password** via `supabase.auth.signInWithPassword`. Magic-link / OTP flows are not used.
- **Forgot-password redirect must be built from `window.location.href`**, not `window.location.origin`, so Supabase can match the allowed redirect URL.
- **Membership gate**: after auth, query `users.membership_status` and redirect to `inactive.html` if not `'active'`.

## Supabase
- Project URL: `https://eekefsuaefgpqmjdyniy.supabase.co`
- Anon key (publishable): `sb_publishable_pcXHwQVMpvEojb4K3afEMw_RMvgZM-Y`
- Required allowed redirect URLs (Supabase dashboard → Authentication → URL Configuration):
  - `https://cathcoach4u.github.io/Coach4U-Growth/index.html`
  - `https://cathcoach4u.github.io/Coach4U-Growth/reset-password.html`

## Design System
- Primary (navy): `#003366`
- Accent (blue-teal): `#0D9488` — buttons, active borders, links
- Accent dark (hover): `#0F766E` — hover states
- Card borders: 2px solid, 12px border-radius
- Font: Aptos system stack
- Touch targets: 44px minimum height on mobile
- Links: blue-teal (`#0D9488`), not navy or green
- IMPORTANT: Do NOT use green-teal (`#00B894`, `#1D9E75`) — use `#0D9488` instead

## Key Files
- `index.html` — auth gateway (session + membership routing)
- `login.html` — email + password sign-in
- `forgot-password.html` / `reset-password.html` — password reset flow
- `inactive.html` — membership-not-active landing
- `growth/index.html` — the Growth Hub application (inlines its own Supabase client + membership gate)
- `growth/css/style.css` — Growth Hub specific styles
- `growth/js/app.js`, `strategy.js`, `quarterly.js`, `campaigns.js`, `content.js`, `metrics.js`, `ai.js` — Growth Hub modules
- `js/ai.js` — `askAI` / `askAISimple` wrappers around the Supabase Edge Function (reads `window.SUPABASE_URL` / `window.SUPABASE_ANON_KEY` set inline by the host page)
- `css/style.css` — shared design tokens
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
v0.7.0

## Recent Changes (v0.7.0)
- Aligned to the Coach4U App Setup Guide (source-of-truth)
- Switched Supabase project to `eekefsuaefgpqmjdyniy` with publishable anon key
- Replaced magic-link auth with email + password (`supabase.auth.signInWithPassword`)
- Added `login.html`, `forgot-password.html`, `reset-password.html`, `inactive.html`
- Made root `index.html` an auth gateway (session check + membership gate)
- Inlined Supabase init in every HTML page; deleted `js/supabase.js` and `js/auth.js`
- Updated `js/ai.js` to read Supabase URL/key from window globals set by the host page; new edge-function URL points at the new project
- Simplified `sw.js` to a relative-path cache-first worker; cache `coach4u-growth-v0.7.0`
- Aligned `manifest.json` (relative paths, theme/background `#003366`, scope `./`, start_url `index.html`)

## Outstanding Tasks
1. Add the two redirect URLs to the Supabase project's allowed redirect list
2. Create the `users` table per the schema in the setup guide and add yourself with `membership_status = 'active'`
3. Smoke-test sign-in → gateway → growth, plus inactive flow and the password-reset round-trip
4. (Optional) Generate proper PNG icons (`icons/icon-192.png`, `icons/icon-512.png`) and reference them in `manifest.json`
