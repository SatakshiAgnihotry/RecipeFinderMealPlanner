<script lang="ts">
	import RcRecipeCard from '$lib/components/stencil/RcRecipeCard.svelte';
	import RcEmptyState from '$lib/components/stencil/RcEmptyState.svelte';
	import RcModal from '$lib/components/stencil/RcModal.svelte';
	import AddToPlanModal from '$lib/components/AddToPlanModal.svelte';
	import { myRecipes } from '$lib/state/myRecipes.svelte';
	import { favorites } from '$lib/state/favorites.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let confirmDeleteId = $state<string | null>(null);
	let planningRecipe = $state<{ id: string; title: string; image: string } | null>(null);

	function handleSelect(id: string) {
		goto(resolve('/recipes/[id]', { id }));
	}

	function confirmDelete() {
		if (confirmDeleteId) {
			myRecipes.remove(confirmDeleteId);
		}
		confirmDeleteId = null;
	}
</script>

<div class="header-row">
	<h1>My Recipes</h1>
	<button onclick={() => goto(resolve('/my-recipes/new'))}>Add recipe</button>
</div>

{#if myRecipes.recipes.length === 0}
	<RcEmptyState heading="No recipes yet" message="Create your first recipe to see it here." />
{:else}
	<div class="grid">
		{#each myRecipes.recipes as recipe (recipe.id)}
			<div class="card-wrap">
				<RcRecipeCard
					{recipe}
					isFavorite={favorites.isFavorite(recipe.id)}
					onselect={handleSelect}
					onfavorite={(id) => favorites.toggle(id)}
				/>
				<div class="actions">
					<button
						class="btn-secondary"
						onclick={() => goto(resolve('/my-recipes/[id]/edit', { id: recipe.id }))}
					>
						Edit
					</button>
					<button class="btn-danger" onclick={() => (confirmDeleteId = recipe.id)}>Delete</button>
				</div>
				<button class="btn-secondary" onclick={() => (planningRecipe = recipe)}>
					Add to planner
				</button>
			</div>
		{/each}
	</div>
{/if}

<RcModal
	open={confirmDeleteId !== null}
	heading="Delete recipe?"
	onmodalclose={() => (confirmDeleteId = null)}
>
	<p>This action cannot be undone.</p>
	{#snippet footer()}
		<button class="btn-secondary" onclick={() => (confirmDeleteId = null)}>Cancel</button>
		<button class="btn-danger" onclick={confirmDelete}>Delete</button>
	{/snippet}
</RcModal>

<AddToPlanModal recipe={planningRecipe} onclose={() => (planningRecipe = null)} />

<style>
	.header-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24px;
	}

	.header-row h1 {
		font-size: 1.8rem;
		margin: 0;
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

	.actions {
		display: flex;
		gap: 8px;
		margin-top: auto;
	}
</style>
