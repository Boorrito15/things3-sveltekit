<script lang="ts">
	import '../../app.css';
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
	// import 'iconify-icon';
</script>

<div class="flex w-full bg-[#F9FAFB]">
	<div class="min-h-screen w-full">
		<div class="max-w-4xl mx-auto">
			{@render children()}
		</div>
	</div>
</div>
