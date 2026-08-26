<script lang="ts">
	import RecipeForm from '$lib/components/RecipeForm.svelte';
	import RcEmptyState from '$lib/components/stencil/RcEmptyState.svelte';
	import { myRecipes } from '$lib/state/myRecipes.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { RecipeInput } from '$lib/types';

	let recipe = $derived(myRecipes.getById(page.params.id ?? ''));

	function handleSubmit(input: RecipeInput) {
		if (!recipe) return;
		myRecipes.update(recipe.id, input);
		goto(resolve('/recipes/[id]', { id: recipe.id }));
	}
</script>

<a class="back-link" href={resolve('/my-recipes')}>&larr; Back to my recipes</a>

{#if recipe}
	<h1>Edit recipe</h1>
	{#key recipe.id}
		<RecipeForm initial={recipe} onsubmit={handleSubmit} submitLabel="Save changes" />
	{/key}
{:else}
	<RcEmptyState heading="Recipe not found" message="It may have been deleted already.">
		<button onclick={() => goto(resolve('/my-recipes'))}>Back to my recipes</button>
	</RcEmptyState>
{/if}

<style>
	.back-link {
		display: inline-block;
		margin-bottom: 16px;
	}

	h1 {
		font-size: 1.8rem;
		margin: 0 0 24px;
	}
</style>
