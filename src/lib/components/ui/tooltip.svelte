<script lang="ts">
	import { createTooltip, melt } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';

	interface TooltipProps {
		message: string;
		triggerElement: string;
		iconColor?: string;
	}

	let { message, triggerElement, iconColor = '#A1A3A9' }: TooltipProps = $props();

	const {
		elements: { trigger, content, arrow },
		states: { open }
	} = createTooltip({
		positioning: {
			placement: 'bottom'
		},
		openDelay: 0,
		closeDelay: 0,
		closeOnPointerDown: false,
		forceVisible: true
	});
</script>

<button type="button" class="trigger" use:melt={$trigger} aria-label="Add">
	{@html triggerElement}
</button>

{#if $open}
	<div
		use:melt={$content}
		transition:fade={{ duration: 100 }}
		class="z-10 rounded-lg bg-white shadow"
	>
		<div use:melt={$arrow}></div>
		<p class="px-2 text-[hsl(213,100%,60%)]">{message}</p>
	</div>
{/if}

<style lang="postcss">
	.trigger {
		@apply inline-flex items-center justify-center;
		@apply text-magnum-900 transition-colors;
		@apply border border-transparent hover:border hover:border-gray-300 rounded-sm;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
		@apply p-0 text-sm font-medium;
	}
</style>
