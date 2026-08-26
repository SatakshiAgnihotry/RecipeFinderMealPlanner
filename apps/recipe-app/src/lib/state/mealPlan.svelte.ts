import { browser } from '$app/environment';
import type { Day, MealType, MealPlan, PlannedMeal } from '$lib/types';

const STORAGE_KEY = 'recipe-planner:meal-plan';
const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner'];

function emptyPlan(): MealPlan {
	const plan = {} as MealPlan;
	for (const day of DAYS) {
		plan[day] = { breakfast: null, lunch: null, dinner: null };
	}
	return plan;
}

function loadInitial(): MealPlan {
	if (!browser) return emptyPlan();
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? { ...emptyPlan(), ...JSON.parse(raw) } : emptyPlan();
	} catch {
		return emptyPlan();
	}
}

class MealPlanStore {
	days = DAYS;
	mealTypes = MEAL_TYPES;
	plan = $state<MealPlan>(loadInitial());

	setMeal(day: Day, mealType: MealType, meal: PlannedMeal) {
		this.plan = { ...this.plan, [day]: { ...this.plan[day], [mealType]: meal } };
		this.persist();
	}

	removeMeal(day: Day, mealType: MealType) {
		this.plan = { ...this.plan, [day]: { ...this.plan[day], [mealType]: null } };
		this.persist();
	}

	clearWeek() {
		this.plan = emptyPlan();
		this.persist();
	}

	private persist() {
		if (!browser) return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(this.plan));
	}
}

export const mealPlan = new MealPlanStore();
