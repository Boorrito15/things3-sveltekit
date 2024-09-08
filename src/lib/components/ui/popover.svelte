<script lang="ts">
	import { createPopover, createTooltip, createSync, melt } from '@melt-ui/svelte';
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	// Local state for popover
	let open = $state(false);

	interface PopoverProps {
		Icon: any;
		contentBlock?: Snippet;
		message?: string;
		onOpenChange?: (isOpen: boolean) => void;
	}

	let { Icon, contentBlock, message, onOpenChange }: PopoverProps = $props();

	// Create the popover and tooltip
	const {
		elements: { trigger, content, arrow, close },
		states
	} = createPopover({
		forceVisible: true,
		positioning: {
			placement: 'bottom-end' // Adjust placement if needed
		},
		closeOnOutsideClick: true // Ensure clicking outside closes the popover
	});

	// Tooltip configuration
	const {
		elements: { trigger: tooltipTrigger, content: tooltipContent, arrow: tooltipArrow },
		states: { open: tooltipOpen }
	} = createTooltip({
		positioning: {
			placement: 'bottom'
		},
		openDelay: 0,
		closeDelay: 0,
		closeOnPointerDown: false,
		forceVisible: false,
		disableHoverableContent: true
	});

	// Sync popover and tooltip open state
	const sync = createSync(states);
	$effect(() => {
		sync.open(open, (v) => {
			open = v;
			if (onOpenChange) onOpenChange(open);
			if (open) {
				// Close the tooltip when popover opens
				tooltipOpen.set(false);
			}
		});
	});
</script>

<!-- Tooltip trigger (wrapping the popover trigger) -->
<div class="tooltip-trigger w-fit" use:melt={$tooltipTrigger}>
	<!-- Popover trigger (Icon button) -->
	<button type="button" use:melt={$trigger}>
		<Icon class="size-4" />
	</button>
</div>

<!-- Tooltip content -->
{#if $tooltipOpen && message}
	<div
		use:melt={$tooltipContent}
		transition:fade={{ duration: 100 }}
		class="z-10 rounded-lg bg-white shadow w-fit"
	>
		<div use:melt={$tooltipArrow}></div>
		<p class="px-2 text-[hsl(213,100%,60%)]">{message}</p>
	</div>
{/if}

<!-- Popover content -->
{#if open}
	<div use:melt={$content} transition:fade={{ duration: 100 }} class="content">
		<!-- Arrow for popover -->
		<div use:melt={$arrow}></div>
		<!-- Popover content block passed via snippet -->
		{#if contentBlock}
			{@render contentBlock()}
		{/if}
	</div>
{/if}

<style lang="postcss">
	.trigger {
		@apply inline-flex items-center justify-center rounded-full bg-white p-0;
		@apply text-sm font-medium text-magnum-900 transition-colors hover:bg-white/90;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
	}

	.content {
		@apply z-10 w-fit rounded-[4px] bg-white shadow-sm;
	}

	.tooltip-trigger {
		@apply w-fit;
	}

	.tooltip-content {
		@apply z-10 rounded-lg bg-white shadow w-fit;
	}

	.tooltip-arrow {
		@apply z-10;
	}
</style>
