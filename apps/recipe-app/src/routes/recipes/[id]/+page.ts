import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getRecipeById } from '$lib/api/mealdb';
import { myRecipes } from '$lib/state/myRecipes.svelte';

export const ssr = false;

export const load: PageLoad = async ({ params }) => {
	if (params.id.startsWith('user-')) {
		const recipe = myRecipes.getById(params.id);
		if (!recipe) {
			error(404, 'Recipe not found');
		}
		return { recipe };
	}

	const recipe = await getRecipeById(params.id);
	if (!recipe) {
		error(404, 'Recipe not found');
	}
	return { recipe };
};
