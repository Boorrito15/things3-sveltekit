<script lang="ts">
	// Import statements
	import { Popover } from '$lib/global-components';
	import { tick } from 'svelte';
	import { Calendar, TagIcon, Checklist, Flag } from '$lib/global-icons';
	import Datepicker from './Datepicker.svelte';
	import TagCombobox from './TagCombobox.svelte';
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
		completed?: boolean;
		when?: string; // When the task is due
		dueDate?: Date; // Task deadline
		tags?: Tags[];
		priority?: 'low' | 'medium' | 'high';
		checklist?: ChecklistItem[];
	}

	/**
	 * * PROPS AND STATE VARIABLES
	 */

	// Props: task, onSelect, and onDelete are passed from parent.
	let { task, onSelect, onDelete, onUpdate, onComplete } = $props<{
		task: Task;
		onSelect: (taskId: number) => void;
		onDelete: (taskId: number) => void;
		onUpdate: (updatedTask: Task) => void;
		onComplete: (taskId: number, completed: boolean) => void;
	}>();

	// Instead, use local state variables:
	let isCompleted = $state(task.completed ?? false);
	let isSelected = $state(task.selected ?? false);
	let isExpanded = $state(task.expanded ?? false);
	let editedTaskName = $state(task.name);
	let editedNotes = $state(task.notes ?? '');

	// State variables
	let taskRef = $state<HTMLElement | null>(null); // Reference to task element.
	let inputRef = $state<HTMLInputElement | null>(null); // Reference to task name input field.
	let isPopoverOpen = $state(false); // Manages the popover state (open/closed).

	/**
	 * * FUNCTIONS
	 */

	// Update the 'when' date for the task
	function updateWhen(date: Date | null) {
		onUpdate({ ...task, when: date });
	}

	function updateTag(tag: Tags | null) {
		console.log('Updated tags:', tag);
		onUpdate({
			...task,
			tags: [...task.tags, tag] // Ensure the property is 'tags' (lowercase 't')
		});
	}

	// Toggle task selection
	function selectTask() {
		onSelect(task.id); // Notify parent that the task was selected.
		isSelected = true;
	}

	// Expand the task to enable editing
	function editTask() {
		if (!isExpanded) {
			isExpanded = true;
			onUpdate({ ...task, expanded: true });
			tick().then(() => {
				if (inputRef) {
					inputRef.focus();
				}
			});
		}
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

	function formatDateTime(date: Date): string {
		const formattedDate = formatDate(date);
		const formattedTime = dayjs(date).format('h:mm A');
		if (formattedTime === '12:00 AM') {
			return formattedDate;
		}
		return `${formattedDate} at ${formattedTime}`;
	}

	function deleteWhen() {
		onUpdate({ ...task, when: null });
	}

	function updateTask() {
		onUpdate({
			...task,
			name: editedTaskName,
			notes: editedNotes,
			expanded: isExpanded
		});
	}

	const toggleComplete = () => {
		if (!isCompleted) {
			isCompleted = true;
			setTimeout(() => {
				onComplete(task.id, true);
			}, 700);
		} else {
			isCompleted = false;
			onComplete(task.id, false);
		}
	};

	/**
	 * * EFFECTS
	 */

	// Auto-focus on input when task is expanded
	$effect(() => {
		if (isExpanded && inputRef) {
			inputRef.focus();
		}
	});

	// Handle clicks outside the task or popover, to collapse/close them
	$effect(() => {
		if (isExpanded || isSelected) {
			const handleClickOutside = (event: MouseEvent) => {
				const popoverElements = document.querySelectorAll('[data-melt-popover-content]');
				const clickedInsidePopover = Array.from(popoverElements).some((el) =>
					el.contains(event.target as Node)
				);

				if (clickedInsidePopover) return;

				if (taskRef && !taskRef.contains(event.target as Node)) {
					if (isPopoverOpen) {
						isPopoverOpen = false;
					} else {
						isSelected = false;
						isExpanded = false;
						onUpdate({ ...task, selected: false, expanded: false });
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
			svg: TagIcon,
			message: 'Tags',
			content: TagCombobox
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
	class="task-container {isExpanded ? 'expanded' : ''} {isSelected ? 'bg-[#CBE2FF]' : ''}"
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
					<input
						checked={isCompleted}
						onclick={toggleComplete}
						type="checkbox"
						class="h-5 w-5 rounded border-none accent-blue-600 focus:ring-0"
					/>
				</div>
				{#if task.when && !isExpanded}
					<small class="rounded-md bg-[#E6E8EC] px-2 font-light leading-5"
						>{formatDateTime(task.when)}</small
					>
				{/if}
				{#if isExpanded}
					<!-- Bind the input value to editableName -->
					<input
						type="text"
						class="task-text focus:ring-0 focus:ring-offset-0"
						bind:this={inputRef}
						bind:value={editedTaskName}
						onblur={updateTask}
					/>
				{:else}
					<!-- Display the current value of editableName -->
					<p class="task-text {isCompleted ? 'text-gray-500' : ''}" data-placeholder="New To-Do...">
						{editedTaskName}
						{#each task.tags as tag}
							<span class="ml-1 rounded-lg border border-gray-400 px-1.5 text-xs text-gray-400"
								>{tag.value}</span
							>
						{/each}
					</p>
				{/if}
				<button class="flex h-full items-center" onclick={deleteTask}
					><span class="material-symbols-outlined"> backspace </span></button
				>
			</div>
			<div class="notes-container">
				{#if isExpanded}
					<textarea
						name="task-notes"
						class="task-notes-input mb-6 focus:ring-0 focus:ring-offset-0"
						placeholder="Notes"
						bind:value={editedNotes}
						onblur={updateTask}
						rows="1"
					></textarea>
				{:else}
					<p class="task-notes-collapsed">{editedNotes}</p>
				{/if}
			</div>
		</div>
		{#if isExpanded}
			<div class="ml-5 flex items-end justify-between">
				<div class="flex flex-col">
					<div>
						{#if task.tags && task.tags.length > 0}
							<TagCombobox
								initialTags={task.tags}
								onTagSelected={(tag) => updateTag(tag as unknown as Tags)}
							/>
						{/if}
					</div>
					<div>
						{#if task.when}
							<div
								class="linear-in-out flex w-fit items-center space-x-2 rounded-md border border-transparent leading-none transition-all duration-150 hover:border hover:border-gray-200"
							>
								<Popover onOpenChange={handlePopoverOpenChange}>
									{#snippet triggerElement()}
										{@const TriggerElement = formatDateTime(task.when)}
										<p class="leading-3">🗓️ {TriggerElement}</p>
									{/snippet}
									{#snippet contentBlock()}
										{@const ContentComponent = Datepicker}
										<div style="width: 250px">
											<ContentComponent onDateSelected={updateWhen} />
										</div>
									{/snippet}
								</Popover>
								<button
									onclick={deleteWhen}
									onkeydown={(e) => e.key === 'Enter' && deleteWhen()}
									class="rounded-sm p-0.5 hover:bg-gray-200"
									type="button"
									aria-label="Delete"
								>
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
									>
										<path d="M18 6 6 18" />
										<path d="m6 6 12 12" />
									</svg>
								</button>
							</div>
						{/if}
					</div>
				</div>

				<div class="flex justify-end space-x-3">
					{#each Object.entries(icons) as [key, icon]}
						{@const shouldShowIcon =
							(key !== 'calendar' || !task.when) &&
							(key !== 'tag' || !task.tags || task.tags.length == 0)}
						{#if shouldShowIcon}
							<div
								class="linear-in-out rounded-sm border border-transparent p-0.5 opacity-40 transition-all duration-150 hover:border hover:border-black"
							>
								<Popover
									message={icon.message}
									onOpenChange={handlePopoverOpenChange}
									placement={key === 'calendar' ? 'left-start' : 'left'}
								>
									{#snippet triggerElement()}
										{@const TriggerElement = icon.svg}
										<TriggerElement class="size-4" />
									{/snippet}
									{#snippet contentBlock()}
										{@const ContentComponent = icon.content}
										<div class="w-fit">
											{#if ContentComponent == Datepicker}
												<Datepicker onDateSelected={updateWhen} />
											{/if}
										</div>
										<div>
											{#if ContentComponent == TagCombobox}
												<TagCombobox onTagSelected={(tag) => updateTag(tag as unknown as Tags)} />
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
		border-radius: 5px;
		cursor: pointer;
		width: 100%;
		margin: 0;
		display: flex;
		flex-direction: column;
		padding: 0rem calc(0.5rem + 0.25%);
		min-height: 28px;
		transition:
			transform 0.2s ease-out,
			max-height 0.2s ease-out,
			padding 0.2s ease-out,
			width 0.2s ease-out,
			margin-bottom 0.2s ease-out;
		transform: translateY(0);
		box-shadow: none;
		border: 0.5px solid transparent;
	}

	/* When the task is expanded */
	.task-container.expanded {
		background-color: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
		border: 0.5px solid #d7d8db;
		padding: 1rem calc(0.5rem + 1.25%);
		width: 102%;
		margin-bottom: 4rem;
		overflow: hidden;
		transform: translateY(20px);
		transition:
			transform 0.2s ease-out,
			max-height 0.2s ease-out,
			padding 0.2s ease-out,
			width 0.2s ease-out,
			margin-bottom 0.2s ease-out,
			background-color 0s,
			box-shadow 0s,
			border 0s;
	}

	/* Task Content */
	.task-content {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		transition: max-height 0.2s ease-out;
		max-height: 40px;
		overflow: hidden;
	}

	.task-container.expanded .task-content {
		max-height: 460px;
	}

	/* Task Header */
	.task-header {
		display: flex;
		align-items: center;
		min-height: 28px;
		overflow: hidden; /* Prevent content from overflowing */
		text-overflow: ellipsis; /* Add ellipsis for overflowing text */
		white-space: nowrap; /* Keep content on a single line */
	}

	/* Ensure the task name is visible */
	.task-text {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Style for the date/time small tag */
	.task-header small {
		flex-shrink: 0; /* Prevent the date from shrinking */
		margin-right: 0.5rem; /* Add some space between date and task name */
	}

	/* Notes Container */
	.notes-container {
		max-height: 0;
		transition: max-height 0.2s ease-out;
		width: 100%;
		overflow: hidden;
	}

	.task-container.expanded .notes-container {
		max-height: 420px; /* Adjust this value based on your needs */
	}

	/* Task Notes */
	.task-notes-input {
		margin-left: 1.25rem; /* Match margin with .task-text */
		border: none;
		box-sizing: border-box;
		outline: none;
		background: none;
		overflow: hidden;
		resize: none;
		transition: height 0.6s linear;
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
	input[type='text'],
	input[type='text']:focus {
		background: none;
		outline: none;
		outline-offset: none;
		border: none;
	}

	/* Base checkbox style */
	input[type='checkbox'] {
		width: 0.75rem;
		height: 0.75rem;
		appearance: none; /* Remove default checkbox styling */
		border: 1.2px solid #99aec6; /* Light gray border */
		border-radius: 20%; /* Rounded corners */
		background-color: none; /* White background when unchecked */
		cursor: pointer;
		display: flex; /* Flexbox for centering */
		align-items: center; /* Vertically center */
		justify-content: center; /* Horizontally center */
		transition:
			background-color 0.2s linear,
			border-color 0.2s linear,
			transform 0.2s linear; /* Add transition for the scaling effect */
		position: relative; /* Enable absolute positioning for checkmark */
	}

	/* Style when checkbox is checked */
	input[type='checkbox']:checked {
		background-color: #0062c1; /* Blue background when checked */
		border-color: #0062c1; /* Blue border when checked */
	}

	/* Scaling effect on mousedown */
	input[type='checkbox']:active {
		transform: scale(1.2); /* Make the checkbox 1.2 times its size when clicked */
	}

	/* Centered checkmark with adjusted positioning */
	input[type='checkbox']:checked::before {
		content: '';
		display: block;
		width: 35%; /* Relative size to the checkbox */
		height: 70%; /* Relative size to the checkbox */
		border: solid white;
		border-width: 0 0.15rem 0.15rem 0; /* Proportional borders */
		transform: rotate(45deg); /* Create checkmark */
		position: absolute; /* Absolute positioning */
		top: 50%;
		left: 50%;
		transform: translate(-50%, -60%) rotate(45deg); /* Properly center and rotate */
	}
</style>
