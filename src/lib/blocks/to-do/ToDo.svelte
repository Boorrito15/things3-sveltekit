<script lang="ts">
	// Import statements
	import { Checkbox, Popover } from '$lib/global-components';
	import { tick } from 'svelte';
	import { Calendar, Tag, Checklist, Flag } from '$lib/global-icons';
	import Datepicker from './Datepicker.svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	/**
	 * * INTERFACES
	 */

	// Tag interface: Defines the structure for tags.
	interface Tags {
		id: number;
		name: string;
		color?: string;
		description?: string;
	}

	// ChecklistItem interface: Defines a checklist item's properties.
	interface ChecklistItem {
		id: number;
		name: string;
		completed: boolean;
	}

	// Task interface: Defines the structure for a task, including optional dates, priority, etc.
	interface Task {
		id: number;
		name: string;
		notes?: string;
		selected?: boolean;
		expanded?: boolean;
		completed?: false;
		when?: Date; // When the task is due
		dueDate?: Date; // Task deadline
		tags?: Tag[];
		priority?: 'low' | 'medium' | 'high';
		checklist?: ChecklistItem[];
	}

	/**
	 * * PROPS AND STATE VARIABLES
	 */

	// Props: task, onSelect, and onDelete are passed from parent.
	let { task, onSelect, onDelete } = $props<{
		task: Task;
		onSelect: (taskId: number) => void;
		onDelete: (taskId: number) => void;
	}>();

	// State variables
	let taskRef = $state<HTMLElement | null>(null); // Reference to task element.
	let inputRef = $state<HTMLInputElement | null>(null); // Reference to task name input field.
	let isPopoverOpen = $state(false); // Manages the popover state (open/closed).
	let editedTaskName = $state(task.name); // Holds the current task name for editing.

	/**
	 * * FUNCTIONS
	 */

	// Update the 'when' date for the task
	function updateWhen(date: Date | null) {
		task.when = date;
		console.log('Updated Task When:', task.when);
	}

	// Toggle task selection
	function selectTask() {
		onSelect(task.id); // Notify parent that the task was selected.
	}

	// Expand the task to enable editing
	function editTask() {
		if (!task.expanded) {
			task.expanded = true;
			tick().then(() => {
				if (inputRef) {
					inputRef.focus();
				}
			});
		}
	}

	// Mark the task as completed
	function completeTask() {
		task.completed = true;
		console.log(task.name, 'completed');
	}

	// Delete the task
	function deleteTask() {
		onDelete(task.id);
	}

	// Handle popover state changes (open/close)
	function handlePopoverOpenChange(isOpen: boolean) {
		isPopoverOpen = isOpen;
	}

	function formatDate(date: Date): string {
		const today = dayjs().startOf('day');
		const targetDate = dayjs(date).startOf('day');
		const daysDiff = targetDate.diff(today, 'day');
		if (date) {
			if (daysDiff === 0) return 'Today';
			if (daysDiff === 1) return 'Tomorrow';
			if (daysDiff >= 2 && daysDiff <= 5) return `${targetDate.format('dddd')}`;
			if (targetDate.year() === today.year()) return targetDate.format('ddd, D MMM');
			return targetDate.format('D MMM YYYY');
		}
		return '';
	}

	function deleteWhen() {
		task.when = null;
	}

	/**
	 * * EFFECTS
	 */

	// Auto-focus on input when task is expanded
	$effect(() => {
		if (task.expanded && inputRef) {
			inputRef.focus();
		}
	});

	// Handle clicks outside the task or popover, to collapse/close them
	$effect(() => {
		if (task.expanded || task.selected) {
			const handleClickOutside = (event: MouseEvent) => {
				const popoverElements = document.querySelectorAll('[data-melt-popover-content]');
				const clickedInsidePopover = Array.from(popoverElements).some((el) =>
					el.contains(event.target as Node)
				);

				if (clickedInsidePopover) return;

				if (taskRef && !taskRef.contains(event.target as Node)) {
					if (isPopoverOpen) {
						console.log('closing popover');
						isPopoverOpen = false;
					} else {
						console.log('closing task');
						task.selected = false;
						task.expanded = false;
					}
				}
			};

			document.addEventListener('mousedown', handleClickOutside);

			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}
	});

	/**
	 * * ICON CONFIGURATION
	 */

	// Icon setup: Defines icons used for different task features.
	const icons = {
		calendar: {
			svg: Calendar,
			message: 'When',
			content: Datepicker
		},
		tag: {
			svg: Tag,
			message: 'Tags',
			content: null
		},
		checklist: {
			svg: Checklist,
			message: 'Add checklist',
			content: null
		},
		flag: {
			svg: Flag,
			message: 'Deadline',
			content: Calendar
		}
	};
</script>

<div
	class="task-container {task.expanded ? 'expanded' : ''} {task.selected ? 'selected' : ''}"
	bind:this={taskRef}
	role="button"
	tabindex="0"
	onmousedown={selectTask}
	ondblclick={editTask}
	onkeydown={(event) => {
		if (event.key === 'Enter') editTask();
	}}
>
	<div class="task-content">
		<div>
			<div class="task-header">
				<div class="mr-2">
					<Checkbox on:click={completeTask} />
				</div>
				{#if task.when && !task.expanded}
					<small class="px-2 rounded-md bg-[#E6E8EC] mr-1 leading-5 font-light"
						>{formatDate(task.when)}</small
					>
				{/if}
				{#if task.expanded}
					<!-- Bind the input value to editableName -->
					<input class="task-text" bind:this={inputRef} bind:value={editedTaskName} />
				{:else}
					<!-- Display the current value of editableName -->
					<p class="task-text" data-placeholder="New To-Do...">{editedTaskName}</p>
				{/if}
				<button class="h-full flex items-center" onclick={deleteTask}
					><span class="material-symbols-outlined"> backspace </span></button
				>
			</div>
			<div class="notes-container">
				{#if task.expanded}
					<textarea
						name="task-notes"
						class="task-notes-input"
						placeholder="Notes"
						bind:value={task.notes}
						rows="1"
					></textarea>
				{:else}
					<p class="task-notes-collapsed">{task.notes || ''}</p>
				{/if}
			</div>
		</div>
		{#if task.expanded}
			<div class="flex items-center {task.when ? 'justify-between' : 'justify-end'}">
				{#if task.when}
					<div
						class="flex ml-6 border-transparent border pl-1 rounded-md transition-all duration-150 ease-in-out hover:border hover:border-gray-200 leading-none items-center space-x-2"
					>
						<Popover onOpenChange={handlePopoverOpenChange}>
							{#snippet triggerElement()}
								{@const TriggerElement = formatDate(task.when)}
								<p class="leading-3">🗓️ {TriggerElement}</p>
							{/snippet}
							{#snippet contentBlock()}
								{@const ContentComponent = Datepicker}
								<div style="width: 300px">
									<Datepicker onDateSelected={updateWhen} />
								</div>
							{/snippet}
						</Popover>
						<!-- <p class="leading-none">
							🗓️ {formatDate(task.when)}
						</p> -->
						<div onclick={deleteWhen} class="hover:bg-gray-200 p-0.5 rounded-sm">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="0.5"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-x"
								><path d="M18 6 6 18" /><path d="m6 6 12 12" />
							</svg>
						</div>
					</div>
				{/if}

				<div class="flex justify-end space-x-3">
					{#each Object.entries(icons) as [key, icon]}
						{#if !(key === 'calendar' && task.when)}
							<div
								class="border-transparent border p-0.5 rounded-sm transition-all duration-150 ease-in-out hover:border hover:border-black opacity-40"
							>
								<Popover message={icon.message} onOpenChange={handlePopoverOpenChange}>
									{#snippet triggerElement()}
										{@const TriggerElement = icon.svg}
										<TriggerElement class="size-4" />
									{/snippet}
									{#snippet contentBlock()}
										{@const ContentComponent = icon.content}
										<div style="width: 300px">
											{#if ContentComponent == Datepicker}
												<Datepicker onDateSelected={updateWhen} />
											{/if}
										</div>
									{/snippet}
								</Popover>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	/* General Task Container */
	.task-container {
		padding: 0 0.5rem 0 0.5rem; /* Add initial padding on the left */
		border-radius: 5px;
		overflow: hidden;
		cursor: pointer;
		background-color: transparent;
		width: 99.5%;
		margin: 0;
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column; /* Make the task-container a flex container */
	}

	/* When the task is selected */
	.task-container.selected {
		background-color: #cae2ff;
	}

	/* When the task is expanded */
	.task-container.expanded {
		background-color: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
		margin: 2rem 0;
		padding: 1rem calc(0.5rem + 0.25%); /* Keep the left padding the same */
		height: auto; /* Ensure the height is dynamic */
		min-height: 9rem; /* Add a minimum height to the expanded task */
	}

	/* Task Content */
	.task-content {
		display: flex;
		flex-direction: column;
		flex-grow: 1; /* Ensure the task-content takes the full height */
		justify-content: space-between; /* Space out the content vertically */
		position: relative;
		height: 100%;
	}

	/* Task Header */
	.task-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 28px;
	}

	.task-text {
		flex-grow: 1;
	}

	.task-text:empty::before {
		content: attr(data-placeholder);
		color: #999;
	}

	/* Notes Container */
	.notes-container {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.5s ease;
		width: 100%;
		overflow: hidden;
	}

	.task-container.expanded .notes-container {
		grid-template-rows: 1fr;
	}

	/* Task Notes */
	.task-notes-input {
		margin-left: 1.75rem; /* Match margin with .task-text */
		border: none;
		box-sizing: border-box;
		outline: none;
		background: none;
		overflow: hidden;
		resize: none;
		transition: height 0.3s ease;
		height: auto;
		min-height: 2rem;
	}

	.task-notes-collapsed {
		margin-left: 1.75rem; /* Match margin with .task-text */
		white-space: pre-wrap;
		color: #555;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	textarea {
		height: auto;
		min-height: 2rem;
		field-sizing: content;
	}

	input {
		background: none;
		outline: none;
		outline-offset: none;
	}
</style>
