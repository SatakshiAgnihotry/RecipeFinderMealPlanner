<script lang="ts">
	import RcRecipeCard from '$lib/components/stencil/RcRecipeCard.svelte';
	import RcEmptyState from '$lib/components/stencil/RcEmptyState.svelte';
	import { favorites } from '$lib/state/favorites.svelte';
	import { resolveRecipe } from '$lib/recipes';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Recipe } from '$lib/types';

	let recipes = $state<Recipe[]>([]);
	let status = $state<'loading' | 'ready' | 'error'>('loading');

	$effect(() => {
		const ids = favorites.ids;
		status = 'loading';
		Promise.all(ids.map((id) => resolveRecipe(id)))
			.then((results) => {
				recipes = results.filter((recipe): recipe is Recipe => recipe !== null);
				status = 'ready';
			})
			.catch(() => {
				status = 'error';
			});
	});

	function handleSelect(id: string) {
		goto(resolve('/recipes/[id]', { id }));
	}
</script>

<h1>Favorites</h1>

{#if status === 'loading'}
	<p class="muted">Loading...</p>
{:else if status === 'error'}
	<RcEmptyState
		heading="Something went wrong"
		message="Could not load your favorites. Please try again."
	/>
{:else if recipes.length === 0}
	<RcEmptyState heading="No favorites yet" message="Recipes you favorite will show up here.">
		<button onclick={() => goto(resolve('/'))}>Browse recipes</button>
	</RcEmptyState>
{:else}
	<div class="grid">
		{#each recipes as recipe (recipe.id)}
			<RcRecipeCard
				{recipe}
				isFavorite={true}
				onselect={handleSelect}
				onfavorite={(id) => favorites.toggle(id)}
			/>
		{/each}
	</div>
{/if}

<style>
	h1 {
		font-size: 1.8rem;
		margin-bottom: 24px;
	}

	.muted {
		color: var(--color-text-muted);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 20px;
	}
</style>
