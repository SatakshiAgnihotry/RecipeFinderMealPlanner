import type { PageLoad } from './$types';
import { getCategories, searchRecipes, filterByCategory } from '$lib/api/mealdb';
import type { RecipeSummary } from '$lib/types';

export const load: PageLoad = async ({ url }) => {
	const categories = await getCategories();
	const query = url.searchParams.get('q') ?? '';
	const category = url.searchParams.get('category') ?? '';

	let results: RecipeSummary[] = [];
	let status: 'idle' | 'error' = 'idle';

	try {
		if (query) {
			results = await searchRecipes(query);
		} else if (category) {
			results = await filterByCategory(category);
		}
	} catch {
		status = 'error';
	}

	return { categories, query, category, results, status };
};
