<script lang="ts">
	import { createCollapsible, melt } from '@melt-ui/svelte';
	import { ChevronUpDown, X } from '$lib/global-icons';
	import { slide } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	const {
		elements: { root, content, trigger },
		states: { open }
	} = createCollapsible({
		forceVisible: true
	});

	type CollapsibleProps = {
		text: Snippet;
		items: Snippet;
	};

	let { text, items }: CollapsibleProps = $props();
</script>

<div use:melt={$root} class="relative mx-auto mb-28 w-full">
	<div class="flex items-center justify-between">
		<button use:melt={$trigger} class="text-sm font-semibold text-magnum-900">
			{#if text}
				{@render text()}
			{:else}
				@thomasglopes starred 3 repositories
			{/if}
		</button>
		<!-- <button
			use:melt={$trigger}
			class="relative h-6 w-6 place-items-center rounded-md bg-white text-sm
        text-magnum-800 shadow hover:opacity-75 data-[disabled]:cursor-not-allowed
        data-[disabled]:opacity-75"
			aria-label="Toggle"
		>
			<div class="abs-center">
				{#if $open}
					<X class="size-3" />
				{:else}
					<ChevronUpDown class="size-3" />
				{/if}
			</div>
		</button> -->
	</div>

	<div style:position="absolute" style:top="calc(100% + 10px)" style:right="0" style:left="0">
		{#if $open}
			<div use:melt={$content} transition:slide>
				<div class="flex flex-col">
					{#if items}
						{@render items()}
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.abs-center {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
