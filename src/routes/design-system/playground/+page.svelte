<script lang="ts">
	import { Collapsible } from '$lib/global-components';

	let word = 'hidden';
</script>

<Collapsible>
	{#snippet text()}
		{@const text = word}
		<p class="leading-3">{text}</p>
	{/snippet}
</Collapsible>
