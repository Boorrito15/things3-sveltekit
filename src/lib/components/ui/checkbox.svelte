<script lang="ts">
	import { createCheckbox, melt } from '@melt-ui/svelte';
	import Minus from 'virtual:icons/mdi/remove';
	import Check from 'virtual:icons/mdi/check';

	const {
		elements: { root, input },
		helpers: { isChecked, isIndeterminate }
	} = createCheckbox({
		defaultChecked: 'indeterminate'
	});
</script>

<form>
	<button
		use:melt={$root}
		class="flex items-center justify-center bg-white rounded-lg shadow appearance-none size-7 text-magnum-600 hover:opacity-75"
		id="checkbox"
	>
		{#if $isIndeterminate}
			<Minus class="size-5" />
		{:else if $isChecked}
			<Check class="size-5" />
		{/if}
		<input use:melt={$input} />
	</button>
</form>
