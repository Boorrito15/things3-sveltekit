<script lang="ts">
	/**
	 * * IMPORTS
	 */
	import { melt, createCalendar, createCombobox, type ComboboxOptionProps } from '@melt-ui/svelte';
	import { ChevronLeft, ChevronRight } from '$lib/global-icons';
	import * as chrono from 'chrono-node';
	import { CalendarDate, CalendarDateTime } from '@internationalized/date';
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
			const time =
				result.start.get('hour') !== undefined ? dayjs(date).format('h:mm A') : '9:00 PM'; // Default time
			return {
				title: title.charAt(0).toUpperCase() + title.slice(1),
				description: `${formatDateForDisplay(date)} at ${time}`
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
				const selectedTime = currentDate ? dayjs(currentDate).format('HH:mm:ss') : '21:00:00'; // Default to 9:00 PM

				if (!currentDate || currentDate.getTime() !== selectedDate.getTime()) {
					const formattedDateTime = `${formatDateForDisplay(selectedDate)} at ${dayjs(selectedTime, 'HH:mm:ss').format('h:mm A')}`;
					if ($inputValue !== formattedDateTime) {
						$inputValue = formattedDateTime;
					}

					currentDate = new Date(
						selectedDate.getFullYear(),
						selectedDate.getMonth(),
						selectedDate.getDate(),
						parseInt(selectedTime.split(':')[0]),
						parseInt(selectedTime.split(':')[1]),
						parseInt(selectedTime.split(':')[2])
					);

					if (onDateSelected) {
						onDateSelected(currentDate);
					}

					const calendarDateTime = new CalendarDateTime(
						next.year,
						next.month,
						next.day,
						currentDate.getHours(),
						currentDate.getMinutes(),
						currentDate.getSeconds()
					);
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

<div use:melt={$calendar} class="flex w-full flex-col items-center">
	<!-- Combobox Template -->
	<div class="mb-1 flex w-full flex-col">
		<label use:melt={$label} for="date-input"></label>
		<div class="relative flex items-center">
			<!-- Parent div made a flex container to allow input to grow properly -->
			<input
				id="date-input"
				use:melt={$input}
				class="mx-1 flex-grow items-center rounded-md bg-gray-500 bg-transparent px-2 py-0 text-white"
				placeholder="When"
			/>
			<!-- Ensure the icon/element inside is positioned correctly -->
			<div class="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-magnum-900">
				<!-- Content like icon or text here -->
			</div>
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
		@apply min-w-fit rounded-lg bg-black px-1 py-2 text-white shadow-sm;
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
		@apply mx-auto flex h-6 w-full cursor-pointer select-none items-center justify-center rounded-lg bg-transparent p-0.5 text-sm hover:bg-[#5A9BFE] data-[outside-visible-months]:pointer-events-none data-[outside-visible-months]:cursor-default data-[range-highlighted]:bg-magnum-200 data-[selected]:bg-magnum-300 data-[selected]:text-magnum-900 data-[disabled]:opacity-40 data-[outside-visible-months]:opacity-40 data-[outside-visible-months]:hover:bg-transparent;
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
