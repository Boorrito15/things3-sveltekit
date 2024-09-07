<script lang="ts">
	import { createPopover, createTooltip, createSync, melt } from '@melt-ui/svelte';
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	let open = $state(false);

	interface PopoverProps {
		Icon: any;
		contentBlock?: Snippet;
		message?: string;
	}

	let { Icon, contentBlock, message }: PopoverProps = $props();

	const {
		elements: { trigger, content, arrow, close },
		states
	} = createPopover({
		forceVisible: true
	});

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

	const sync = createSync(states);
	$effect(() => {
		sync.open(open, (v) => {
			open = v;
			if (open) {
				// Close the tooltip when popover opens
				tooltipOpen.set(false); // Update the tooltip's open store to close it
			}
		});
	});
</script>

<div class="tooltip-trigger w-fit" use:melt={$tooltipTrigger}>
	<button type="button" use:melt={$trigger}>
		<Icon class="size-4" />
	</button>
</div>

<!-- Tooltip Content -->
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

<!-- Popover Content -->
{#if open}
	<div use:melt={$content} transition:fade={{ duration: 100 }} class="content">
		<!-- svelte-ignore element_invalid_self_closing_tag -->
		<div use:melt={$arrow} />
		{#if contentBlock}
			{@render contentBlock()}
		{/if}
	</div>
{/if}

<style lang="postcss">
	.input {
		@apply flex h-8 w-full rounded-md border border-magnum-800 bg-transparent px-2.5 text-sm;
		@apply ring-offset-magnum-300 focus-visible:ring;
		@apply focus-visible:ring-magnum-400 focus-visible:ring-offset-1;
		@apply flex-1 items-center justify-center;
		@apply px-2.5 text-sm leading-none text-magnum-700;
	}

	.trigger {
		@apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white p-0;
		@apply text-sm font-medium text-magnum-900 transition-colors hover:bg-white/90;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
	}

	.close {
		@apply absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full;
		@apply text-magnum-900 transition-colors hover:bg-magnum-500/10;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
		@apply bg-white p-0 text-sm font-medium;
	}

	.content {
		@apply z-10 w-60 rounded-[4px] bg-white p-5 shadow-sm;
	}

	.trigger {
		@apply inline-flex items-center justify-center;
		@apply text-magnum-900 transition-colors;
		@apply border border-transparent hover:border hover:border-gray-300 rounded-sm;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
		@apply p-0 text-sm font-medium;
	}
</style>
