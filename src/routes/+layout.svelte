<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
	// import 'iconify-icon';
</script>

<div class="min-h-screen pt-12">
	<div class="max-w-4xl mx-auto">
		{@render children()}
	</div>
</div>
