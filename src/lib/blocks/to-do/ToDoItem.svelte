<script lang="ts">
	import { Checkbox, Tooltip } from '$lib/global-components';
	import { tick } from 'svelte';
	import { Calendar, TagOutline, Checklist, FlagOutline } from '$lib/global-icons';

	interface Tag {
		id: number;
		name: string;
		color?: string;
		description?: string;
	}

	interface ChecklistItem {
		id: number;
		name: string;
		completed: boolean;
	}

	interface Task {
		id: number;
		name: string;
		notes?: string;

		selected?: boolean;
		expanded?: boolean;
		completed?: false;

		dueDate?: Date;
		tags?: Tag[];
		priority?: 'low' | 'medium' | 'high';
		checklist?: ChecklistItem[];
	}

	let { task, onSelect, onDelete } = $props<{
		task: Task;
		onSelect: (taskId: number) => void;
		onDelete: (taskId: number) => void;
	}>();

	let taskRef = $state<HTMLElement | null>(null);
	let inputRef = $state<HTMLInputElement | null>(null); // Reference to the input element

	const icons = {
		calendar: {
			svg: Calendar,
			message: 'When'
		},
		tag: {
			svg: TagOutline,
			message: 'Tags'
		},
		checklist: {
			svg: Checklist,
			message: 'Add checklist'
		},
		flag: {
			svg: FlagOutline,
			message: 'Deadline'
		}
	};

	console.log(icons.calendar.svg);

	function selectTask() {
		onSelect(task.id); // Notify the parent component to select this task
	}

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

	function completeTask() {
		task.completed = true;
		console.log(task.completed);
	}

	function deleteTask() {
		onDelete(task.id);
	}

	$effect(() => {
		if (task.expanded && inputRef) {
			inputRef.focus(); // Focus the input when the task is expanded
		}
	});

	let editedTaskName = $state(task.name);
	// Update task.name whenever editableName changes

	$effect(() => {
		if (task.expanded || task.selected) {
			const handleClickOutside = (event: MouseEvent) => {
				if (taskRef && !taskRef.contains(event.target as Node)) {
					task.selected = false; // Collapse the task if the click is outside
					task.expanded = false;
				}
			};

			document.addEventListener('mousedown', handleClickOutside);

			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}
	});
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
		<div class="task-header">
			<Checkbox on:click={completeTask} />
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
		{#if task.expanded}
			<div class="task-footer space-x-3">
				{#each Object.entries(icons) as [key, icon]}
					<Tooltip message={icon.message} TriggerElement={icon.svg} />
				{/each}
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
	}

	.task-container.selected {
		background-color: #cae2ff;
	}

	.task-container.expanded {
		background-color: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
		margin: 2rem 0;
		padding: 1rem calc(0.5rem + 0.25%); /* Keep the left padding the same */
		height: fit-content;
		width: 100%;
	}

	/* Task Content */
	.task-content {
		display: flex;
		flex-direction: column;
	}

	/* Task Header */
	.task-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 28px;
	}

	.task-text {
		margin-left: 1rem;
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
		width: 100%;
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

	.task-footer {
		display: flex;
		justify-content: end;
	}

	input {
		background: none;
		outline: none;
	}
</style>
