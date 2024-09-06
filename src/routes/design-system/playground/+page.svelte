<!-- src/routes/design-system/playground/+page.svelte -->
<script lang="ts">
	import { Calendar, Combobox } from '$lib/global-components';
	import Datepicker from '$lib/blocks/to-do/Datepicker.svelte';
	import dayjs from 'dayjs';
</script>

<!-- <Combobox mode="dates" /> -->
<!-- <Calendar /> -->

<div class="max-w-xs mx-auto"><Datepicker mode="dates" /></div>
