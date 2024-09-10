<script lang="ts">
	/**
	 * * IMPORTS
	 */
	import { melt, createCalendar, createCombobox, type ComboboxOptionProps } from '@melt-ui/svelte';
	import { ChevronLeft, ChevronRight } from '$lib/global-icons';
	import * as chrono from 'chrono-node';
	import { CalendarDate } from '@internationalized/date';
	import dayjs from 'dayjs';
	import { fly } from 'svelte/transition';
	import relativeTime from 'dayjs/plugin/relativeTime';

	// Extend dayjs with plugins
	dayjs.extend(relativeTime);

	/**
	 * * INTERFACES & TYPES
	 * This section defines the types and interfaces used in the component.
	 */
	type DateItem = {
		title: string;
		description?: string;
		disabled?: boolean;
	};

	/**
	 * * UTILITY FUNCTIONS
	 * Helper functions to format dates and parse date inputs.
	 */

	/**
	 * Format a Date object into a human-readable string.
	 * @param date - The date to format.
	 * @param forInput - Boolean indicating if the formatted string is for an input field.
	 */
	function formatDate(date: Date, forInput: boolean = false): string {
		const today = dayjs().startOf('day');
		const targetDate = dayjs(date).startOf('day');
		const daysDiff = targetDate.diff(today, 'day');

		if (daysDiff === 0) return 'Today';
		if (daysDiff === 1) return 'Tomorrow';
		if (daysDiff >= 2 && daysDiff <= 5) return `${targetDate.format('dddd')}`;
		if (targetDate.year() === today.year()) return targetDate.format('ddd, D MMM');
		return targetDate.format('D MMM YYYY');
	}

	/**
	 * Parse a user's natural language input into potential date matches.
	 * @param input - User input string to parse.
	 * @returns An array of DateItem objects that match the parsed input.
	 */
	function parseDateInput(input: string): DateItem[] {
		const results = chrono.parse(input);
		if (results.length === 0) return [];

		return results.map((result) => {
			const title = result.text;
			const date = result.start.date();
			return {
				title: title.charAt(0).toUpperCase() + title.slice(1),
				description: formatDate(date)
			};
		});
	}

	/**
	 * Convert a DateItem into a ComboboxOptionProps object.
	 * @param item - The DateItem to convert.
	 * @returns A formatted ComboboxOptionProps object.
	 */
	const toOption = (item: DateItem): ComboboxOptionProps<DateItem> => ({
		value: item,
		label: item.title,
		disabled: item.disabled
	});

	/**
	 * * COMBOBOX SETUP
	 * This section handles the logic for the combobox that displays potential date options.
	 */
	const {
		elements: { menu, input, option, label },
		states: { open, inputValue, selected },
		helpers: { isSelected }
	} = createCombobox<DateItem>({ forceVisible: true, portal: null });

	/**
	 * * CALENDAR SETUP
	 * This section manages the calendar's behavior and its interaction with the state.
	 */
	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, weekdays, value },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		// This function is called when a date is selected in the calendar
		onValueChange: ({ next }) => {
			if (next) {
				date = new Date(next.year, next.month - 1, next.day);
				$inputValue = formatDate(date, true);
				if (onDateSelected) {
					console.log();
					onDateSelected(date);
				}
			}
			return next;
		}
	});

	/**
	 * * PROPS & STATE VARIABLES
	 * These variables store the current state of the date input, parsed dates, and selected date.
	 */

	let { onDateSelected } = $props<{ onDateSelected: (date: Date | null) => void }>();

	let nlpInput = $state('');
	let parsedDate = $state<Date | null>(null);
	let date = $state<Date | null>(null);

	/**
	 * * FUNCTIONS
	 * Additional helper functions to handle date input and updates.
	 */

	/**
	 * Set the date based on user input (natural language parsing).
	 * @param input - The user's input string.
	 */
	function setDateFromInput(input: string) {
		parsedDate = chrono.parseDate(input);
		if (parsedDate instanceof Date) {
			const year = parsedDate.getFullYear();
			const month = parsedDate.getMonth() + 1;
			const day = parsedDate.getDate();
			const calendarDate = new CalendarDate(year, month, day);
			value.set(calendarDate);
		}
	}

	/**
	 * * DERIVED DATA
	 * This derived store filters date items based on user input.
	 */
	let filteredItems = $derived.by(() => {
		const inputVal = $inputValue.toLowerCase();
		if (inputVal) {
			return parseDateInput(inputVal);
		}
		return [];
	});

	/**
	 * * EFFECTS
	 * This effect logs the selected date when it changes.
	 */
	$effect(() => {
		if (date) {
			console.log(date);
		}
	});
</script>

<div use:melt={$calendar} class="w-full">
	<!-- Combobox Template -->
	<div class="flex flex-col gap-1 w-full">
		<label use:melt={$label} for="date-input"> </label>

		<div class="relative">
			<input
				id="date-input"
				use:melt={$input}
				class="flex h-10 items-center justify-between rounded-lg bg-white text-black w-full pl-4"
				placeholder="when"
				bind:value={nlpInput}
				oninput={() => setDateFromInput(nlpInput)}
			/>
			<div class="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-magnum-900"></div>
		</div>
	</div>

	{#if $open}
		<ul
			class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-lg"
			use:melt={$menu}
			transition:fly={{ duration: 150, y: -5 }}
		>
			<div class="flex max-h-full flex-col gap-0 overflow-y-auto bg-white text-black">
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				{#each filteredItems as item, index (index)}
					<li
						use:melt={$option(toOption(item))}
						onclick={() => setDateFromInput(item.description || '')}
						class="relative cursor-pointer scroll-my-2 rounded-md hover:bg-magnum-100 data-[highlighted]:bg-magnum-200 data-[highlighted]:text-magnum-900 data-[disabled]:opacity-50 py-2"
					>
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

	<!-- Calendar Component -->
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

	table {
		@apply bg-transparent border-collapse w-full;
	}

	td,
	th {
		@apply bg-transparent border-0 p-0;
	}

	tr {
		@apply bg-transparent border-none;
	}

	.check {
		@apply absolute left-2 top-1/2 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}

	ul {
		@apply m-0;
	}
</style>
