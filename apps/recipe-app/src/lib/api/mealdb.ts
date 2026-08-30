import type { Recipe, RecipeSummary, Ingredient } from '$lib/types';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

interface MealDbMeal {
	idMeal: string;
	strMeal: string;
	strMealThumb: string;
	strCategory?: string;
	strArea?: string;
	strInstructions?: string;
	strTags?: string | null;
	strYoutube?: string;
	[key: string]: string | null | undefined;
}

interface MealDbListResponse {
	meals: MealDbMeal[] | null;
}

interface MealDbCategoryListResponse {
	meals: { strCategory: string }[] | null;
}

function toRecipeSummary(meal: MealDbMeal): RecipeSummary {
	return {
		id: meal.idMeal,
		title: meal.strMeal,
		image: meal.strMealThumb,
		category: meal.strCategory
	};
}

function toIngredients(meal: MealDbMeal): Ingredient[] {
	const ingredients: Ingredient[] = [];
	for (let i = 1; i <= 20; i++) {
		const name = meal[`strIngredient${i}`];
		const measure = meal[`strMeasure${i}`];
		if (name && name.trim()) {
			ingredients.push({ name: name.trim(), measure: (measure ?? '').trim() });
		}
	}
	return ingredients;
}

function toRecipe(meal: MealDbMeal): Recipe {
	return {
		...toRecipeSummary(meal),
		area: meal.strArea,
		instructions: meal.strInstructions ?? '',
		ingredients: toIngredients(meal),
		tags: meal.strTags
			? meal.strTags
					.split(',')
					.map((tag) => tag.trim())
					.filter(Boolean)
			: undefined,
		youtube: meal.strYoutube || undefined
	};
}

async function fetchSummaryList(url: string): Promise<RecipeSummary[]> {
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`TheMealDB request failed: ${res.status}`);
	}
	const data: MealDbListResponse = await res.json();
	return (data.meals ?? []).map(toRecipeSummary);
}

export function searchRecipes(query: string): Promise<RecipeSummary[]> {
	return fetchSummaryList(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
}

export function getAllRecipes(): Promise<RecipeSummary[]> {
	return fetchSummaryList(`${BASE_URL}/search.php?s=`);
}

export async function filterByCategory(category: string): Promise<RecipeSummary[]> {
	const summaries = await fetchSummaryList(
		`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
	);
	return summaries.map((summary) => ({ ...summary, category }));
}

export function filterByArea(area: string): Promise<RecipeSummary[]> {
	return fetchSummaryList(`${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`);
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
	const res = await fetch(`${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`);
	if (!res.ok) {
		throw new Error(`TheMealDB request failed: ${res.status}`);
	}
	const data: MealDbListResponse = await res.json();
	const meal = data.meals?.[0];
	return meal ? toRecipe(meal) : null;
}

export async function getCategories(): Promise<string[]> {
	const res = await fetch(`${BASE_URL}/list.php?c=list`);
	if (!res.ok) {
		throw new Error(`TheMealDB request failed: ${res.status}`);
	}
	const data: MealDbCategoryListResponse = await res.json();
	return (data.meals ?? []).map((meal) => meal.strCategory);
}
