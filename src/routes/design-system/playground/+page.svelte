<!-- src/routes/design-system/playground/+page.svelte -->
<script lang="ts">
	import { Calendar, Combobox } from '$lib/global-components';

	import dayjs from 'dayjs';
</script>

<Combobox mode="dates" />
<!-- <Calendar /> -->

<div class="max-w-xs mx-auto"><Calendar /></div>
