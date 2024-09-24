<script lang="ts">
  import '../../app.css';

	import Sidebar from '$lib/components/Sidebar.svelte';
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
	// import 'iconify-icon';
</script>

<div class="flex w-full bg-[#F9FAFB]">
	<Sidebar />
	<div class="min-h-screen pt-8 w-full ml-8 mr-6">
		<div class="max-w-4xl mx-auto">
			{@render children()}
		</div>
	</div>
</div>
