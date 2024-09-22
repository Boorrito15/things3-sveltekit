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

	dayjs.extend(relativeTime);
	/**
	 * * INTERFACES & TYPES
	 */
	type DateSuggestion = {
		title: string;
		description?: string;
		disabled?: boolean;
	};

	/**
	 * * UTILITY FUNCTIONS
	 */
	function formatDateForDisplay(date: Date): string {
		const today = dayjs().startOf('day');
		const targetDate = dayjs(date).startOf('day');
		const daysDifference = targetDate.diff(today, 'day');

		if (daysDifference === 0) return 'Today';
		if (daysDifference === 1) return 'Tomorrow';
		if (daysDifference >= 2 && daysDifference <= 5) return `${targetDate.format('dddd')}`;
		if (targetDate.year() === today.year()) return targetDate.format('ddd, D MMM');
		return targetDate.format('D MMM YYYY');
	}

	function parseNaturalDateInput(input: string): DateSuggestion[] {
		const parsedResults = chrono.parse(input);
		if (parsedResults.length === 0) return [];

		return parsedResults.map((result) => {
			const title = result.text;
			const date = result.start.date();
			return {
				title: title.charAt(0).toUpperCase() + title.slice(1),
				description: formatDateForDisplay(date)
			};
		});
	}

	const convertToOption = (item: DateSuggestion): ComboboxOptionProps<DateSuggestion> => ({
		value: item,
		label: item.title,
		disabled: item.disabled
	});

	/**
	 * * COMBOBOX SETUP
	 */
	const {
		elements: { menu, input, option, label },
		states: { open, inputValue, selected },
		helpers: { isSelected }
	} = createCombobox<DateSuggestion>({
		forceVisible: true,
		portal: null,
		onSelectedChange: ({ next }) => {
			if (next) {
				updateDateFromInput(next.value.description || next.value.title || '');
			}
			return next;
		}
	});

	/**
	 * * CALENDAR SETUP
	 */
	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, weekdays, value },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		onValueChange: ({ next }) => {
			if (next) {
				// Convert the selected date
				const selectedDate = new Date(next.year, next.month - 1, next.day);

				// Prevent infinite loop by ensuring the value is different
				if (!currentDate || currentDate.getTime() !== selectedDate.getTime()) {
					// Update inputValue only if necessary
					if ($inputValue !== formatDateForDisplay(selectedDate)) {
						$inputValue = formatDateForDisplay(selectedDate);
					}

					// Set the actual date and trigger the callback if necessary
					currentDate = selectedDate;
					if (onDateSelected) {
						onDateSelected(selectedDate);
					}

					// Set the selected date in the calendar state
					const calendarDate = new CalendarDate(next.year, next.month, next.day);
					value.set(calendarDate); // Ensure proper date highlighting
				}
			}

			return next;
		}
	});

	/**
	 * * PROPS & STATE VARIABLES
	 */
	let { onDateSelected } = $props<{ onDateSelected?: (date: Date | null) => void }>();
	let parsedDate = $state<Date | null>(null);
	let currentDate = $state<Date | null>(null);

	/**
	 * * FUNCTIONS
	 */
	function updateDateFromInput(input: string) {
		parsedDate = chrono.parseDate(input);
		if (parsedDate) {
			currentDate = parsedDate;
			if (onDateSelected) {
				onDateSelected(parsedDate);
			}
		}
	}

	/**
	 * * DERIVED DATA
	 */
	let dateSuggestions = $derived.by(() => {
		const searchInput = $inputValue.toLowerCase();
		if (searchInput) {
			return parseNaturalDateInput(searchInput);
		}
		return [];
	});

	/**
	 * * EFFECTS
	 */
</script>

<div use:melt={$calendar} class="w-full">
	<!-- Combobox Template -->
	<div class="flex flex-col gap-1 w-full">
		<label use:melt={$label} for="date-input"></label>
		<div class="relative">
			<input
				id="date-input"
				use:melt={$input}
				class="flex h-10 items-center justify-between rounded-lg bg-white text-black w-full pl-4"
				placeholder="Pick a date"
			/>
			<div class="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-magnum-900"></div>
		</div>
	</div>

	<!-- Display filtered date options for selection -->
	{#if $open}
		<ul
			class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-lg"
			use:melt={$menu}
			transition:fly={{ duration: 150, y: -5 }}
		>
			<div class="flex max-h-full flex-col gap-0 overflow-y-auto bg-white text-black">
				{#each dateSuggestions as suggestion, index (index)}
					<li
						use:melt={$option(convertToOption(suggestion))}
						class="relative cursor-pointer scroll-my-2 rounded-md hover:bg-magnum-100 data-[highlighted]:bg-magnum-200 data-[highlighted]:text-magnum-900 data-[disabled]:opacity-50 py-2"
					>
						<div class="pl-4">
							<span class="font-medium">{suggestion.title}</span>
							{#if suggestion.description}
								<span class="block text-sm opacity-75">{suggestion.description}</span>
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
