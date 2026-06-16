# VisaPath — Project Structure

A reference map of the codebase: what lives where, the data model, routing, localization, and how it builds and deploys.

## Overview

VisaPath is a step-by-step visa and entry-requirements guide — an "IKEA instruction manual" for entering a country legally. The user picks an origin country, destination country, and visit purpose, and gets a full roadmap: which visa to apply for, every step in order, the documents needed, links to official portals, and an interview-prep checklist. It is a client-only single-page app; all route content is static data in [src/data/visaRoutes.ts](src/data/visaRoutes.ts).

## Tech stack

Verified against [package.json](package.json).

**Runtime**
- `react`, `react-dom` (18)
- `react-router-dom` (6) — used as `HashRouter`
- `react-i18next`, `i18next`, `i18next-browser-languagedetector` — EN/SV localization
- `jspdf` — PDF checklist export (pulls in `html2canvas` **transitively**; it is not a direct dependency)

**Dev / build**
- `typescript`
- `vite` (6), `@vitejs/plugin-react`

> **Stale note:** the project's `CLAUDE.md` lists Framer Motion and Lucide React, but **they are not installed** and are not used. All icons are hand-coded inline SVGs inside the components.

## Directory tree

```
.
├── index.html                  App HTML entry; loads /src/main.tsx
├── package.json                Scripts + dependencies
├── tsconfig.json               TypeScript config
├── vite.config.ts              Vite config (base: '/', React plugin)
├── wrangler.jsonc              Cloudflare deploy: serves ./dist as static assets + SPA fallback
├── visa-guide.html             Legacy standalone single-file HTML prototype (NOT part of the React app)
├── future-paths/               Empty placeholder directory (untracked) for future route work
├── CLAUDE.md                   Project instructions for Claude Code (untracked)
├── .github/
│   └── workflows/
│       └── deploy.yml          Legacy GitHub Pages deploy workflow (see Build & deploy)
└── src/
    ├── main.tsx                React entry; mounts <App/> inside <HashRouter>, imports i18n + index.css
    ├── App.tsx                 Renders <Navbar/>, the <Routes>, and the global <Disclaimer/> footnote
    ├── index.css               Global styles + design tokens (navy/teal palette, spacing & type scale)
    ├── i18n.ts                 i18next setup (EN/SV, language detection + localStorage persistence)
    ├── pages/
    │   ├── Landing.tsx         Home: hero + country/purpose selector + visa-type preview
    │   ├── Roadmap.tsx         Core product: step-by-step roadmap for a route (/roadmap/:routeId)
    │   └── ComingSoon.tsx      "Not Available" page: calm message + email signup (also the * catch-all)
    ├── components/
    │   ├── Navbar.tsx          Sticky navbar: VisaPath wordmark + EN/SV toggle
    │   ├── Disclaimer.tsx      Muted, non-sticky legal footnote line
    │   ├── SearchableSelect.tsx  Accessible searchable country dropdown
    │   ├── StepCard.tsx        A single roadmap step (docs checklist, links, interview prep)
    │   ├── Sidebar.tsx         Roadmap support rail (official sources, timeline, start over)
    │   └── ProgressBar.tsx     Sticky "X of N documents checked" progress bar
    ├── hooks/
    │   └── useTranslatedRoute.ts  Maps a VisaRoute to its translated strings for the active language
    ├── data/
    │   └── visaRoutes.ts       Single source of truth: types, countries, purposes, all routes, helpers
    ├── utils/
    │   └── generateChecklistPDF.ts  Builds the downloadable checklist PDF (jsPDF)
    └── locales/
        ├── en/common.json      EN UI strings (purposes, countries, phase labels, etc.)
        ├── en/routes.json      EN route overrides (currently empty {} — routes default to data English)
        ├── sv/common.json      SV UI strings
        ├── sv/routes.json      SV route translations
        └── export-for-translation.json  Non-runtime translation export artifact (tooling only)
```

> **Untracked / generated (not in git):** `future-paths/` (empty), `CLAUDE.md`, `dist/` (build output), `node_modules/`.

## Routing

Defined in [src/App.tsx](src/App.tsx); the router is `HashRouter` (set in [src/main.tsx](src/main.tsx)).

| React route path        | Component        | Notes                                  |
|-------------------------|------------------|----------------------------------------|
| `/`                     | `Landing`        | Country/purpose selector               |
| `/roadmap/:routeId`     | `Roadmap`        | Falls back to `ComingSoon` if no match |
| `*`                     | `ComingSoon`     | Catch-all / "Not Available"            |

- **React route path** is `/roadmap/:routeId`.
- **Deployed public URL shape** is `/#/roadmap/:routeId`, because the app uses `HashRouter`.
- The Cloudflare SPA fallback in [wrangler.jsonc](wrangler.jsonc) exists but is largely moot while `HashRouter` is active — it would matter only if the app switched to `BrowserRouter` (clean URLs).

## Data model

All in [src/data/visaRoutes.ts](src/data/visaRoutes.ts).

**Types**
- `Country` — `{ code, name, flag }`
- `Purpose` — `'tourist' | 'student' | 'work'`
- `DocumentItem` — `{ name, required, description?, whereToGet? }`
- `VisaStep` — `{ id, title, phase, description, documents[], tips?, estimatedTime?, estimatedCost?, officialLinks?, interviewPrep? }`
  - `phase` is one of six values: `before-applying`, `applying`, `interview`, `pre-departure`, `on-arrival`, `in-country`.
- `VisaRoute` — `{ id, origin, destination, purpose, visaType, processingTime, stayDuration, estimatedCost, summary, athleteNote?, officialLinks[], steps[] }`

**Constants**
- `COUNTRIES` — Sweden (SE), United States (US), United Kingdom (UK), India (IN)
- `PURPOSES` — tourist, student, work (each with label + emoji)
- `PHASE_LABELS` — display label per phase
- `VISA_ROUTES` — the array of all routes

**Helpers**
- `getRoute(id)` — one route by id (or `undefined`)
- `getRoutesForPair(originCode, destCode)` — routes for a country pair
- `getPurposesForPair(originCode, destCode)` — available purposes for a pair
- `getAllRoutes()` — every route

## Localization

- Config: [src/i18n.ts](src/i18n.ts) — English + Swedish, browser language detection, persisted to `localStorage`. Toggle lives in [Navbar.tsx](src/components/Navbar.tsx).
- [useTranslatedRoute.ts](src/hooks/useTranslatedRoute.ts) swaps a route's strings for the active language.
- **What is translated:** route *data* (via `routes.json`) and a set of `common.json` keys. **What is not:** most page/UI chrome strings are hardcoded English in the components today. Official terms (SEVIS, DS-160, F-1, etc.) stay in English in both languages by design.

## Build & deploy

Scripts ([package.json](package.json)): `dev` (vite), `build` (`tsc && vite build`), `preview` (vite preview).

- **Cloudflare (current):** [wrangler.jsonc](wrangler.jsonc) serves the Vite output `./dist` as static assets with `not_found_handling: "single-page-application"`. Vite `base` is `/` so assets resolve at the site root.
- **GitHub Pages (legacy):** [.github/workflows/deploy.yml](.github/workflows/deploy.yml) still builds `main` and publishes `dist` to Pages. See Maintenance notes — this conflicts with `base: '/'`.

## Maintenance notes

Housekeeping, not product features:

- **CLAUDE.md stack drift:** CLAUDE.md lists Framer Motion and Lucide, but they are not installed.
- **GitHub Pages base conflict:** `base: '/'` (needed for Cloudflare's root serving) breaks the legacy GitHub Pages workflow, which serves under `/visapath/`. If Pages is retired, delete [.github/workflows/deploy.yml](.github/workflows/deploy.yml); otherwise `base` must be made environment-aware.
- **Email-notify is a stub:** the [ComingSoon.tsx](src/pages/ComingSoon.tsx) signup form sets a success state but does not send anywhere — wire it to a real endpoint.
- **Clean URLs:** switching `HashRouter` → `BrowserRouter` would give `/roadmap/...` (the Cloudflare SPA fallback already supports it).
- **Translation export:** `src/locales/export-for-translation.json` is a non-runtime artifact and can drift from live data — regenerate when needed.
