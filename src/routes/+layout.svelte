<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
	// import 'iconify-icon';
</script>

<div class="bg-[#f2f5f7] min-h-screen">
	{@render children()}
</div>
