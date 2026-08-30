<script lang="ts">
	import RcSearchBar from '$lib/components/stencil/RcSearchBar.svelte';
	import RcFilterChip from '$lib/components/stencil/RcFilterChip.svelte';
	import RcRecipeCard from '$lib/components/stencil/RcRecipeCard.svelte';
	import RcEmptyState from '$lib/components/stencil/RcEmptyState.svelte';
	import AddToPlanModal from '$lib/components/AddToPlanModal.svelte';
	import { favorites } from '$lib/state/favorites.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { untrack } from 'svelte';

	const PAGE_SIZE = 12;

	let { data } = $props();
	let planningRecipe = $state<{ id: string; title: string; image: string } | null>(null);

	let searchValue = $state(untrack(() => data.query));
	let shown = $state(PAGE_SIZE);

	const activeCategory = $derived(data.query ? '' : data.category || 'All');
	const visibleResults = $derived(data.results.slice(0, shown));

	function updateUrl(params: { q?: string; category?: string }) {
		const search = new SvelteURLSearchParams();
		if (params.q) search.set('q', params.q);
		if (params.category) search.set('category', params.category);
		const qs = search.toString();
		goto(resolve(qs ? `/?${qs}` : '/'), {
			keepFocus: true,
			noScroll: true,
			replaceState: true
		});
	}

	function handleSearchChange(value: string) {
		searchValue = value;
		shown = PAGE_SIZE;
		updateUrl({ q: value.trim() || undefined });
	}

	function handleChipToggle(detail: { label: string; active: boolean }) {
		searchValue = '';
		shown = PAGE_SIZE;
		const category = detail.active && detail.label !== 'All' ? detail.label : undefined;
		updateUrl({ category });
	}

	function handleSelect(id: string) {
		goto(resolve('/recipes/[id]', { id }));
	}
</script>

<section class="hero">
	<h1>Find your next recipe</h1>
	<p class="subtitle">Browse recipes below, search by name, or filter by category.</p>

	<div class="toolbar">
		<RcSearchBar
			value={searchValue}
			placeholder="Search recipes..."
			onsearchchange={handleSearchChange}
		/>

		<div class="chips">
			{#each data.categories as category (category)}
				<RcFilterChip
					label={category}
					active={activeCategory === category}
					onchiptoggle={handleChipToggle}
				/>
			{/each}
		</div>
	</div>
</section>

{#if data.status === 'error'}
	<RcEmptyState
		heading="Something went wrong"
		message="Could not reach TheMealDB. Please try again."
	/>
{:else if data.results.length === 0}
	<RcEmptyState heading="No recipes found" message="Try a different search term or category." />
{:else}
	<div class="grid">
		{#each visibleResults as recipe (recipe.id)}
			<div class="card-wrap">
				<RcRecipeCard
					{recipe}
					isFavorite={favorites.isFavorite(recipe.id)}
					onselect={handleSelect}
					onfavorite={(id) => favorites.toggle(id)}
				/>
				<button class="btn-secondary" onclick={() => (planningRecipe = recipe)}>
					Add to planner
				</button>
			</div>
		{/each}
	</div>

	{#if data.results.length > shown}
		<div class="load-more">
			<button class="btn-secondary" onclick={() => (shown += PAGE_SIZE)}>Load more</button>
		</div>
	{/if}
{/if}

<AddToPlanModal recipe={planningRecipe} onclose={() => (planningRecipe = null)} />

<style>
	.hero {
		background: linear-gradient(
			135deg,
			var(--color-surface) 0%,
			var(--color-surface) 55%,
			var(--color-surface-alt) 100%
		);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		padding: 32px;
		margin-bottom: 32px;
	}

	.hero h1 {
		font-size: 2rem;
		margin: 0 0 8px;
	}

	.subtitle {
		color: var(--color-text-muted);
		margin: 0 0 24px;
	}

	.toolbar {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 20px;
	}

	.card-wrap {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.card-wrap button {
		margin-top: auto;
	}

	.load-more {
		display: flex;
		justify-content: center;
		margin-top: 24px;
	}
</style>
