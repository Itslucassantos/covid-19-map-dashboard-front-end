# COVID-19 Map Dashboard — Frontend

An interactive dashboard that shows COVID-19 statistics on a world map. Click a country to see its numbers, compare them with the global totals and follow its historical evolution in charts.

This repository is the **frontend only**. It displays data, handles user interaction and provides the interface. Fetching and storing data from external sources is the job of the backend:

> **Backend repository:** [Itslucassantos/covid-19-map-dashboard-backend](https://github.com/Itslucassantos/covid-19-map-dashboard-backend)

> **Project demo video:** [Watch on Google Drive](https://drive.google.com/file/d/1ivxAJFSLdCYf5vN8-E1i2BlGt-Rjezah/view?usp=drive_link)

[![CI](https://github.com/Itslucassantos/covid-19-map-dashboard-front-end/actions/workflows/ci.yaml/badge.svg)](https://github.com/Itslucassantos/covid-19-map-dashboard-front-end/actions/workflows/ci.yaml)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## Table of contents

- [Demo video](#demo-video)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [Routes](#routes)
- [API contract](#api-contract)
- [Conventions and standards](#conventions-and-standards)
- [Internationalization](#internationalization)
- [Theming](#theming)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Continuous integration](#continuous-integration)
- [Known limitations](#known-limitations)
- [License](#license)

---

## Demo video

A walkthrough of the project is available here: [Watch on Google Drive](https://drive.google.com/file/d/1ivxAJFSLdCYf5vN8-E1i2BlGt-Rjezah/view?usp=drive_link).

## Features

The project was built in three delivery levels:

| Level | What it delivers |
|---|---|
| 1 | Interactive map; clicking a country shows its data (markers + popup) |
| 2 | Comparison between the selected country and the global values |
| 3 | Historical data and growth charts |

Main capabilities:

- **Interactive map** with circular markers whose radius is proportional to the active metric (total cases, deaths or cases per million), a scale legend and zoom controls.
- **Stat cards** for global data, the selected country and a configurable period (7 / 30 / 90 days) computed from the history.
- **Charts**: cumulative growth (country vs. global) and new cases per day with a 7-day moving average.
- **Country search** with autocomplete and a **sortable countries table** as an accessible alternative to the map.
- **Shareable URLs**: the selected country lives in the URL (`/country/:iso2`), so the back button and links work.
- **Responsive layout**: a 12-column grid on desktop; on mobile a single column with a horizontal card carousel and a bottom sheet for country details.
- **Light and dark themes**, including map tiles and charts.
- **English and Brazilian Portuguese** interface.
- **Resilient states**: skeleton loaders, empty states, translated API errors with "try again", cached-data notice and a stale-data notice.

## Tech stack

| Area | Technology |
|---|---|
| Language | [TypeScript](https://www.typescriptlang.org/) |
| UI library | [React 19](https://react.dev/) |
| Bundler / dev server | [Vite](https://vite.dev/) (SPA) |
| Routing | [React Router](https://reactrouter.com/) |
| Map | [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/), OpenStreetMap/CARTO tiles (no API key), `world-atlas` + `topojson-client` for land shapes |
| Data fetching and cache | [TanStack Query](https://tanstack.com/query) |
| Charts | [Recharts](https://recharts.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) with design tokens as CSS variables |
| i18n | [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/) |
| Font | [Manrope](https://fontsource.org/fonts/manrope) (variable, via Fontsource) |
| Tests | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) (jsdom) |
| Lint / format | [ESLint](https://eslint.org/) (typescript-eslint, react-hooks, react-refresh) + [Prettier](https://prettier.io/) |
| CI | GitHub Actions |

## Getting started

### Prerequisites

- **Node.js 24** (the version used in CI) and npm
- The **backend** running locally — see its [README](https://github.com/Itslucassantos/covid-19-map-dashboard-backend) for setup instructions

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Itslucassantos/covid-19-map-dashboard-front-end.git
cd covid-19-map-dashboard-front-end

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env

# 4. Start the dev server
npm run dev
```

The app runs at <http://localhost:5173>. The port is fixed (`strictPort`) because the backend whitelists this origin in its CORS configuration.

By default the app expects the API at `http://localhost:3333/api`. Start the backend first, otherwise the dashboard will show the translated `NETWORK_ERROR` state.

## Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Starts the Vite dev server on port 5173 |
| `npm run build` | Type-checks (`tsc -b`) and creates the production build in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |
| `npm run typecheck` | Runs the TypeScript project build without emitting files |
| `npm test` | Runs the test suite once |
| `npm run test:watch` | Runs Vitest in watch mode |
| `npm run format` | Formats the whole project with Prettier |

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3333/api` | Base URL of the backend REST API |

Variables prefixed with `VITE_` are embedded in the client bundle at build time. Never put secrets in them.

## Project structure

The code is organized by **feature**, with cross-cutting code in `shared/`. Files and folders use `kebab-case`.

```
src/
├── app/                  # App root: providers (Query, Router, i18n, theme) and routes
│   ├── app.tsx
│   └── router.tsx
├── pages/                # Route-level screens
│   ├── dashboard-page.tsx
│   └── not-found-page.tsx
├── features/
│   ├── map/              # Leaflet map, markers, legend, metric tabs, land layer
│   ├── stats/            # Global, country and period cards, country sheet, stale notice
│   ├── charts/           # Growth chart, daily cases chart, chart theme
│   ├── countries/        # Sortable countries table (accessible map alternative)
│   └── search/           # Country search with autocomplete
├── shared/
│   ├── api/              # HTTP client, query keys/hooks, API types, error message mapping
│   ├── ui/               # Card, Skeleton, EmptyState, ErrorState, Header, toggles, notices
│   ├── i18n/             # i18n setup, en.json, pt-BR.json
│   ├── lib/              # Number/date formatting, history helpers, marker radius scale, safe storage
│   └── theme/            # Theme provider (light / dark / system)
├── test/                 # Test setup and API mocks
├── index.css             # Tailwind entry and design tokens
└── main.tsx              # Application entry point
```

Tests live next to the code they cover (`*.test.ts` / `*.test.tsx`). The `@` alias points to `src/` (e.g. `import { DashboardPage } from '@/pages/dashboard-page'`).

## Routes

| Route | Screen |
|---|---|
| `/` | Main dashboard (map + cards + charts) |
| `/country/:iso2` | Same dashboard with a country selected (shareable URL) |
| `*` | 404 page |

## API contract

The frontend is a read-only consumer of the backend REST API (`VITE_API_URL`). Types are in `src/shared/api/types.ts` and queries in `src/shared/api/queries.ts`.

| Usage | Endpoint | Response |
|---|---|---|
| Global cards and comparison | `GET /global` | `GlobalStats` |
| Map markers (all countries) | `GET /countries` | `{ countries: CountrySummary[] }` |
| Country detail | `GET /countries/:iso2` | `Country` |
| Country history (charts) | `GET /countries/:iso2/history?days=30` | `{ iso2, history: HistoryPoint[] }` |
| Global history | `GET /global/history?days=30` | `{ history: HistoryPoint[] }` |

`HistoryPoint` is `{ date, cases, deaths, newCases, newDeaths }`, where `cases` and `deaths` are cumulative. `days` ranges from 1 to 365.

Errors follow `{ "error": { "code", "requestId" } }` with stable codes: `VALIDATION_ERROR`, `COUNTRY_NOT_FOUND`, `RATE_LIMITED`, `UPSTREAM_UNAVAILABLE`, `INTERNAL_ERROR`. Network failures become the local code `NETWORK_ERROR`. Each code is translated through the `errors.<CODE>` i18n keys.

The backend sends `Cache-Control: public, max-age=300`, and TanStack Query uses a matching 5-minute `staleTime`.

## Conventions and standards

- **Everything in English**: code, identifiers, file and folder names, routes, query params, JSON fields, i18n keys, comments, test names, branches and commits.
- **Conventional Commits**, e.g. `feat: add country marker popup`, `fix: handle null cases per million`.
- **Branching**: feature branches (`feat/...`) are merged into `develop` through pull requests; `main` holds stable releases.
- **No UI text in components**: every string comes from the translation files.
- **Locale-aware formatting**: numbers, dates and units use `Intl` with the active language (`1,092,230` in `en`, `1.092.230` in `pt-BR`). Country names are localized with `Intl.DisplayNames` from the `iso2` code.
- **Design tokens**: colors and spacing are CSS variables, never hard-coded in components. Metrics are always labeled, never distinguished by color alone.
- **Strict TypeScript**, ESLint and Prettier (single quotes, semicolons, trailing commas, 100 columns) enforced in CI.
- **Nullable data is handled in the UI**: `casesPerMillion`, `deathsPerMillion`, `population` and `updatedAt` may be `null` and render as "—".

## Internationalization

- Supported languages: `en` (default) and `pt-BR`.
- On the first visit the app follows the browser language if it is Portuguese, otherwise English.
- The language switcher in the header saves the choice in `localStorage`.
- Translation files: `src/shared/i18n/en.json` and `src/shared/i18n/pt-BR.json`. When adding a string, add the key to **both** files.

## Theming

- Light and dark themes through color tokens defined as CSS variables and a `dark` class.
- Default follows the system preference; the header toggle overrides it and the choice is saved.
- Map tiles and charts switch theme together with the rest of the interface.
- A single purple accent color plus a sequential intensity scale for the map; cases use the accent and deaths use a soft red.

## Accessibility

- AA contrast in both themes and visible focus states.
- A sortable countries table as a text alternative to the map.
- `prefers-reduced-motion` is respected.
- Metrics are labeled, not conveyed by color alone.

## Testing

```bash
npm test            # run once
npm run test:watch  # watch mode
```

The suite uses Vitest with jsdom and Testing Library. It covers formatting and history helpers, the marker radius scale, stat cards, charts, the countries table, the cached-data notice, and dashboard page and integration flows against an API mock (`src/test/mock-api.ts`).

## Continuous integration

GitHub Actions ([.github/workflows/ci.yaml](.github/workflows/ci.yaml)) runs on pushes and pull requests to `main` and `develop`:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm test`
5. `npm run build`

## Known limitations

- **Data ends on 2023-03-09.** The upstream source is frozen and the backend has no scheduled refresh. "Today" in the cards and the period selector means the **last available day**, and history ranges end on that day. An informative notice about this is always shown.
- **`recovered` and `active` are not displayed.** The data source does not provide them (the API returns `null`), so there are no cards, map options or chart series for these metrics.
- The country list endpoint is lightweight: it does not include `iso3`, `population` or `updatedAt`, which are only available in the country detail.

## License

Distributed under the [MIT License](LICENSE).
