<script lang="ts">
	import { createCombobox, melt, type ComboboxOptionProps } from '@melt-ui/svelte';
	import { Check, ChevronDown, ChevronUp } from '$lib/global-icons';
	import { get } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import chrono from 'chrono-node';

	dayjs.extend(relativeTime);

	// Define the item type
	type Item = {
		title: string;
		description: string;
		disabled?: boolean;
	};

	let { items = [] }: { items: Item[] } = $props();

	// Utility function to format dates for the dropdown
	function formatDateForDropdown(date: Date) {
		const today = dayjs().startOf('day');
		const targetDate = dayjs(date).startOf('day');
		const daysDiff = targetDate.diff(today, 'day');

		if (daysDiff === 0) return 'today';
		if (daysDiff === 1) return 'tomorrow';

		// For short-term future dates (within 5 days)
		if (daysDiff >= 2 && daysDiff <= 5) {
			return `Next ${targetDate.format('dddd')}`;
		}

		// If the date is more than 5 days but within the same year, return 'Wed, 11 Sep'
		if (targetDate.year() === today.year()) {
			return targetDate.format('ddd, D MMM');
		}

		// For dates in the next year, return '1 Jan 2025'
		return targetDate.format('D MMM YYYY');
	}

	// Utility function to format the input when selected (e.g., "Next Wednesday")
	function formatDateForInput(date: Date) {
		const today = dayjs().startOf('day');
		const targetDate = dayjs(date).startOf('day');
		const daysDiff = targetDate.diff(today, 'day');

		if (daysDiff === 0) return 'Today';
		if (daysDiff === 1) return 'Tomorrow';

		// If within 5 days, return "Next Wednesday"
		if (daysDiff >= 2 && daysDiff <= 5) {
			return `Next ${targetDate.format('dddd')}`;
		}

		if (targetDate.year() > today.year() || targetDate.year() < today.year()) {
			return `${targetDate.format('D MMM YYYY')}`;
		}

		// For all other dates, return the formatted date
		return targetDate.format('ddd, D MMM');
	}

	// Handle parsed results from chrono
	function parseDateInput(input: string): Item[] {
		const results = chrono.parse(input);
		if (results.length === 0) return [];

		return results.map((result) => {
			const date = result.start.date();
			const description = formatDateForDropdown(date); // Use for dropdown
			const label = result.text; // Use the raw text for input display

			return {
				title: label, // The user input (e.g., "next Wednesday")
				description // The formatted dropdown display (e.g., "Wed, 11 Sep")
			};
		});
	}

	// Convert each Item to a ComboboxOptionProps
	const toOption = (item: Item): ComboboxOptionProps<Item> => ({
		value: item,
		label: item.title, // Show input or parsed text like "next Wednesday"
		description: item.description, // Show parsed date like "Wed, 11 Sep"
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
			const parsedDate = chrono.parseDate(selectedValue.label);
			// After selection, display "Next Wednesday" or similar in the input
			$inputValue = parsedDate ? formatDateForInput(parsedDate) : selectedValue.label;
		} else {
			$inputValue = '';
		}
	});

	// Use $derived.by to create filtered items based on input value and parsed dates
	let filteredItems = $derived.by(() => {
		const inputVal = $inputValue.toLowerCase();

		// If the input is a date, use chrono to parse and format it
		if (inputVal) {
			return parseDateInput(inputVal);
		}

		// Default to regular items if no date parsing occurs
		return $touchedInput
			? items.filter(
					({ title, description }) =>
						title.toLowerCase().includes(inputVal) || description.toLowerCase().includes(inputVal)
				)
			: items;
	});
</script>

<!-- Component Template -->
<div class="flex flex-col gap-1">
	<label use:melt={$label} for="item-input">
		<span class="text-sm font-medium text-magnum-900">Choose your favorite date:</span>
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
		<div class="flex max-h-full flex-col gap-0 overflow-y-auto bg-white px-2 text-black">
			{#each filteredItems as item, index (index)}
				<li
					use:melt={$option(toOption(item))}
					class="relative cursor-pointer scroll-my-2 rounded-md py-4 pl-4 pr-4 hover:bg-magnum-100 data-[highlighted]:bg-magnum-200 data-[highlighted]:text-magnum-900 data-[disabled]:opacity-50"
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
