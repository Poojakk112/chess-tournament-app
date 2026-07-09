<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<nav class="bg-gray-800 text-white px-6 py-3 flex gap-6">
	<a href="/" class="font-semibold hover:text-gray-300">Chess Tournament App</a>
	<a href="/players" class="hover:text-gray-300">Players</a>
	<a href="/tournaments" class="hover:text-gray-300">Tournaments</a>
</nav>

{@render children()}