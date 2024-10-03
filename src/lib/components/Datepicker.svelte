<script lang="ts">
	/**
	 * * IMPORTS
	 */
	import { melt, createCalendar, createCombobox, type ComboboxOptionProps } from '@melt-ui/svelte';
	import { ChevronLeft, ChevronRight, Search } from '$lib/global-icons';
	import * as chrono from 'chrono-node';
	import { CalendarDateTime } from '@internationalized/date';
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
			const hasTime = result.start.isCertain('hour');

			// Only include time in the description if it is specified
			const description = hasTime
				? `${formatDateForDisplay(date)} at ${dayjs(date).format('h:mm A')}`
				: formatDateForDisplay(date);

			return {
				title: title.charAt(0).toUpperCase() + title.slice(1),
				description: description
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
				const selectedDate = new Date(next.year, next.month - 1, next.day);
				const hadTimeSpecified =
					currentDate !== null &&
					(currentDate.getHours() !== 0 ||
						currentDate.getMinutes() !== 0 ||
						currentDate.getSeconds() !== 0);

				if (!currentDate || currentDate.getTime() !== selectedDate.getTime()) {
					const formattedDateTime = formatDateForDisplay(selectedDate);
					if ($inputValue !== formattedDateTime) {
						$inputValue = formattedDateTime;
					}

					// Always set currentDate without time when selecting from calendar
					currentDate = new Date(
						selectedDate.getFullYear(),
						selectedDate.getMonth(),
						selectedDate.getDate()
					);

					if (onDateSelected) {
						onDateSelected(currentDate);
					}

					const calendarDateTime = new CalendarDateTime(next.year, next.month, next.day);
					value.set(calendarDateTime);
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
		const parsedResults = chrono.parse(input);
		if (parsedResults.length > 0) {
			const result = parsedResults[0];
			const hasTime = result.start.isCertain('hour');

			let parsedDate;
			if (hasTime) {
				parsedDate = result.start.date();
			} else {
				// Set time to midnight if no time was specified
				parsedDate = new Date(
					result.start.get('year') ?? 0,
					(result.start.get('month') ?? 1) - 1,
					result.start.get('day') ?? 1,
					0,
					0,
					0,
					0
				);
			}

			console.log('Datepicker - Parsed Date:', parsedDate);

			currentDate = parsedDate;

			if (onDateSelected) {
				console.log('Datepicker - Passing to onDateSelected:', currentDate);
				onDateSelected(currentDate);
			}

			// Update input value
			$inputValue = hasTime
				? `${formatDateForDisplay(parsedDate)} at ${dayjs(parsedDate).format('h:mm A')}`
				: formatDateForDisplay(parsedDate);
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

<div use:melt={$calendar} class="flex w-full flex-col items-center">
	<!-- Combobox Template -->
	<div class="mb-2 flex w-full flex-col">
		<label use:melt={$label} for="date-input"></label>
		<div class="relative flex items-center">
			<!-- Parent div made a flex container to allow input to grow properly -->
			<div class="relative flex-grow">
				<Search class="absolute left-1.5 top-1/2 size-4 -translate-y-1/2 transform text-gray-400" />
				<input
					id="date-input"
					use:melt={$input}
					class="w-full items-center rounded-md bg-gray-500 bg-transparent py-0 pl-8 pr-2 text-white"
					placeholder="When"
				/>
			</div>
			<!-- Ensure the icon/element inside is positioned correctly -->
		</div>
	</div>

	<!-- Display filtered date options for selection -->
	{#if $open}
		<ul
			class="flex flex-col overflow-hidden"
			use:melt={$menu}
			transition:fly={{ duration: 150, y: -5 }}
		>
			<div class="flex max-h-full flex-col gap-0 overflow-y-auto bg-black text-white">
				{#each dateSuggestions as suggestion, index (index)}
					<li
						use:melt={$option(convertToOption(suggestion))}
						class="relative cursor-pointer scroll-my-2 rounded-md py-1 pl-2 text-sm hover:bg-[#5A9BFE] data-[highlighted]:bg-[#5A9BFE] data-[highlighted]:text-white data-[disabled]:opacity-50"
					>
						<div>
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
	<div class="w-full {dateSuggestions.length > 0 ? 'hidden' : ''}">
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
</div>

<style lang="postcss">
	[data-melt-calendar] {
		@apply min-w-fit rounded-lg bg-black p-2 text-white shadow-sm;
	}

	header {
		@apply flex items-center justify-between pb-2;
	}

	header + div {
		@apply flex items-center gap-8;
	}

	[data-melt-calendar-prevbutton] {
		@apply rounded-lg p-1 transition-all hover:bg-[#5A9BFE];
	}

	[data-melt-calendar-nextbutton] {
		@apply rounded-lg p-1 transition-all hover:bg-[#5A9BFE];
	}

	[data-melt-calendar-heading] {
		@apply text-sm font-semibold text-white;
	}

	th {
		@apply bg-transparent text-sm font-semibold text-white;

		& div {
			@apply mx-auto flex h-4 w-4 items-center justify-center bg-transparent py-4;
		}
	}

	[data-melt-calendar-grid] {
		@apply w-full bg-transparent;
	}

	[data-melt-calendar-cell] {
		@apply mx-auto flex h-6 w-full cursor-pointer select-none items-center justify-center rounded-lg bg-transparent p-0.5 text-sm hover:bg-[#5A9BFE] data-[outside-visible-months]:pointer-events-none data-[outside-visible-months]:cursor-default data-[range-highlighted]:bg-[#5A9BFE] data-[selected]:bg-[#5A9BFE] data-[selected]:text-magnum-900 data-[disabled]:opacity-40 data-[outside-visible-months]:opacity-40 data-[outside-visible-months]:hover:bg-transparent;
	}

	[data-melt-calendar-cell][data-outside-month='true'][data-outside-visible-months='true'] {
		@apply bg-transparent opacity-0;
	}

	table {
		@apply w-full border-collapse bg-transparent;
	}

	td,
	th {
		@apply border-0 bg-transparent p-0;
	}

	tr {
		@apply border-none bg-transparent;
	}

	.check {
		/* @apply absolute left-2 top-1/2 text-magnum-500; */
		/* translate: 0 calc(-50% + 1px); */
	}

	ul {
		@apply !relative !left-0 !top-0 m-0;
	}
</style>
