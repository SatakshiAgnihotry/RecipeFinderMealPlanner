<script lang="ts">
	import { untrack } from 'svelte';
	import { validateRecipe } from '$lib/validation';
	import type { Recipe, RecipeInput } from '$lib/types';

	let {
		initial = null,
		onsubmit,
		submitLabel = 'Save recipe'
	}: {
		initial?: Recipe | null;
		onsubmit: (input: RecipeInput) => void;
		submitLabel?: string;
	} = $props();

	let title = $state(untrack(() => initial?.title ?? ''));
	let category = $state(untrack(() => initial?.category ?? ''));
	let servings = $state<number | null>(untrack(() => initial?.servings ?? null));
	let image = $state(untrack(() => initial?.image ?? ''));
	let instructions = $state(untrack(() => initial?.instructions ?? ''));

	let nextIngredientId = 0;
	function makeIngredientId() {
		nextIngredientId += 1;
		return nextIngredientId;
	}

	let ingredients = $state(
		untrack(() =>
			initial && initial.ingredients.length > 0
				? initial.ingredients.map((ingredient) => ({
						id: makeIngredientId(),
						name: ingredient.name,
						measure: ingredient.measure
					}))
				: [{ id: makeIngredientId(), name: '', measure: '' }]
		)
	);

	let touched = $state<Record<string, boolean>>({});

	let formInput = $derived({
		title,
		category,
		servings,
		image,
		instructions,
		ingredients: ingredients.map(({ name, measure }) => ({ name, measure }))
	} satisfies RecipeInput);

	let errors = $derived(validateRecipe(formInput));

	function markTouched(field: string) {
		touched[field] = true;
	}

	function addIngredient() {
		ingredients = [...ingredients, { id: makeIngredientId(), name: '', measure: '' }];
	}

	function removeIngredient(id: number) {
		if (ingredients.length === 1) return;
		ingredients = ingredients.filter((ingredient) => ingredient.id !== id);
	}

	function handleServingsInput(e: Event & { currentTarget: HTMLInputElement }) {
		servings = e.currentTarget.value ? Number(e.currentTarget.value) : null;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		touched = {
			title: true,
			category: true,
			servings: true,
			instructions: true,
			ingredients: true,
			image: true
		};
		if (Object.keys(errors).length > 0) return;
		onsubmit(formInput);
	}
</script>

<form onsubmit={handleSubmit}>
	<label>
		Title
		<input type="text" bind:value={title} onblur={() => markTouched('title')} />
	</label>
	{#if touched.title && errors.title}<p class="error">{errors.title}</p>{/if}

	<label>
		Category
		<input type="text" bind:value={category} onblur={() => markTouched('category')} />
	</label>
	{#if touched.category && errors.category}<p class="error">{errors.category}</p>{/if}

	<label>
		Servings
		<input
			type="number"
			min="1"
			value={servings ?? ''}
			oninput={handleServingsInput}
			onblur={() => markTouched('servings')}
		/>
	</label>
	{#if touched.servings && errors.servings}<p class="error">{errors.servings}</p>{/if}

	<label>
		Image URL (optional)
		<input type="text" bind:value={image} onblur={() => markTouched('image')} />
	</label>
	{#if touched.image && errors.image}<p class="error">{errors.image}</p>{/if}

	<label>
		Instructions
		<textarea rows="6" bind:value={instructions} onblur={() => markTouched('instructions')}
		></textarea>
	</label>
	{#if touched.instructions && errors.instructions}<p class="error">{errors.instructions}</p>{/if}

	<h3>Ingredients</h3>
	{#each ingredients as ingredient (ingredient.id)}
		<div class="ingredient-row">
			<input
				type="text"
				placeholder="Name"
				bind:value={ingredient.name}
				onblur={() => markTouched('ingredients')}
			/>
			<input type="text" placeholder="Measure" bind:value={ingredient.measure} />
			<button
				type="button"
				class="btn-secondary"
				onclick={() => removeIngredient(ingredient.id)}
				disabled={ingredients.length === 1}
			>
				Remove
			</button>
		</div>
	{/each}
	<button type="button" class="btn-secondary add-ingredient" onclick={addIngredient}>
		+ Add ingredient
	</button>
	{#if touched.ingredients && errors.ingredients}<p class="error">{errors.ingredients}</p>{/if}

	<button type="submit" class="submit-btn">{submitLabel}</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 16px;
		max-width: 600px;
		background: var(--color-surface);
		padding: 28px;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--color-text-muted);
	}

	h3 {
		font-family: var(--font-heading);
		margin: 8px 0 0;
	}

	.ingredient-row {
		display: flex;
		gap: 8px;
	}

	.ingredient-row input {
		flex: 1;
	}

	.add-ingredient {
		align-self: flex-start;
	}

	.submit-btn {
		align-self: flex-start;
		margin-top: 8px;
	}

	.error {
		color: var(--color-danger);
		margin: 0;
		font-size: 0.85rem;
	}
</style>
