<script lang="ts">
	import '@satakshiagnihotri/recipe-ui/dist/components/rc-filter-chip';

	let {
		label,
		active = false,
		onchiptoggle
	}: {
		label: string;
		active?: boolean;
		onchiptoggle?: (detail: { label: string; active: boolean }) => void;
	} = $props();

	let el: HTMLElement;

	$effect(() => {
		if (!el) return;
		const handleToggle = (e: Event) =>
			onchiptoggle?.((e as CustomEvent<{ label: string; active: boolean }>).detail);
		el.addEventListener('chiptoggle', handleToggle);
		return () => el.removeEventListener('chiptoggle', handleToggle);
	});
</script>

<rc-filter-chip bind:this={el} {label} {active}></rc-filter-chip>
