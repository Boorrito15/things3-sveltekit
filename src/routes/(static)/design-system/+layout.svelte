<script lang="ts">
	import '../../app.css';
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<div class=" min-h-screen p-12">
	{@render children()}
</div>
