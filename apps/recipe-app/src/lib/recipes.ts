import { getRecipeById } from './api/mealdb';
import { myRecipes } from './state/myRecipes.svelte';
import type { Recipe } from './types';

export function resolveRecipe(id: string): Promise<Recipe | null> {
	if (id.startsWith('user-')) {
		return Promise.resolve(myRecipes.getById(id) ?? null);
	}
	return getRecipeById(id);
}
