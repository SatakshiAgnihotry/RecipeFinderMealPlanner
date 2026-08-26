# @satakshiagnihotri/recipe-ui

Reusable Web Components UI library for the **Recipe Finder & Meal Planner**
app, built with [StencilJS](https://stenciljs.com). Framework-independent —
these are real Web Components, usable from any framework or plain HTML.

Part of the [recipe-planner](https://github.com/SatakshiAgnihotry/recipe-planner)
project, alongside a SvelteKit app that consumes this package.

## Install

```bash
npm install @satakshiagnihotri/recipe-ui
```

## Usage

Import each component individually (tree-shakeable, auto-registers itself
as a custom element on import):

```ts
import '@satakshiagnihotri/recipe-ui/dist/components/rc-recipe-card';
```

```html
<rc-recipe-card id="card" is-favorite="false"></rc-recipe-card>
<script type="module">
  document.getElementById('card').recipe = {
    id: '53278',
        title: 'Aubergine & hummus grills',
        image: 'https://www.themealdb.com/images/media/meals/zub3s91764110535.jpg',
        category: 'Vegetarian',
  };
</script>
```

**Object props must be set as a DOM property, not an HTML attribute** —
attributes are always strings, so `recipe="[object]"` will not work.
String/number/boolean props (e.g. `is-favorite`) can be set as plain
attributes.

TypeScript types (e.g. `RecipeSummary`) are exported from the package
root:

```ts
import type { RecipeSummary } from '@satakshiagnihotri/recipe-ui';
```

## Components

| Component | Props | Events | Slots |
|---|---|---|---|
| `rc-recipe-card` | `recipe: RecipeSummary`, `isFavorite: boolean` | `cardselect` → recipe id, `favoritetoggle` → recipe id | default (badge area) |
| `rc-search-bar` | `value: string`, `placeholder: string`, `debounce: number` | `searchchange` → string | `suffix` |
| `rc-filter-chip` | `label: string`, `active: boolean` | `chiptoggle` → `{ label, active }` | — |
| `rc-modal` | `open: boolean`, `heading: string` | `modalclose` | default, `footer` |
| `rc-empty-state` | `heading: string`, `message: string` | — | default (action button) |

## Development

```bash
npm install
npm start   # Stencil dev server with a live preview at src/index.html
npm run build
```
