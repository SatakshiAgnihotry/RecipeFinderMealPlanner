# Recipe Finder & Meal Planner

A recipe discovery and weekly meal-planning app has two projects working together:

- **`packages/recipe-ui`** — a StencilJS component library, compiled to
  framework-independent Web Components and published to npm.
- **`apps/recipe-app`** — a SvelteKit (Svelte 5) application that installs
  the published npm package and uses its components as real, working parts
  of the app (not a demo page).

## Links

- **npm package**: https://www.npmjs.com/package/@satakshiagnihotri/recipe-ui
- **GitHub repository**: https://github.com/SatakshiAgnihotry/RecipeFinderMealPlanner
- **Deployed app**: _added after Vercel deployment_

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
git clone <this-repo>
cd recipe-planner
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
packages/recipe-ui        StencilJS component library
  src/components/         rc-recipe-card, rc-search-bar, rc-filter-chip,
                           rc-modal, rc-empty-state
apps/recipe-app
  src/lib/api/mealdb.ts   TheMealDB API client
  src/lib/state/          Shared reactive state (.svelte.ts + runes),
                           no external store library
  src/lib/components/stencil/
                           Thin Svelte wrappers around each published
                           Stencil component (the framework integration
                           seam — see Assumptions below)
  src/routes/             Discover (/), recipe details (/recipes/[id]),
                           favorites, my-recipes (+new/+edit), planner
```

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
