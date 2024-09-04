<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte';
	import ChevronLeft from '~icons/mdi/chevron-left';
	import ChevronRight from '~icons/mdi/chevron-right';
	import * as chrono from 'chrono-node';
	import { CalendarDate } from '@internationalized/date';

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
	let nlpInput = $state('');
	let parsedDate = $state(Date);

	function parseNLP() {
		parsedDate = chrono.parseDate(nlpInput);
		console.log(parsedDate);
	}

	// Function to parse natural language input
	function setNewDate() {
		// Vanilla JS Date (October 15, 2024)
		const jsDate = new Date(2024, 10, 15); // JS Date months are 0-indexed

		// Convert it to CalendarDate (1-indexed month)
		const newDate = new CalendarDate(jsDate.getFullYear(), jsDate.getMonth(), jsDate.getDate());

		// Set the new date
		value.set(newDate);

		console.log('New date set');
	}

	// setNewDate();
</script>

<div>
	Input for NLP
	<input
		type="text"
		placeholder="Enter a natural language date (e.g., 'next Friday')"
		bind:value={nlpInput}
		oninput={parseNLP}
	/>

	<!-- Calendar rendered with Melt UI -->
	<div use:melt={$calendar}>
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
</style>
