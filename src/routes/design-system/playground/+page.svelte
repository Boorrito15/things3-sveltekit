<!-- src/routes/design-system/playground/+page.svelte -->
<script lang="ts">
	import { Calendar, Combobox } from '$lib/global-components';

	import dayjs from 'dayjs';

	function getDateFromTitle(title: string): string {
		switch (title.toLowerCase()) {
			case 'today':
				return dayjs().format('D MMM');
			case 'tomorrow':
				return dayjs().add(1, 'day').format('D MMM');
			case 'next week':
				return dayjs().add(7, 'day').format('D MMM');
			default:
				return title;
		}
	}

	let items = [
		{ description: getDateFromTitle('today'), title: 'today' },
		{ description: getDateFromTitle('tomorrow'), title: 'tomorrow' },
		{ description: getDateFromTitle('next week'), title: 'next week' }
	];
</script>

<Combobox {items} />
<!-- <Calendar /> -->

<!-- <div class="max-w-xs mx-auto"><Calendar /></div> -->
