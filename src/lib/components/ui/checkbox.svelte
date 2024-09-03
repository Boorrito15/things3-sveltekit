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
		class="flex items-center justify-center bg-white rounded-sm shadow appearance-none size-3 text-white hover:opacity-75 ease-in duration-100 transform active:scale-105"
		id="checkbox"
	>
		{#if $isChecked}
			<Check
				class="size-3 bg-[#1C61C2] rounded-sm ease-in duration-100 transform active:scale-105"
			/>
		{/if}
		<input use:melt={$input} />
	</button>
</form>
