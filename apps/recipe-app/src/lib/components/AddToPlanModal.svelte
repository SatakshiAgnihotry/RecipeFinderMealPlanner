<script lang="ts">
	import RcModal from './stencil/RcModal.svelte';
	import { mealPlan } from '$lib/state/mealPlan.svelte';
	import type { Day, MealType } from '$lib/types';

	let {
		recipe,
		onclose
	}: {
		recipe: { id: string; title: string; image: string } | null;
		onclose: () => void;
	} = $props();

	let selectedDay = $state<Day>('Monday');
	let selectedMealType = $state<MealType>('breakfast');

	function addToPlan() {
		if (!recipe) return;
		mealPlan.setMeal(selectedDay, selectedMealType, {
			recipeId: recipe.id,
			title: recipe.title,
			image: recipe.image
		});
		onclose();
	}
</script>

<RcModal open={recipe !== null} heading="Add to meal plan" onmodalclose={onclose}>
	<label>
		Day
		<select bind:value={selectedDay}>
			{#each mealPlan.days as day (day)}
				<option value={day}>{day}</option>
			{/each}
		</select>
	</label>
	<label>
		Meal
		<select bind:value={selectedMealType}>
			{#each mealPlan.mealTypes as mealType (mealType)}
				<option value={mealType}>{mealType}</option>
			{/each}
		</select>
	</label>
	{#snippet footer()}
		<button onclick={addToPlan}>Add</button>
	{/snippet}
</RcModal>

<style>
	label {
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-weight: 600;
		margin-bottom: 12px;
	}
</style>
