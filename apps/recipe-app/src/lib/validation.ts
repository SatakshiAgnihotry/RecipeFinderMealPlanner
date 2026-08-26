import type { RecipeInput } from './types';

export function validateRecipe(input: RecipeInput): Record<string, string> {
	const errors: Record<string, string> = {};

	const title = input.title.trim();
	if (!title) {
		errors.title = 'Title is required.';
	} else if (title.length < 3 || title.length > 80) {
		errors.title = 'Title must be between 3 and 80 characters.';
	}

	if (!input.category.trim()) {
		errors.category = 'Category is required.';
	}

	const hasIngredient = input.ingredients.some((ingredient) => ingredient.name.trim().length > 0);
	if (!hasIngredient) {
		errors.ingredients = 'Add at least one ingredient with a name.';
	}

	const instructions = input.instructions.trim();
	if (!instructions) {
		errors.instructions = 'Instructions are required.';
	} else if (instructions.length < 20) {
		errors.instructions = 'Instructions should be at least 20 characters.';
	}

	if (input.servings === null || !Number.isInteger(input.servings) || input.servings <= 0) {
		errors.servings = 'Servings must be a positive whole number.';
	}

	const image = input.image.trim();
	if (image) {
		try {
			new URL(image);
		} catch {
			errors.image = 'Image must be a valid URL.';
		}
	}

	return errors;
}
