<script lang="ts">
	import RecipeForm from '$lib/components/RecipeForm.svelte';
	import { myRecipes } from '$lib/state/myRecipes.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { RecipeInput } from '$lib/types';

	function handleSubmit(input: RecipeInput) {
		myRecipes.add(input);
		goto(resolve('/my-recipes'));
	}
</script>

<a class="back-link" href={resolve('/my-recipes')}>&larr; Back to my recipes</a>
<h1>Add a recipe</h1>
<RecipeForm onsubmit={handleSubmit} submitLabel="Create recipe" />

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
