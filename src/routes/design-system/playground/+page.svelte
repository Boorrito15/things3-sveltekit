<script lang="ts">
	import { Collapsible } from '$lib/global-components';

	let word = 'hidden';

	let things = ['item 1', 'item 2', 'item 3'];
</script>

<Collapsible>
	{#snippet heading()}
		{@const heading = word}
		<p class="leading-3 text-sm font-semibold text-gray-300">{heading}</p>
	{/snippet}

	{#snippet items()}
		{#each things as thing}
			{@const items = thing}
			<p class="leading-3">{items}</p>
		{/each}
	{/snippet}
</Collapsible>
