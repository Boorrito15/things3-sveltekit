<script lang="ts">
	import { createTagsInput, melt } from '@melt-ui/svelte';
	import { X } from '$lib/global-icons';

	const {
		elements: { root, input, tag, edit },
		states: { tags }
	} = createTagsInput({
		// defaultTags: ['Svelte', 'Typescript'],
		unique: true,
		add(tag) {
			return { id: tag, value: tag };
		},
		addOnPaste: true
	});
</script>

<div class="flex flex-col items-start justify-center gap-2">
	<div
		use:melt={$root}
		class="flex min-w-24 flex-row flex-wrap gap-2.5 px-1 bg-[#F0F1F3] h-fit items-center text-sm"
	>
		{#each $tags as t}
			<div
				use:melt={$tag(t)}
				class="flex items-stretch overflow-hidden rounded-xl bg-[#C3E1D3] text-[#1D7D58] text-sm [word-break:break-word] data-[disabled]:bg-magnum-300 data-[selected]:bg-[#5C9AFE] data-[selected]:text-white data-[disabled]:hover:cursor-default data-[disabled]:focus:!outline-none data-[disabled]:focus:!ring-0"
			>
				<span class="flex items-center border-r border-white/10 px-1.5">{t.value}</span>
				<!-- <button
					use:melt={$deleteTrigger(t)}
					class="flex items-center px-1 enabled:hover:bg-[#7ab89b] data-[selected]:hover:bg-[#2c7dff]"
				>
					<X class="size-4" />
				</button> -->
			</div>
			<div
				use:melt={$edit(t)}
				class="flex items-center overflow-hidden rounded-md px-1.5 [word-break:break-word] data-[invalid-edit]:focus:!ring-red-500 h-fit data-[invalid-edit]:focus:!outline-none focus:outline-none focus:ring-0"
			></div>
		{/each}

		<input
			use:melt={$input}
			type="text"
			placeholder="Enter tags..."
			class="min-w-[3rem] bg-transparent shrink grow basis-0 border-0 text-black outline-none focus:!ring-0 data-[invalid]:text-red-500"
		/>
	</div>
</div>

<style>
	input[type='text'],
	input[type='text']:focus {
		background: none;
		outline: none;
		outline-offset: none;
		border: none;
	}
</style>
