<script lang="ts">
	import { Checkbox, Tooltip } from '$lib/global-components';
	import { tick } from 'svelte';

	interface Task {
		id: number;
		name: string;
		selected: boolean;
		expanded: boolean;
		notes?: string;
	}

	let { task, onSelect } = $props<{
		task: Task;
		onSelect: (taskId: number) => void;
	}>();

	let taskRef = $state<HTMLElement | null>(null);
	let inputRef: HTMLInputElement | null = null; // Reference to the input element

	const icons = {
		calendar: {
			svg: `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#A1A3A9"
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-calendar-month"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
        <path d="M16 3v4" />
        <path d="M8 3v4" />
        <path d="M4 11h16" />
        <path d="M7 14h.013" />
        <path d="M10.01 14h.005" />
        <path d="M13.01 14h.005" />
        <path d="M16.015 14h.005" />
        <path d="M13.015 17h.005" />
        <path d="M7.01 17h.005" />
        <path d="M10.01 17h.005" />
      </svg>
    `,
			message: 'When'
		},
		tag: {
			svg: `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#A1A3A9"
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-tag"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M7.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path
          d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3z"
        />
      </svg>
    `,
			message: 'Tags'
		},
		checklist: {
			svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A1A3A9" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-list-check">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3.5 5.5l1.5 1.5l2.5 -2.5" />
      <path d="M3.5 11.5l1.5 1.5l2.5 -2.5" />
      <path d="M3.5 17.5l1.5 1.5l2.5 -2.5" />
      <path d="M11 6l9 0" />
      <path d="M11 12l9 0" />
      <path d="M11 18l9 0" />
      </svg>`,
			message: 'Add checklist'
		},
		flag: {
			svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A1A3A9" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-flag-3">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 14h14l-4.5 -4.5l4.5 -4.5h-14v16" />
      </svg>`,
			message: 'Deadline'
		}
	};

	function selectTask() {
		onSelect(task.id); // Notify the parent component to select this task
	}

	function toggleEdit() {
		if (!task.expanded) {
			task.expanded = true;
			tick().then(() => {
				if (inputRef) {
					inputRef.focus();
				}
			});
		}
	}

	$effect(() => {
		if (task.expanded && inputRef) {
			inputRef.focus(); // Focus the input when the task is expanded
		}
	});

	let editedTaskName = $state(task.name);
	// Update task.name whenever editableName changes

	$effect(() => {
		if (task.expanded) {
			const handleClickOutside = (event: MouseEvent) => {
				if (taskRef && !taskRef.contains(event.target as Node)) {
					task.expanded = false; // Collapse the task if the click is outside
				}
				selectTask();
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
	ondblclick={toggleEdit}
	onkeydown={(event) => {
		if (event.key === 'Enter') toggleEdit();
	}}
>
	<div class="task-content">
		<div class="task-header">
			<Checkbox />
			{#if task.expanded}
				<!-- Bind the input value to editableName -->
				<input class="task-text" bind:this={inputRef} bind:value={editedTaskName} />
			{:else}
				<!-- Display the current value of editableName -->
				<p class="task-text" data-placeholder="New To-Do...">{editedTaskName}</p>
			{/if}
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
					<Tooltip message={icon.message} triggerElement={icon.svg} />
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
		padding: 1rem 0.5rem 1rem calc(0.5rem + 0.25%); /* Keep the left padding the same */
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
		outline: none;
	}
</style>
