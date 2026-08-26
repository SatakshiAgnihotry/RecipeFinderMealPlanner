<script lang="ts">
	import '@satakshiagnihotri/recipe-ui/dist/components/rc-modal';
	import type { Snippet } from 'svelte';

	let {
		open = false,
		heading,
		onmodalclose,
		children,
		footer
	}: {
		open?: boolean;
		heading: string;
		onmodalclose?: () => void;
		children?: Snippet;
		footer?: Snippet;
	} = $props();

	let el: HTMLElement;

	$effect(() => {
		if (!el) return;
		const handleClose = () => onmodalclose?.();
		el.addEventListener('modalclose', handleClose);
		return () => el.removeEventListener('modalclose', handleClose);
	});
</script>

<rc-modal bind:this={el} {open} {heading}>
	{@render children?.()}
	{#if footer}
		<div slot="footer">{@render footer()}</div>
	{/if}
</rc-modal>
