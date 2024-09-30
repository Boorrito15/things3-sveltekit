<script lang="ts">
	import { createCombobox, createTagsInput, melt, type ComboboxOption } from '@melt-ui/svelte';
	import { ChevronDown, ChevronUp, X, TagIcon } from '$lib/global-icons';
	import { fly } from 'svelte/transition';
	import { addNewTask } from '$lib/utils/taskUtils';

	type Tag = {
		id: string;
		value: string;
	};

	let existingOptions = $state(['Svelte', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'React']);

	let { initialTags = [], onTagSelected } = $props<{
		initialTags?: Tag[];
		onTagSelected?: (tag: Tag | null) => void;
	}>();

	console.log(initialTags);

	const {
		elements: { root: tagsRoot, input: tagsInput, tag, deleteTrigger },
		states: { tags }
	} = createTagsInput({
		unique: true,
		add: (tagValue) => ({ id: tagValue, value: tagValue }),
		addOnPaste: true,
		defaultTags: initialTags.map((tag: Tag) => tag.value), // Initialize with task.tags (from initialTags prop)
		onTagsChange: ({ next }) => {
			console.log('tags changed', next);
			return next;
		}
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
		existingOptions.filter((tag) => {
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
			if (!existingOptions.includes(value)) {
				existingOptions = [...existingOptions, value];
			}
			$tags = [...$tags, { id: value, value: value }];
		}
		console.log('Updated tags:', $tags);
		console.log(value, 'tag selected');

		if (onTagSelected) {
			onTagSelected({ id: value, value: value }); // Notify parent with the selected tag object
		}
		$inputValue = '';
		$open = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			if ($selected) {
				let selectedValue = $selected.value as unknown as string;
				handleTagSelection(selectedValue);
			}
		} else if (event.key === 'Backspace' && $inputValue === '' && $tags.length > 0) {
			$tags = $tags.map((t, index) =>
				index === $tags.length - 1 ? { ...t, selected: true } : { ...t, selected: false }
			);
		}
	}
</script>

<div>
	<div
		use:melt={$tagsRoot}
		class="flex flex-wrap gap-1 rounded-lg {$tags.length === 0 ? 'p-1' : ''}"
	>
		{#each $tags as t}
			<div
				use:melt={$tag(t)}
				class="my-auto flex items-center rounded-xl bg-[#C3E1D3] text-sm text-[#1D7D58] data-[selected]:bg-[#5C9AFE] data-[selected]:text-white"
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

		<div class="w-fit flex-grow">
			<input
				use:melt={$comboboxInput}
				use:melt={$tagsInput}
				type="text"
				placeholder={$tags.length === 0 ? 'Type to add tags...' : ''}
				class="{$tags.length === 0
					? ''
					: ''}px-1 h-max w-max bg-transparent text-black outline-none"
				onkeydown={handleKeydown}
			/>
		</div>
	</div>
</div>

{#if $open}
	<ul
		use:melt={$menu}
		class="z-10 m-0 mt-1 max-h-[300px] w-auto overflow-auto rounded-lg bg-black p-2 text-sm text-white shadow-md"
		transition:fly={{ duration: 150, y: -5 }}
	>
		{#each filteredTags as tag}
			<li
				use:melt={$option({ value: tag, label: tag })}
				onclick={() => {
					handleTagSelection(tag);
				}}
				class="m-0 cursor-pointer rounded-md px-1 py-1 hover:bg-[#5C9AFF] data-[highlighted]:bg-[#5C9AFF]"
			>
				<span class="inline-block align-middle">
					<TagIcon class="mr-1 size-3" />
				</span>
				<span class="inline-block align-middle">{tag}</span>
			</li>
		{/each}

		{#if $inputValue && !filteredTags.includes($inputValue) && !$tags.some((t) => t.value.toLowerCase() === $inputValue.toLowerCase())}
			<li
				use:melt={$option({ value: $inputValue, label: $inputValue })}
				onclick={() => {
					if ($selected && $selected.value) {
						handleTagSelection($inputValue);
					}
				}}
				class="m-0 cursor-pointer rounded-md px-1 py-1 hover:bg-[#5C9AFF] data-[highlighted]:bg-[#5C9AFF]"
			>
				<span class="inline-block align-middle">
					<TagIcon class="mr-1 size-3" />
				</span>
				<span class="inline-blockalign-middle">New Tag </span>
				<span class=" max-w-full whitespace-normal break-words">"{$inputValue}"</span>
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
		height: fit-content;
	}
</style>
