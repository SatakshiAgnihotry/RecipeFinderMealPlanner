<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/global.css';
	import { navigating, page } from '$app/state';
	import { resolve } from '$app/paths';

	let { children } = $props();

	const links = [
		{ routeId: '/', href: resolve('/'), label: 'Discover' },
		{ routeId: '/favorites', href: resolve('/favorites'), label: 'Favorites' },
		{ routeId: '/my-recipes', href: resolve('/my-recipes'), label: 'My Recipes' },
		{ routeId: '/planner', href: resolve('/planner'), label: 'Planner' }
	] as const;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if navigating.to}
	<div class="nav-progress" role="status" aria-label="Loading page"></div>
{/if}

<nav>
	<div class="nav-inner">
		<span class="brand">🍲 Recipe Planner</span>
		{#each links as link (link.routeId)}
			<a href={link.href} class:active={page.route.id === link.routeId}>{link.label}</a>
		{/each}
	</div>
</nav>

<main>
	{@render children()}
</main>

<style>
	.nav-progress {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--color-primary);
		animation: nav-progress-sweep 1s ease-in-out infinite;
		z-index: 1000;
	}

	@keyframes nav-progress-sweep {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
</style>
