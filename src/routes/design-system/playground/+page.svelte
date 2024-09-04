<script lang="ts">
	import { Calendar, Combobox } from '$lib/global-components';

	let items = [
		{ description: 'Kentaro Miura', title: 'Berserk', disabled: false },
		{ description: 'Hiromu Arakawa', title: 'Fullmetal Alchemist', disabled: false },
		{ description: 'Masashi Kishimoto', title: 'Naruto', disabled: true }
		// More items...
	];
</script>

<Combobox {items} />

<!-- <div class="max-w-xs mx-auto"><Calendar /></div> -->
