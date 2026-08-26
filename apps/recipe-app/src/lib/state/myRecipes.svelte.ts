import { browser } from '$app/environment';
import type { Recipe, RecipeInput } from '$lib/types';
import { PLACEHOLDER_IMAGE } from '$lib/types';

const STORAGE_KEY = 'recipe-planner:my-recipes';

function loadInitial(): Recipe[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

function generateId(): string {
	return `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeIngredients(input: RecipeInput['ingredients']) {
	return input
		.filter((ingredient) => ingredient.name.trim())
		.map((ingredient) => ({ name: ingredient.name.trim(), measure: ingredient.measure.trim() }));
}

class MyRecipesStore {
	recipes = $state<Recipe[]>(loadInitial());

	getById(id: string): Recipe | undefined {
		return this.recipes.find((recipe) => recipe.id === id);
	}

	add(input: RecipeInput): Recipe {
		const recipe: Recipe = {
			id: generateId(),
			title: input.title.trim(),
			category: input.category.trim(),
			image: input.image.trim() || PLACEHOLDER_IMAGE,
			instructions: input.instructions.trim(),
			ingredients: normalizeIngredients(input.ingredients),
			servings: input.servings ?? undefined
		};
		this.recipes = [...this.recipes, recipe];
		this.persist();
		return recipe;
	}

	update(id: string, input: RecipeInput): void {
		this.recipes = this.recipes.map((recipe) =>
			recipe.id === id
				? {
						...recipe,
						title: input.title.trim(),
						category: input.category.trim(),
						image: input.image.trim() || PLACEHOLDER_IMAGE,
						instructions: input.instructions.trim(),
						ingredients: normalizeIngredients(input.ingredients),
						servings: input.servings ?? undefined
					}
				: recipe
		);
		this.persist();
	}

	remove(id: string): void {
		this.recipes = this.recipes.filter((recipe) => recipe.id !== id);
		this.persist();
	}

	private persist() {
		if (!browser) return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(this.recipes));
	}
}

export const myRecipes = new MyRecipesStore();
