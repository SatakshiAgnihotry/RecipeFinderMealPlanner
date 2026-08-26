<script lang="ts">
	import '@satakshiagnihotri/recipe-ui/dist/components/rc-recipe-card';
	import type { Snippet } from 'svelte';
	import type { RecipeSummary } from '$lib/types';

	let {
		recipe,
		isFavorite = false,
		onselect,
		onfavorite,
		children
	}: {
		recipe: RecipeSummary;
		isFavorite?: boolean;
		onselect?: (id: string) => void;
		onfavorite?: (id: string) => void;
		children?: Snippet;
	} = $props();

	let el: HTMLRcRecipeCardElement;

	$effect(() => {
		if (el) el.recipe = recipe;
	});

	$effect(() => {
		if (!el) return;
		const handleSelect = (e: Event) => onselect?.((e as CustomEvent<string>).detail);
		el.addEventListener('cardselect', handleSelect);
		return () => el.removeEventListener('cardselect', handleSelect);
	});

	$effect(() => {
		if (!el) return;
		const handleFavorite = (e: Event) => onfavorite?.((e as CustomEvent<string>).detail);
		el.addEventListener('favoritetoggle', handleFavorite);
		return () => el.removeEventListener('favoritetoggle', handleFavorite);
	});
</script>

<rc-recipe-card bind:this={el} is-favorite={isFavorite}>
	{@render children?.()}
</rc-recipe-card>
