import type { RecipeSummary } from '@satakshiagnihotri/recipe-ui';

export type { RecipeSummary };

export interface Ingredient {
	name: string;
	measure: string;
}

export interface Recipe extends RecipeSummary {
	area?: string;
	instructions: string;
	ingredients: Ingredient[];
	tags?: string[];
	youtube?: string;
	servings?: number;
}

export interface RecipeInput {
	title: string;
	category: string;
	servings: number | null;
	image: string;
	instructions: string;
	ingredients: { name: string; measure: string }[];
}

export const PLACEHOLDER_IMAGE =
	'data:image/svg+xml;charset=UTF-8,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#e0ddd8"/><text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="#8a8580" text-anchor="middle" dominant-baseline="middle">No image</text></svg>'
	);

export type Day =
	'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface PlannedMeal {
	recipeId: string;
	title: string;
	image: string;
}

export type MealPlan = Record<Day, Record<MealType, PlannedMeal | null>>;
