<script lang="ts">
	import { createCombobox, melt, type ComboboxOptionProps } from '@melt-ui/svelte';
	import { Check, ChevronDown, ChevronUp } from '$lib/global-icons';
	import { get } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import dayjs from 'dayjs';
	import chrono from 'chrono-node';

	// Define the item type
	type Item = {
		title: string;
		description: string;
		disabled?: boolean;
	};

	// Declare props all in one $props() call
	let { items = [], mode = 'items' }: { items: Item[]; mode: 'items' | 'dates' } = $props();

	// Convert each Item to a ComboboxOptionProps
	const toOption = (item: Item): ComboboxOptionProps<Item> => ({
		value: item,
		label: item.title,
		disabled: item.disabled
	});

	// Setup combobox
	const {
		elements: { menu, input, option, label },
		states: { open, inputValue, touchedInput, selected },
		helpers: { isSelected }
	} = createCombobox<Item>({
		forceVisible: true,
		portal: null
	});

	$effect(() => {
		const selectedValue = $selected;
		if (selectedValue) {
			$inputValue = selectedValue.label ?? '';
		} else {
			console.log('Reset inputValue to empty');
			$inputValue = '';
		}
	});

	// Date suggestion logic when mode is 'dates'
	let filteredItems = $derived.by(() => {
		const inputVal = $inputValue.toLowerCase();

		if (mode === 'dates') {
			const results = chrono.parse(inputVal);
			return results.map((result) => {
				const date = result.start.date();
				const formattedDate = dayjs(date).format('D MMM');
				return { title: result.text, description: formattedDate };
			});
		}

		// Default behavior for 'items' mode
		return $touchedInput
			? items.filter(
					({ title, description }) =>
						title.toLowerCase().includes(inputVal) || description.toLowerCase().includes(inputVal)
				)
			: items;
	});
</script>

<div class="flex flex-col gap-1">
	<label use:melt={$label} for="item-input">
		<span class="text-sm font-medium text-magnum-900">Choose your favorite item:</span>
	</label>

	<div class="relative">
		<input
			id="item-input"
			use:melt={$input}
			class="flex h-10 items-center justify-between rounded-lg bg-white px-3 pr-12 text-black"
		/>
		<div class="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-magnum-900">
			{#if $open}
				<ChevronUp class="size-4" />
			{:else}
				<ChevronDown class="size-4" />
			{/if}
		</div>
	</div>
</div>

{#if $open}
	<ul
		class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-lg"
		use:melt={$menu}
		transition:fly={{ duration: 150, y: -5 }}
	>
		<div class="flex max-h-full flex-col gap-0 overflow-y-auto bg-white px-2 py-2 text-black">
			{#each filteredItems as item, index (index)}
				<li
					use:melt={$option(toOption(item))}
					class="relative cursor-pointer scroll-my-2 rounded-md py-2 pl-4 pr-4 hover:bg-magnum-100 data-[highlighted]:bg-magnum-200 data-[highlighted]:text-magnum-900 data-[disabled]:opacity-50"
				>
					{#if $isSelected(item)}
						<div class="check absolute left-2 top-1/2 z-10 text-magnum-900">
							<Check class="size-4" />
						</div>
					{/if}
					<div class="pl-4">
						<span class="font-medium">{item.title}</span>
						<span class="block text-sm opacity-75">{item.description}</span>
					</div>
				</li>
			{:else}
				<li class="relative cursor-pointer rounded-md py-1 pl-8 pr-4">No results found</li>
			{/each}
		</div>
	</ul>
{/if}

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}

	ul {
		@apply m-0;
	}
</style>
