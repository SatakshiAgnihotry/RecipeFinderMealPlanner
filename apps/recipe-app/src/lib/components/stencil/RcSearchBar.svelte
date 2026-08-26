<script lang="ts">
	import '@satakshiagnihotri/recipe-ui/dist/components/rc-search-bar';

	let {
		value = '',
		placeholder = 'Search recipes...',
		debounce = 300,
		onsearchchange
	}: {
		value?: string;
		placeholder?: string;
		debounce?: number;
		onsearchchange?: (value: string) => void;
	} = $props();

	let el: HTMLElement;

	$effect(() => {
		if (!el) return;
		const handleChange = (e: Event) => onsearchchange?.((e as CustomEvent<string>).detail);
		el.addEventListener('searchchange', handleChange);
		return () => el.removeEventListener('searchchange', handleChange);
	});
</script>

<rc-search-bar bind:this={el} {value} {placeholder} {debounce}></rc-search-bar>
