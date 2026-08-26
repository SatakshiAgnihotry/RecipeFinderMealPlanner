<script lang="ts">
	import '@satakshiagnihotri/recipe-ui/dist/components/rc-empty-state';
	import type { Snippet } from 'svelte';

	let {
		heading,
		message,
		children
	}: {
		heading: string;
		message: string;
		children?: Snippet;
	} = $props();
</script>

<rc-empty-state {heading} {message}>
	{@render children?.()}
</rc-empty-state>
