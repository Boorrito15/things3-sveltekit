<script lang="ts">
	import { createCombobox, createTagsInput, melt, type ComboboxOption } from '@melt-ui/svelte';
	import { ChevronDown, ChevronUp, X, TagIcon } from '$lib/global-icons';
	import { fly } from 'svelte/transition';

	type Tag = {
		id: string;
		value: string;
	};

	let existingTags = $state(['Svelte', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'React']);

	const {
		elements: { root: tagsRoot, input: tagsInput, tag, deleteTrigger },
		states: { tags }
	} = createTagsInput({
		unique: true,
		add: (tagValue) => ({ id: tagValue, value: tagValue }),
		addOnPaste: true
	});

	const {
		elements: { menu, input: comboboxInput, option, label },
		states: { open, inputValue, selected },
		helpers: { isSelected }
	} = createCombobox<Tag>({ forceVisible: true });

	$effect(() => {
		if (!$open) $inputValue = '';
	});

	const filteredTags = $derived(
		existingTags.filter((tag) => {
			const normalizedTag = tag.toLowerCase();
			const normalizedInput = $inputValue.toLowerCase();
			const isNotSelected = !$tags.some((t) => t.value.toLowerCase() === normalizedTag);
			return $inputValue ? normalizedTag.includes(normalizedInput) && isNotSelected : isNotSelected;
		})
	);

	function handleTagSelection(value: string) {
		// console.log('handleTagSelection called with:', value);
		const normalizedValue = value.toLowerCase();
		if (!$tags.some((t) => t.value.toLowerCase() === normalizedValue)) {
			if (!existingTags.includes(value)) {
				existingTags = [...existingTags, value];
			}
			$tags = [...$tags, { id: value, value: value }];
		}
		// console.log('Updated tags:', $tags);
		$inputValue = '';
		$open = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			if ($selected) {
				handleTagSelection($selected.value);
				console.log($selected.value);
			}
		} else if (event.key === 'Backspace' && $inputValue === '' && $tags.length > 0) {
			$tags = $tags.map((t, index) =>
				index === $tags.length - 1 ? { ...t, selected: true } : { ...t, selected: false }
			);
		}
	}
</script>

<div>
	<div use:melt={$tagsRoot} class="flex min-w-24 flex-wrap gap-2 rounded-lg px-2.5">
		{#each $tags as t}
			<div
				use:melt={$tag(t)}
				class="my-auto flex h-fit items-center rounded-xl bg-[#C3E1D3] text-sm text-[#1D7D58] data-[selected]:bg-[#5C9AFE] data-[selected]:text-white"
			>
				<span class="px-2">{t.value}</span>
				<!-- <button
					use:melt={$deleteTrigger(t)}
					class="flex items-center px-1 hover:bg-[#7ab89b] data-[selected]:hover:bg-[#2c7dff]"
				>
					<X class="size-4" />
				</button> -->
			</div>
		{/each}

		<div class="relative flex-grow">
			<input
				use:melt={$comboboxInput}
				use:melt={$tagsInput}
				type="text"
				placeholder="Type to add tags..."
				class="w-full min-w-[8rem] bg-transparent p-1 text-black outline-none"
				onkeydown={handleKeydown}
			/>
			<!-- <div class="absolute right-2 top-1/2 -translate-y-1/2 text-magnum-900">
				{#if $open}
					<ChevronUp class="size-4" />
				{:else}
					<ChevronDown class="size-4" />
				{/if}
			</div> -->
		</div>
	</div>
</div>

{#if $open}
	<ul
		use:melt={$menu}
		class="z-10 m-0 mt-1 max-h-[300px] w-full overflow-auto rounded-lg bg-white text-sm shadow-md"
		transition:fly={{ duration: 150, y: -5 }}
	>
		{#each filteredTags as tag}
			<li
				use:melt={$option({ value: tag, label: tag })}
				onclick={() => {
					console.log('Clicked tag:', tag);
					handleTagSelection(tag);
				}}
				class="cursor-pointer px-4 py-2 hover:bg-magnum-100 data-[highlighted]:bg-magnum-200"
			>
				<span class="inline-block align-middle">
					<TagIcon class="mr-2 size-3" />
				</span>
				<span class="inline-block align-middle">{tag}</span>
			</li>
		{/each}

		{#if $inputValue && !filteredTags.includes($inputValue) && !$tags.some((t) => t.value.toLowerCase() === $inputValue.toLowerCase())}
			<li
				use:melt={$option({ value: $inputValue, label: $inputValue })}
				onclick={() => {
					handleTagSelection($selected.value);
				}}
				class="cursor-pointer px-4 py-2 text-[#5496FD] hover:bg-magnum-100 data-[highlighted]:bg-magnum-200"
			>
				<span class="inline-block align-middle">
					<TagIcon class="mr-2 size-3" />
				</span>
				<span class="inline-block align-middle">New Tag "{$inputValue}"</span>
			</li>
		{/if}
	</ul>
{/if}

<style>
	input[type='text'],
	input[type='text']:focus {
		background: none;
		outline: none;
		outline-offset: none;
		border: none;
	}
</style>
