# Recipe Finder & Meal Planner

A recipe discovery and weekly meal-planning app. It lets users discover recipes from a
public recipe API, view detailed recipe information, maintain a list of favorite
recipes, and organize recipes into a weekly meal plan. It's built as two projects
working together:

- **`packages/recipe-ui`** — a StencilJS component library, compiled to
  framework-independent Web Components and published to npm.
- **`apps/recipe-app`** — a SvelteKit (Svelte 5) application that installs
  the published npm package and uses its components as real, working parts
  of the app (not a demo page).

## Table of Contents

- [Links](#links)
- [Quick Start](#quick-start)
- [Features](#features)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Setup](#setup)
- [Starting the dev server](#starting-the-dev-server)
- [Project structure](#project-structure)
- [Assumptions & design decisions](#assumptions--design-decisions)

## Links

- **npm package**: https://www.npmjs.com/package/@satakshiagnihotri/recipe-ui
- **GitHub repository**: https://github.com/SatakshiAgnihotry/RecipeFinderMealPlanner/
- **Deployed app**: https://recipe-finder-meal-planner-teal.vercel.app/
- **Video Recording Link**:

## Quick Start

- [ ] Install **Node 22.13+**
- [ ] Clone the repo and `cd RecipeFinderMealPlanner`
- [ ] `cd packages/recipe-ui && npm install`
- [ ] `cd ../../apps/recipe-app && npm install`
- [ ] `npm run dev`
- [ ] Open http://localhost:5173

## Features

| Requirement | Status |
|---|---|
| Recipe discovery — search, browse, filter | ✅ |
| Recipe details page (ingredients + instructions) | ✅ |
| Recipe management — add / edit / delete / validate | ✅ |
| Favorites — add / remove / view | ✅ |
| Weekly meal planner — assign / modify / remove | ✅ |
| StencilJS component library published to npm | ✅ |
| App consumes the published package (not source) | ✅ |
| Props, custom events, and slots across the Stencil↔Svelte boundary | ✅ |

## Architecture

```
packages/recipe-ui   (StencilJS)
  Writes: <rc-recipe-card>, <rc-search-bar>, <rc-modal>, ...
  Compiles to plain Web Components (framework-independent)
        |  npm publish
        v
  npm registry: @satakshiagnihotri/recipe-ui@x.y.z
        |  npm install
        v
apps/recipe-app   (SvelteKit + Svelte 5)
  Routes, state, API calls, business logic
  Renders <rc-recipe-card> via thin Svelte wrappers
        |  fetch()
        v
  TheMealDB API
```

## Tech stack

- **StencilJS** — Web Components / custom elements, Shadow DOM
- **Svelte 5 + SvelteKit** — routing, `load` functions, runes-based state
- **TypeScript** — both projects
- **TheMealDB** — free, no-API-key recipe data
- **localStorage** — all persistence (favorites, user recipes, meal plan)
- **Vercel** — deployment

## Setup

Requires **Node 22.13+** (the Stencil library and ESLint 10 both need it).

```bash
git clone https://github.com/SatakshiAgnihotry/RecipeFinderMealPlanner.git
cd RecipeFinderMealPlanner
```

Install both packages:

```bash
cd packages/recipe-ui && npm install
cd ../../apps/recipe-app && npm install
```

The app consumes the **published** npm package
(`@satakshiagnihotri/recipe-ui`), not the local Stencil source — installing
`apps/recipe-app`'s dependencies pulls it straight from the registry.

## Starting the dev server

The app alone is enough to run the full experience:

```bash
cd apps/recipe-app
npm run dev
```

To also work on the component library itself (Stencil's own isolated
preview, not part of the app):

```bash
cd packages/recipe-ui
npm start
```

## Project structure

```
recipe-planner/
├── packages/
│   └── recipe-ui/                 StencilJS component library
│       └── src/components/
│           ├── rc-recipe-card/
│           ├── rc-search-bar/
│           ├── rc-filter-chip/
│           ├── rc-modal/
│           └── rc-empty-state/
│
└── apps/
    └── recipe-app/                SvelteKit (Svelte 5) application
        └── src/
            ├── lib/
            │   ├── api/mealdb.ts
            │   ├── state/
            │   ├── components/
            │   │   ├── stencil/
            │   │   ├── RecipeForm.svelte
            │   │   └── AddToPlanModal.svelte
            │   ├── types.ts
            │   ├── validation.ts
            │   └── recipes.ts
            └── routes/
                ├── +page.svelte
                ├── recipes/[id]/
                ├── favorites/
                ├── my-recipes/
                └── planner/
```

| Path | What it is |
|---|---|
| `lib/api/mealdb.ts` | TheMealDB API client |
| `lib/state/` | Shared reactive state (`.svelte.ts` + runes, no store library) |
| `lib/components/stencil/` | Thin Svelte wrappers around each published Stencil component — the framework integration seam (see Assumptions below) |
| `routes/+page.svelte` | Discover (`/`) |
| `routes/recipes/[id]/` | Recipe details |
| `routes/favorites/` | Favorites |
| `routes/my-recipes/` | My Recipes (`+new`, `[id]/edit`) |
| `routes/planner/` | Weekly meal planner |

## Assumptions & design decisions

- **No backend, no auth** — everything (favorites, user-created recipes,
  the meal plan) lives in `localStorage`, per browser. There's no server
  database and no login.
- **TheMealDB free tier** — no API key, and occasionally slow/rate-limited
  since it's a shared public service. A navigation progress indicator
  (`+layout.svelte`, driven by `$app/state`'s `navigating`) makes slow
  requests visible instead of looking like a broken click.
- **Search and category-filter are mutually exclusive** on the Discover
  page — picking one clears the other.
- **User-created recipe ids are prefixed `user-`**, distinguishing them
  from TheMealDB's numeric ids everywhere an id is handled generically
  (favorites, meal plan, the shared `/recipes/[id]` route).
