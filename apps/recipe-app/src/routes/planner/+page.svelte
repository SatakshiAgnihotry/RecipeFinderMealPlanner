<script lang="ts">
	import RcModal from '$lib/components/stencil/RcModal.svelte';
	import RcSearchBar from '$lib/components/stencil/RcSearchBar.svelte';
	import { mealPlan } from '$lib/state/mealPlan.svelte';
	import { favorites } from '$lib/state/favorites.svelte';
	import { myRecipes } from '$lib/state/myRecipes.svelte';
	import { searchRecipes } from '$lib/api/mealdb';
	import { resolveRecipe } from '$lib/recipes';
	import type { Day, MealType, RecipeSummary } from '$lib/types';

	let pickerTarget = $state<{ day: Day; mealType: MealType } | null>(null);
	let searchResults = $state<RecipeSummary[]>([]);
	let favoriteRecipes = $state<RecipeSummary[]>([]);
	let confirmClear = $state(false);

	$effect(() => {
		if (!pickerTarget) return;
		const ids = favorites.ids;
		Promise.all(ids.map((id) => resolveRecipe(id))).then((results) => {
			favoriteRecipes = results.filter(
				(recipe): recipe is NonNullable<typeof recipe> => recipe !== null
			);
		});
	});

	async function handleSearch(value: string) {
		if (!value.trim()) {
			searchResults = [];
			return;
		}
		searchResults = await searchRecipes(value.trim());
	}

	function openPicker(day: Day, mealType: MealType) {
		pickerTarget = { day, mealType };
		searchResults = [];
	}

	function closePicker() {
		pickerTarget = null;
	}

	function pick(recipe: RecipeSummary) {
		if (!pickerTarget) return;
		mealPlan.setMeal(pickerTarget.day, pickerTarget.mealType, {
			recipeId: recipe.id,
			title: recipe.title,
			image: recipe.image
		});
		closePicker();
	}
</script>

<div class="header-row">
	<h1>Weekly meal plan</h1>
	<button class="btn-danger" onclick={() => (confirmClear = true)}>Clear week</button>
</div>

<div class="planner-grid">
	{#each mealPlan.days as day (day)}
		<div class="day-column">
			<h2>{day}</h2>
			{#each mealPlan.mealTypes as mealType (mealType)}
				{@const meal = mealPlan.plan[day][mealType]}
				<div class="cell">
					<span class="meal-type">{mealType}</span>
					{#if meal}
						<div class="planned-meal">
							<img src={meal.image} alt={meal.title} />
							<span>{meal.title}</span>
							<div class="cell-actions">
								<button class="btn-secondary" onclick={() => openPicker(day, mealType)}>
									Change
								</button>
								<button class="btn-danger" onclick={() => mealPlan.removeMeal(day, mealType)}>
									Remove
								</button>
							</div>
						</div>
					{:else}
						<button class="add-btn" onclick={() => openPicker(day, mealType)}>+ Add</button>
					{/if}
				</div>
			{/each}
		</div>
	{/each}
</div>

<RcModal open={pickerTarget !== null} heading="Choose a recipe" onmodalclose={closePicker}>
	<RcSearchBar placeholder="Search recipes..." onsearchchange={handleSearch} />

	{#if searchResults.length === 0 && favoriteRecipes.length === 0 && myRecipes.recipes.length === 0}
		<p class="hint">Search above, or add favorites and recipes of your own to pick from here.</p>
	{/if}

	{#if searchResults.length > 0}
		<h3>Search results</h3>
		<div class="picker-list">
			{#each searchResults as recipe (recipe.id)}
				<button class="picker-row" onclick={() => pick(recipe)}>
					<img src={recipe.image} alt={recipe.title} />
					<span>{recipe.title}</span>
				</button>
			{/each}
		</div>
	{/if}

	{#if favoriteRecipes.length > 0}
		<h3>Favorites</h3>
		<div class="picker-list">
			{#each favoriteRecipes as recipe (recipe.id)}
				<button class="picker-row" onclick={() => pick(recipe)}>
					<img src={recipe.image} alt={recipe.title} />
					<span>{recipe.title}</span>
				</button>
			{/each}
		</div>
	{/if}

	{#if myRecipes.recipes.length > 0}
		<h3>My recipes</h3>
		<div class="picker-list">
			{#each myRecipes.recipes as recipe (recipe.id)}
				<button class="picker-row" onclick={() => pick(recipe)}>
					<img src={recipe.image} alt={recipe.title} />
					<span>{recipe.title}</span>
				</button>
			{/each}
		</div>
	{/if}
</RcModal>

<RcModal
	open={confirmClear}
	heading="Clear the whole week?"
	onmodalclose={() => (confirmClear = false)}
>
	<p>This will remove every planned meal. This action cannot be undone.</p>
	{#snippet footer()}
		<button class="btn-secondary" onclick={() => (confirmClear = false)}>Cancel</button>
		<button
			class="btn-danger"
			onclick={() => {
				mealPlan.clearWeek();
				confirmClear = false;
			}}>Clear week</button
		>
	{/snippet}
</RcModal>

<style>
	.header-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	.planner-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 12px;
	}

	@media (max-width: 768px) {
		.planner-grid {
			grid-template-columns: 1fr;
		}
	}

	.day-column {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.day-column h2 {
		font-size: 1.25rem;
		text-align: center;
		margin: 0 0 8px;
	}

	.cell {
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		padding: 12px;
		height: 240px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.meal-type {
		font-size: 0.8rem;
		text-transform: uppercase;
		color: var(--color-primary);
		font-weight: 600;
	}

	.planned-meal {
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: 0.95rem;
		overflow: hidden;
	}

	.planned-meal img {
		width: 100%;
		height: 80px;
		object-fit: cover;
		border-radius: var(--radius-sm);
		flex-shrink: 0;
	}

	.planned-meal > span {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.cell-actions {
		display: flex;
		gap: 4px;
		margin-top: auto;
	}

	.cell-actions button {
		flex: 1;
		padding: 6px 8px;
		font-size: 0.85rem;
	}

	.add-btn {
		flex: 1;
		font-size: 0.95rem;
		border: 1px dashed var(--color-border);
		background: transparent;
		color: var(--color-text-muted);
		border-radius: var(--radius-sm);
		cursor: pointer;
	}

	.add-btn:hover {
		background: var(--color-surface-alt);
	}

	.picker-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-bottom: 12px;
		max-height: 160px;
		overflow-y: auto;
	}

	.picker-row {
		display: flex;
		align-items: center;
		gap: 8px;
		border: none;
		background: transparent;
		color: var(--color-text);
		padding: 4px;
		border-radius: var(--radius-sm);
		cursor: pointer;
		text-align: left;
	}

	.picker-row:hover {
		background: var(--color-surface-alt);
	}

	.picker-row img {
		width: 40px;
		height: 40px;
		object-fit: cover;
		border-radius: var(--radius-sm);
	}

	.hint {
		color: var(--color-text-muted);
		font-size: 0.9rem;
		margin: 4px 0 12px;
	}
</style>
