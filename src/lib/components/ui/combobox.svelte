<script lang="ts">
	import { createCombobox, melt, type ComboboxOptionProps } from '@melt-ui/svelte';
	import { Check, ChevronDown, ChevronUp } from '$lib/global-icons';
	import { fly } from 'svelte/transition';
	import { get } from 'svelte/store'; // Import `get` to retrieve store values

	type Manga = {
		author: string;
		title: string;
		disabled: boolean;
	};

	// Reactive state for mangas
	let mangas = $state<Manga[]>([
		{
			author: 'Kentaro Miura',
			title: 'Berserk',
			disabled: false
		},
		{
			author: 'ONE',
			title: 'Mob Psycho 100',
			disabled: false
		},
		{
			author: 'Hajime Isayama',
			title: 'Attack on Titan',
			disabled: false
		},
		{
			author: 'Junji Ito',
			title: 'Uzumaki',
			disabled: false
		},
		{
			author: 'Yomi Sarachi',
			title: 'Steins Gate',
			disabled: false
		},
		{
			author: 'Tite Kubo',
			title: 'Bleach',
			disabled: false
		},
		{
			author: 'Masashi Kishimoto',
			title: 'Naruto',
			disabled: true
		},
		{
			author: 'Katsura Hoshino',
			title: 'D.Gray Man',
			disabled: false
		},
		{
			author: 'Tsugumi Ohba',
			title: 'Death Note',
			disabled: false
		},
		{
			author: 'Hiromu Arakawa',
			title: 'Fullmetal Alchemist',
			disabled: false
		}
	]);

	// Convert each Manga to a ComboboxOptionProps
	const toOption = (manga: Manga): ComboboxOptionProps<Manga> => ({
		value: manga,
		label: manga.title,
		disabled: manga.disabled
	});

	// Setup combobox
	const {
		elements: { menu, input, option, label },
		states: { open, inputValue, touchedInput, selected },
		helpers: { isSelected }
	} = createCombobox<Manga>({
		forceVisible: true,
		portal: null // Disable portal to keep dropdown within the normal DOM flow
	});

	// Handle input value and assign value properly
	$effect(() => {
		selected.subscribe((value) => {
			if (open && value) {
				$inputValue = value.label ?? '';
			} else {
				$inputValue = '';
			}
		});
	});

	let filteredMangas = $state<Manga[]>(mangas);

	// Filter mangas based on the current input value
	$effect(() => {
		const inputVal = get(inputValue).toLowerCase(); // Get the current value of inputValue
		filteredMangas = get(touchedInput)
			? mangas.filter(({ title, author }) => {
					const normalizedInput = inputVal.toLowerCase();
					return (
						title.toLowerCase().includes(normalizedInput) ||
						author.toLowerCase().includes(normalizedInput)
					);
				})
			: mangas;
	});
</script>

<div class="flex flex-col gap-1">
	<!-- Ensure the label has a `for` attribute associated with the input -->
	<label use:melt={$label} for="manga-input">
		<span class="text-sm font-medium text-magnum-900">Choose your favorite manga:</span>
	</label>

	<div class="relative">
		<!-- Ensure the input has an `id` -->
		<input
			id="manga-input"
			use:melt={$input}
			class="flex h-10 items-center justify-between rounded-lg bg-white px-3 pr-12 text-black"
			placeholder="Best book ever"
		/>
		<div class="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-magnum-900">
			{#if $open}
				<ChevronUp class="size-4" />
			{:else}
				<ChevronDown class="size-4" />
			{/if}
		</div>
	</div>
</div>

{#if $open}
	<ul
		class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-lg"
		use:melt={$menu}
		transition:fly={{ duration: 150, y: -5 }}
	>
		<div class="flex max-h-full flex-col gap-0 overflow-y-auto bg-white px-2 py-2 text-black">
			{#each filteredMangas as manga, index (index)}
				<li
					use:melt={$option(toOption(manga))}
					class="relative cursor-pointer scroll-my-2 rounded-md py-2 pl-4 pr-4 hover:bg-magnum-100 data-[highlighted]:bg-magnum-200 data-[highlighted]:text-magnum-900 data-[disabled]:opacity-50"
				>
					{#if $isSelected(manga)}
						<div class="check absolute left-2 top-1/2 z-10 text-magnum-900">
							<Check class="size-4" />
						</div>
					{/if}
					<div class="pl-4">
						<span class="font-medium">{manga.title}</span>
						<span class="block text-sm opacity-75">{manga.author}</span>
					</div>
				</li>
			{:else}
				<li class="relative cursor-pointer rounded-md py-1 pl-8 pr-4">No results found</li>
			{/each}
		</div>
	</ul>
{/if}

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}

	ul {
		@apply m-0;
	}
</style>
