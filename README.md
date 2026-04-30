# Coach4U Growth Hub

A focused PWA for growth-marketing planning: strategy, quarterly priorities,
campaigns, content, metrics and personas — gated by an active Coach4U
membership and backed by Supabase email + password auth.

Hosted on GitHub Pages at https://cathcoach4u.github.io/Coach4U-Growth/.

## Routes

- `index.html` — auth gateway (routes to login / inactive / app by session + membership)
- `login.html` — email + password sign-in
- `forgot-password.html` / `reset-password.html` — password reset flow
- `inactive.html` — shown when membership is not active
- `growth/index.html` — the Growth Hub application

## Conventions

Every HTML page initialises Supabase inline inside a `<script type="module">` —
external config files are not used for auth/data operations (GitHub Pages does
not reliably load them as modules). See `CLAUDE.md` for the full setup contract.
