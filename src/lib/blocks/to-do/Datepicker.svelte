<script lang="ts">
	import { melt, createCalendar, createCombobox, type ComboboxOptionProps } from '@melt-ui/svelte';
	import { ChevronLeft, ChevronRight } from '$lib/global-icons';
	import * as chrono from 'chrono-node';
	import { CalendarDate } from '@internationalized/date';
	import dayjs from 'dayjs';
	import { Check, ChevronDown, ChevronUp } from '$lib/global-icons';
	import { get } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	// Define the item type
	type Item = {
		title: string;
		description?: string;
		disabled?: boolean;
	};

	let { items = [] }: { items: Item[] } = $props();

	// Utility function to format dates for both dropdown and input
	function formatDate(date: Date, forInput: boolean = false) {
		const today = dayjs().startOf('day');
		const targetDate = dayjs(date).startOf('day');
		const daysDiff = targetDate.diff(today, 'day');

		if (daysDiff === 0) return forInput ? 'Today' : 'today';
		if (daysDiff === 1) return forInput ? 'Tomorrow' : 'tomorrow';

		if (daysDiff >= 2 && daysDiff <= 5) {
			return forInput ? `Next ${targetDate.format('dddd')}` : `Next ${targetDate.format('dddd')}`;
		}

		if (targetDate.year() === today.year()) {
			return targetDate.format('ddd, D MMM');
		}

		return targetDate.format('D MMM YYYY');
	}

	// Handle parsed results from chrono
	function parseDateInput(input: string): Item[] {
		const results = chrono.parse(input);
		if (results.length === 0) return [];

		return results.map((result) => {
			const date = result.start.date();
			return {
				title: result.text, // Use the raw text for input display
				description: formatDate(date) // Use formatted date for dropdown
			};
		});
	}

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
			const parsedDate = chrono.parseDate(selectedValue.label);
			// Display formatted date in the input if it was parsed
			$inputValue = parsedDate ? formatDate(parsedDate, true) : (selectedValue.label ?? '');
		} else {
			$inputValue = '';
		}
	});

	// Create filtered items based on input and parsed dates
	let filteredItems = $derived.by(() => {
		const inputVal = $inputValue.toLowerCase();

		// If the input is a valid date, use chrono to parse and format it
		if (inputVal) {
			return parseDateInput(inputVal);
		}

		// Filter default items if no valid date is parsed
		return $touchedInput
			? items.filter(({ title }) => title.toLowerCase().includes(inputVal))
			: items;
	});

	// Create calendar states and helpers
	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, weekdays, value },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		onValueChange: ({ curr, next }) => {
			console.log(next);
			return next;
		}
	});

	// Add natural language input
	let parsedDate = $state(Date);

	function parseNLP(e) {
		parsedDate = chrono.parseDate(e);
		if (parsedDate) {
			let year = parsedDate.getFullYear();
			let month = parsedDate.getMonth() + 1;
			let date = parsedDate.getDate();
			let calendarDate = new CalendarDate(year, month, date);
			// console.log(parsedDate);
			value.set(calendarDate);
		}
	}

	// setNewDate();
</script>

<!-- Calendar rendered with Melt UI -->
<div use:melt={$calendar} class="w-full">
	<!-- Component Template -->
	<div class="flex flex-col gap-1 w-full">
		<label use:melt={$label} for="item-input"> </label>

		<div class="relative">
			<input
				id="item-input"
				use:melt={$input}
				class="flex h-10 items-center justify-between rounded-lg bg-white px-3 text-black w-full text-center"
			/>
			<div class="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-magnum-900">
				<!-- {#if $open}
					<ChevronUp class="size-4" />
				{:else}
					<ChevronDown class="size-4" />
				{/if} -->
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
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				{#each filteredItems as item, index (index)}
					<li
						use:melt={$option(toOption(item))}
						onclick={() => parseNLP(item.description)}
						class="relative cursor-pointer scroll-my-2 rounded-md py-4 pl-4 pr-4 hover:bg-magnum-100 data-[highlighted]:bg-magnum-200 data-[highlighted]:text-magnum-900 data-[disabled]:opacity-50"
					>
						{#if $isSelected(item)}
							<div class="check absolute left-2 top-1/2 z-10 text-magnum-900">
								<Check class="size-4" />
							</div>
						{/if}
						<div class="pl-4">
							<span class="font-medium">{item.title}</span>
							{#if item.description}
								<span class="block text-sm opacity-75">{item.description}</span>
							{/if}
						</div>
					</li>
				{/each}
			</div>
		</ul>
	{/if}
	<header>
		<button use:melt={$prevButton}>
			<ChevronLeft />
		</button>
		<div use:melt={$heading}>
			{$headingValue}
		</div>
		<button use:melt={$nextButton}>
			<ChevronRight />
		</button>
	</header>
	<div>
		{#each $months as month}
			<table use:melt={$grid}>
				<thead aria-hidden="true">
					<tr>
						{#each $weekdays as day}
							<th>
								<div>{day}</div>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each month.weeks as weekDates}
						<tr>
							{#each weekDates as date}
								<td
									role="gridcell"
									aria-disabled={$isDateDisabled(date) || $isDateUnavailable(date)}
								>
									<div use:melt={$cell(date, month.value)}>
										{date.day}
									</div>
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		{/each}
	</div>
</div>

<style lang="postcss">
	[data-melt-calendar] {
		@apply min-w-fit rounded-lg bg-white p-3 text-magnum-800 shadow-sm;
	}

	header {
		@apply flex items-center justify-between pb-2;
	}

	header + div {
		@apply flex items-center gap-8;
	}

	[data-melt-calendar-prevbutton] {
		@apply rounded-lg p-1 transition-all hover:bg-magnum-100;
	}

	[data-melt-calendar-nextbutton] {
		@apply rounded-lg p-1 transition-all hover:bg-magnum-100;
	}

	[data-melt-calendar-heading] {
		@apply font-semibold text-magnum-800;
	}

	th {
		@apply text-sm font-semibold text-magnum-800 bg-transparent;

		& div {
			@apply flex h-4 w-4 items-center justify-center bg-transparent mx-auto py-4;
		}
	}

	[data-melt-calendar-grid] {
		@apply w-full bg-transparent;
	}

	[data-melt-calendar-cell] {
		@apply flex bg-transparent mx-auto aspect-square w-full cursor-pointer select-none items-center justify-center rounded-lg hover:bg-magnum-100 data-[outside-visible-months]:pointer-events-none data-[outside-visible-months]:cursor-default data-[range-highlighted]:bg-magnum-200 data-[selected]:bg-magnum-300 data-[selected]:text-magnum-900 data-[disabled]:opacity-40 data-[outside-visible-months]:opacity-40 data-[outside-visible-months]:hover:bg-transparent;
	}

	[data-melt-calendar-cell][data-outside-month='true'][data-outside-visible-months='true'] {
		@apply opacity-0 bg-transparent;
	}

	/* Add resets using @apply */
	table {
		@apply bg-transparent border-collapse w-full; /* Reset table background and ensure no gaps between cells */
	}

	td,
	th {
		@apply bg-transparent border-0 p-0; /* Reset background color, border, and padding */
	}

	td {
	}

	tr {
		@apply bg-transparent border-none; /* Reset row background */
	}

	.check {
		@apply absolute left-2 top-1/2 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}

	ul {
		@apply m-0;
	}
</style>
