# Claude Code Project Memory

## Git Workflow
- Always push changes directly to `main` branch
- Commit with clear, descriptive messages
- Push after every commit — do not batch pushes
- Bump version number with EVERY change (patch: 0.6.x) in: `VERSION`, `CHANGELOG.md`, and `CLAUDE.md`

## Project Overview
- The Growth Hub — a focused growth-marketing PWA (strategy, quarterly priorities, campaigns, content, metrics, personas, AI assistant, integrations)
- Hosted on GitHub Pages at https://cathcoach4u.github.io/Coach4U-Growth/ (project pages base path `/Coach4U-Growth/`)
- Uses magic link (OTP) sign-in via Supabase
- Login lands directly in `/growth/index.html` — there is no multi-module dashboard

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
- `index.html` — magic-link login page (redirects authenticated users to `growth/index.html`)
- `growth/index.html` — the Growth Hub application
- `growth/css/style.css` — Growth Hub specific styles
- `growth/js/app.js`, `strategy.js`, `quarterly.js`, `campaigns.js`, `content.js`, `metrics.js`, `ai.js` — Growth Hub modules
- `js/supabase.js` — Supabase client init
- `js/auth.js` — magic link auth + redirects (login ↔ `growth/index.html`)
- `js/ai.js` — shared `askAI` / `askAISimple` wrappers around the Supabase Edge Function
- `css/style.css` — shared design tokens (used by `growth/index.html`)
- `sw.js`, `manifest.json`, `offline.html`, `404.html` — PWA shell

## Current Version
v0.6.1

## Recent Changes (v0.6.1)
- Repointed all hardcoded `/external-Coach4u-app/` paths to `/Coach4U-Growth/` so the PWA deploys at https://cathcoach4u.github.io/Coach4U-Growth/
- Bumped service worker cache to `coach4u-growth-v0.6.1`

## Previous Changes (v0.6.0)
- Cleaned the repo down to just the Growth Hub
- Removed `business/` module, `Prototypes-coach4Uexternal/`, and unused root JS (`app.js`, `app-business.js`)
- Login + auth redirects now go directly to `/growth/index.html` (no dashboard step)
- Trimmed `js/supabase.js` and `js/ai.js` to growth-only surface area
- Service worker bumped to `coach4u-growth-v0.6.0` and only precaches Growth Hub assets

## Outstanding Tasks
1. Verify magic-link sign-in lands in `/growth/index.html` end-to-end
2. Smoke-test all Growth Hub panels (Strategy, Q-Plan, Campaigns, Content, Metrics, Personas, AI Assistant, Integrations)
3. Confirm service worker upgrade clears the old `coach4u-v0.5.x` caches on first load
