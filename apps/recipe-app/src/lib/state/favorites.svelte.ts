import { browser } from '$app/environment';

const STORAGE_KEY = 'recipe-planner:favorites';

function loadInitial(): string[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

class FavoritesStore {
	ids = $state<string[]>(loadInitial());

	get count() {
		return this.ids.length;
	}

	isFavorite(id: string) {
		return this.ids.includes(id);
	}

	toggle(id: string) {
		if (this.ids.includes(id)) {
			this.ids = this.ids.filter((existing) => existing !== id);
		} else {
			this.ids = [...this.ids, id];
		}
		this.persist();
	}

	private persist() {
		if (!browser) return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(this.ids));
	}
}

export const favorites = new FavoritesStore();
