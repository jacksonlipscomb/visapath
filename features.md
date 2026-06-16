# VisaPath — Features

A basic list of what the app does today, what content it covers, and what's planned next.

## Current features

**Find your route**
- Origin → destination → purpose selector on the home page.
- Searchable country dropdowns (keyboard accessible); same-country pairs are excluded.
- Only purposes that have a real route are selectable for a given pair.
- Subtle visa-type preview ("You'll likely need the …") once a route resolves.

**Roadmap (the core product)**
- Step-by-step instructions for a route, grouped by phase (before applying → applying → interview → pre-departure → on arrival → in country).
- Each step shows a description, the documents needed (required vs optional), where to get them, official portal links, tips, and interview prep where relevant.
- Document checklist with progress saved in `localStorage` (persists across reloads, per route).
- Sticky progress bar ("X of N documents checked") and a completion message.
- Support sidebar: official sources, timeline, and a "start over" link.
- Download the checklist as a PDF.

**Cross-cutting**
- English / Swedish language toggle (persisted), with route content translated.
- "Not Available" page with an email-notify signup for routes that don't exist yet.
- Bookmarkable route URLs; unknown routes fall back to the Not Available page gracefully.
- Clean, minimalist navy/teal UI, fully responsive on mobile.

## Current coverage

- **Countries (4):** Sweden (SE), United States (US), United Kingdom (UK), India (IN).
- **Purposes (3):** tourist, student, work.
- **Routes (9):** `se-us-student`, `se-us-tourist`, `se-us-work`, `us-se-student`, `us-se-tourist`, `uk-us-student`, `uk-us-tourist`, `in-us-student`, `in-us-tourist`.

## Future features

Planned, not yet built. Each note flags the rough implication.

- **Login with email & password** — user accounts so checklist progress (and eventually saved routes) syncs across devices instead of being `localStorage`-only. Implication: requires a backend with a users store, password hashing, and session/token handling — the app is currently fully client-side with no server.

- **Login with OAuth** *(separate effort)* — "Sign in with Google / Apple" etc., layered on top of the email/password auth system as a distinct piece of work. Implication: provider app registrations, OAuth callback/redirect handling, and account-linking with existing email accounts.

- **More paths** — expand coverage with additional routes, country pairs, and purposes (e.g. work routes for more pairs, more origin/destination countries). Implication: add entries to `VISA_ROUTES` (and `COUNTRIES`/`PURPOSES` as needed) in [src/data/visaRoutes.ts](src/data/visaRoutes.ts) following the existing `VisaRoute` schema, plus matching EN/SV strings in `src/locales/`.

> Housekeeping/tech-debt items (wiring the email-notify form to a real endpoint, clean URLs via `BrowserRouter`, regenerating the translation export) live in [structure.md](structure.md) → Maintenance notes, to keep this file product-focused.
