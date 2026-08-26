<script lang="ts">
	import AddToPlanModal from '$lib/components/AddToPlanModal.svelte';
	import { favorites } from '$lib/state/favorites.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	function goBack() {
		if (history.state && history.length > 1) {
			history.back();
		} else {
			goto(resolve('/'));
		}
	}

	let { data } = $props();
	let recipe = $derived(data.recipe);

	let instructionSteps = $derived(
		recipe.instructions
			.split(/\r?\n/)
			.map((step) => step.trim())
			.filter(Boolean)
	);

	let planningRecipe = $state<{ id: string; title: string; image: string } | null>(null);
</script>

<button class="back-link" onclick={goBack}>&larr; Back</button>

<article>
	<img src={recipe.image} alt={recipe.title} class="hero" />

	<div class="header">
		<h1>{recipe.title}</h1>
		<div class="header-actions">
			<button onclick={() => (planningRecipe = recipe)}>Add to meal plan</button>
			<button
				class="fav-toggle"
				class:active={favorites.isFavorite(recipe.id)}
				aria-label={favorites.isFavorite(recipe.id) ? 'Remove from favorites' : 'Add to favorites'}
				onclick={() => favorites.toggle(recipe.id)}
			>
				{favorites.isFavorite(recipe.id) ? '♥' : '♡'}
			</button>
		</div>
	</div>

	<div class="meta">
		{#if recipe.category}<span class="badge badge-category">{recipe.category}</span>{/if}
		{#if recipe.area}<span class="badge badge-area">{recipe.area}</span>{/if}
		{#each recipe.tags ?? [] as tag, i (i)}
			<span class="badge badge-tag">{tag}</span>
		{/each}
	</div>

	{#if recipe.youtube}
		<p><a href={recipe.youtube} target="_blank" rel="noreferrer">Watch on YouTube</a></p>
	{/if}

	<h2>Ingredients</h2>
	<table>
		<tbody>
			{#each recipe.ingredients as ingredient, i (i)}
				<tr>
					<td>{ingredient.name}</td>
					<td class="measure">{ingredient.measure}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<h2>Instructions</h2>
	<ol class="steps">
		{#each instructionSteps as step, i (i)}
			<li><span class="step-number">{i + 1}</span><span>{step}</span></li>
		{/each}
	</ol>
</article>

<AddToPlanModal recipe={planningRecipe} onclose={() => (planningRecipe = null)} />

<style>
	.back-link {
		background: transparent;
		color: var(--color-text-muted);
		padding: 6px 0;
		margin-bottom: 16px;
	}

	.back-link:hover {
		background: transparent;
		color: var(--color-primary-dark);
	}

	article {
		max-width: 760px;
		margin: 0 auto;
		background: var(--color-surface);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		padding: 32px;
	}

	.hero {
		width: 100%;
		height: 300px;
		object-fit: cover;
		border-radius: var(--radius-md);
		display: block;
		margin: -32px -32px 0;
		width: calc(100% + 64px);
	}

	.header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		margin-top: 24px;
	}

	.header h1 {
		font-size: 2rem;
		margin: 0;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
	}

	.fav-toggle {
		flex-shrink: 0;
		background: var(--color-surface-alt);
		width: 44px;
		height: 44px;
		border-radius: 50%;
		padding: 0;
		font-size: 1.4rem;
		color: var(--color-accent);
		line-height: 1;
	}

	.fav-toggle:hover {
		background: var(--color-surface-alt);
		filter: brightness(0.95);
	}

	.fav-toggle.active {
		background: var(--color-accent);
		color: #ffffff;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: 16px 0 20px;
	}

	.badge {
		border-radius: 999px;
		padding: 5px 16px;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.badge-category {
		background: var(--color-primary-light);
		color: var(--color-primary-dark);
	}

	.badge-area {
		background: #fbe9df;
		color: var(--color-accent);
	}

	.badge-tag {
		background: var(--color-surface-alt);
		color: var(--color-text-muted);
	}

	h2 {
		font-size: 1.3rem;
		margin-top: 36px;
		padding-bottom: 8px;
		border-bottom: 2px solid var(--color-surface-alt);
	}

	table {
		width: 100%;
		table-layout: fixed;
		border-collapse: collapse;
		margin-bottom: 8px;
	}

	td {
		padding: 12px 4px;
		border-bottom: 1px solid var(--color-surface-alt);
		font-size: 1rem;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.measure {
		text-align: right;
		color: var(--color-text-muted);
	}

	.steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.steps li {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		font-size: 1.02rem;
	}

	.step-number {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--color-primary-light);
		color: var(--color-primary-dark);
		font-weight: 600;
		font-size: 0.85rem;
	}
</style>
