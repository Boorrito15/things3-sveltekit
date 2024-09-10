<script lang="ts">
	import { createCheckbox, melt } from '@melt-ui/svelte';
	import Minus from 'virtual:icons/mdi/remove';
	import Check from 'virtual:icons/mdi/check';

	const {
		elements: { root, input },
		helpers: { isChecked }
	} = createCheckbox({});
</script>

<form>
	<button
		use:melt={$root}
		class="mx-auto flex items-center justify-center rounded-sm appearance-none text-white hover:opacity-75 ease-in duration-100 transform transition-all {$isChecked
			? 'bg-blue-500'
			: 'border border-slate-300'}"
		id="checkbox"
		style="width: 0.75rem; height: 0.75rem;"
	>
		{#if $isChecked}
			<Check class="w-6 h-6" />
		{/if}
		<input use:melt={$input} style="display: none;" />
		<!-- Hide the input for accessibility -->
	</button>
</form>

<style>
	/* On mousedown, the button will grow in size */
	button:active {
		transform: scale(1.5); /* Increase size on click */
		transition: transform 0.2s ease; /* Smooth transition */
	}
</style>
