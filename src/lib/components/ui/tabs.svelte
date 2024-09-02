<script lang="ts">
	import { cn } from '$lib/utils';
	import { createTabs, melt } from '@melt-ui/svelte';
	import { cubicInOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { toStore } from 'svelte/store';

	// Define the interface for the props
	interface TabsProps {
		triggers?: Array<{ id: string; title: string }>;
		loop?: boolean;
		activateOnFocus?: boolean;
		orientation?: 'horizontal' | 'vertical';
		autoSet?: boolean;
		defaultValue?: string;
	}

	// Destructure props with default values
	let {
		triggers = [
			{ id: 'tab-1', title: 'Account' },
			{ id: 'tab-2', title: 'Password' },
			{ id: 'tab-3', title: 'Settings' }
		],
		loop = false,
		activateOnFocus = true,
		orientation = 'vertical',
		autoSet = true,
		defaultValue = triggers[0]?.id
	}: TabsProps = $props();

	// Using $state to manage tab value
	let tabValueState = $state(defaultValue);

	// Convert reactive state to a store using toStore
	const tabValueStore = toStore(
		() => tabValueState,
		(v) => (tabValueState = v)
	);

	// Pass the store to createTabs
	const {
		elements: { root, list, content, trigger },
		states: { value }
	} = createTabs({
		defaultValue,
		autoSet,
		loop,
		activateOnFocus,
		orientation,
		value: tabValueStore // Use the store created from reactive state
	});

	let className = $state('');
	export { className as class };

	const [send, receive] = crossfade({
		duration: 250,
		easing: cubicInOut
	});
</script>

<div
	use:melt={$root}
	class={cn(
		'flex max-w-[25rem] flex-col overflow-hidden rounded-xl shadow-lg data-[orientation=vertical]:flex-row',
		className
	)}
>
	<div
		use:melt={$list}
		class="flex shrink-0 overflow-x-auto bg-neutral-100 data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-r"
		aria-label="Manage your account"
	>
		{#each triggers as triggerItem}
			<button
				use:melt={$trigger(triggerItem.id)}
				class="relative flex items-center justify-center flex-1 h-12 px-2 text-neutral-900 font-medium leading-none bg-neutral-100 cursor-default select-none focus:relative focus-visible:z-10 focus-visible:ring-2 data-[state='active']:bg-white data-[state='active']:text-magnum-900"
			>
				{triggerItem.title}
				{#if $value === triggerItem.id}
					<div
						in:send={{ key: 'trigger' }}
						out:receive={{ key: 'trigger' }}
						class="absolute w-6 h-1 -translate-x-1/2 rounded-full bg-magnum-400 bottom-1 left-1/2"
					></div>
				{/if}
			</button>
		{/each}
	</div>

	<div use:melt={$content('tab-1')} class="p-5 bg-white grow">
		<p class="mb-5 leading-normal text-neutral-900">
			Make changes to your account here. Click save when you're done.
		</p>
		<fieldset class="flex flex-col justify-start w-full mb-4">
			<label class="block mb-2.5 text-sm leading-none text-neutral-900" for="name"> Name </label>
			<input
				id="name"
				value="Thomas G. Lopes"
				class="h-8 flex-shrink-0 flex-grow border rounded-md border-neutral-200 px-2.5 leading-none text-neutral-900 focus:border-magnum-400"
			/>
		</fieldset>

		<div class="flex justify-end mt-5">
			<button
				class="inline-flex items-center justify-center h-8 px-4 font-semibold leading-none transition rounded-md cursor-default text-magnum-900 bg-magnum-200 hover:opacity-75 focus:ring-green-600"
			>
				Save changes
			</button>
		</div>
	</div>

	<div use:melt={$content('tab-2')} class="p-5 bg-white grow">
		<p class="mb-5 leading-normal text-neutral-900">
			Change your password here. Click save when you're done.
		</p>
		<fieldset class="flex flex-col justify-start w-full mb-4">
			<label class="block mb-2.5 text-sm leading-none text-neutral-900" for="newPassword">
				New password
			</label>
			<input
				id="newPassword"
				type="password"
				class="h-8 flex-shrink-0 flex-grow border rounded-md border-neutral-200 px-2.5 leading-none text-neutral-900 focus:border-magnum-400"
			/>
		</fieldset>
		<div class="flex justify-end mt-5">
			<button
				class="inline-flex items-center justify-center h-8 px-4 font-semibold leading-none transition rounded-md cursor-default text-magnum-900 bg-magnum-200 hover:opacity-75 focus:ring-green-600"
			>
				Save changes
			</button>
		</div>
	</div>

	<div use:melt={$content('tab-3')} class="p-5 bg-white grow">
		<p class="mb-5 leading-normal text-neutral-900">
			Change your settings here. Click save when you're done.
		</p>

		<fieldset class="flex flex-col justify-start w-full mb-4">
			<label class="block mb-2.5 text-sm leading-none text-neutral-900" for="newEmail">
				New email
			</label>
			<input
				id="newEmail"
				type="email"
				class="h-8 flex-shrink-0 flex-grow border rounded-md border-neutral-200 px-2.5 leading-none text-neutral-900 focus:border-magnum-400"
			/>
		</fieldset>
		<div class="flex justify-end mt-5">
			<button
				class="inline-flex items-center justify-center h-8 px-4 font-semibold leading-none transition rounded-md cursor-default text-magnum-900 bg-magnum-200 hover:opacity-75 focus:ring-green-600"
			>
				Save changes
			</button>
		</div>
	</div>
</div>
