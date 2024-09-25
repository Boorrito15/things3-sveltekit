<script lang="ts">
	import { createCombobox, createTagsInput, melt, type ComboboxOption } from '@melt-ui/svelte';
	import { Check, ChevronDown, ChevronUp, X } from '$lib/global-icons';
	import { fly } from 'svelte/transition';

	type Tag = {
		id: string;
		value: string;
	};

	let existingTags = $state(['Svelte', 'TypeScript', 'JavaScript', 'HTML', 'CSS']);

	const {
		elements: { root: tagsRoot, input: tagsInput, tag, deleteTrigger },
		states: { tags }
	} = createTagsInput({
		unique: true,
		add(tagValue) {
			return { id: tagValue, value: tagValue };
		},
		addOnPaste: true
	});

	const {
		elements: { menu, input: comboboxInput, option, label },
		states: { open, inputValue, selected },
		helpers: { isSelected }
	} = createCombobox<Tag>({
		forceVisible: true
	});

	$effect(() => {
		if (!$open) {
			$inputValue = '';
		}
	});

	const filteredTags = $derived(
		$inputValue
			? existingTags.filter((tag) => tag.toLowerCase().includes($inputValue.toLowerCase()))
			: existingTags
	);

	function handleTagSelection(tagValue: string) {
		if (!$tags.some((t) => t.value === tagValue)) {
			$tags = [...$tags, { id: tagValue, value: tagValue }];
		}
		$inputValue = '';
		$open = false;
	}

	function createNewTag() {
		if ($inputValue && !existingTags.includes($inputValue)) {
			existingTags = [...existingTags, $inputValue];
			handleTagSelection($inputValue);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			if ($selected) {
				handleTagSelection($selected.value.value);
			} else if ($inputValue) {
				createNewTag();
			}
		} else if (event.key === 'Backspace' && $inputValue === '' && $tags.length > 0) {
			const lastTag = $tags[$tags.length - 1];
			$tags = $tags.map((t) =>
				t === lastTag ? { ...t, selected: true } : { ...t, selected: false }
			);
		}
	}

	function handleOptionClick(tag: string) {
		handleTagSelection(tag);
	}
</script>

<div class="flex flex-col gap-2">
	<label use:melt={$label}>
		<span class="text-sm font-medium text-magnum-900">Enter tags:</span>
	</label>

	<div use:melt={$tagsRoot} class="flex min-w-24 flex-wrap gap-2.5 rounded-lg bg-[#F0F1F3] p-2">
		{#each $tags as t}
			<div
				use:melt={$tag(t)}
				class="flex items-center rounded-xl bg-[#C3E1D3] text-[#1D7D58] text-sm
                       data-[selected]:bg-[#5C9AFE] data-[selected]:text-white"
			>
				<span class="px-2">{t.value}</span>
				<button
					use:melt={$deleteTrigger(t)}
					class="flex items-center px-1 hover:bg-[#7ab89b] data-[selected]:hover:bg-[#2c7dff]"
				>
					<X class="size-4" />
				</button>
			</div>
		{/each}

		<div class="relative flex-grow">
			<input
				use:melt={$comboboxInput}
				use:melt={$tagsInput}
				type="text"
				placeholder="Type to add tags..."
				class="w-full min-w-[8rem] bg-transparent p-1 text-black outline-none"
				on:keydown={handleKeydown}
			/>
			<div class="absolute right-2 top-1/2 -translate-y-1/2 text-magnum-900">
				{#if $open}
					<ChevronUp class="size-4" />
				{:else}
					<ChevronDown class="size-4" />
				{/if}
			</div>
		</div>
	</div>
</div>

{#if $open}
	<ul
		use:melt={$menu}
		class="z-10 mt-1 max-h-[300px] w-full overflow-auto rounded-lg bg-white shadow-md m-0"
		transition:fly={{ duration: 150, y: -5 }}
	>
		{#each filteredTags as tag}
			<li
				use:melt={$option({ value: { id: tag, value: tag }, label: tag })}
				on:click={() => handleOptionClick(tag)}
				class="cursor-pointer px-4 py-2 hover:bg-magnum-100 data-[highlighted]:bg-magnum-200"
			>
				{#if $isSelected({ id: tag, value: tag })}
					<Check class="mr-2 inline-block size-4" />
				{/if}
				{tag}
			</li>
		{/each}
		{#if $inputValue && !filteredTags.includes($inputValue)}
			<li
				use:melt={$option({ value: { id: $inputValue, value: $inputValue }, label: $inputValue })}
				on:click={createNewTag}
				class="cursor-pointer px-4 py-2 italic text-magnum-600 hover:bg-magnum-100 data-[highlighted]:bg-magnum-200"
			>
				Create "{$inputValue}"
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
