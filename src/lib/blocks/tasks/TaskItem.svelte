<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox.svelte';

	interface Task {
		id: number;
		text: string;
		selected: boolean;
		expanded: boolean;
		notes?: string;
	}

	let { task, onSelect } = $props<{
		task: Task;
		onSelect: (taskId: number) => void;
	}>();

	let taskRef = $state<HTMLElement | null>(null);

	function selectTask() {
		onSelect(task.id); // Notify the parent component to select this task
	}

	function toggleEdit() {
		if (!task.expanded) {
			task.expanded = true;
		}
	}

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
			<p class="task-text">{task.text}</p>
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
</div>

<style>
	/* General Task Container */
	.task-container {
		padding: 0 0.5rem 0 1.5rem; /* Add initial padding on the left */
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
		padding: 1rem 0.5rem 1rem calc(1.5rem + 0.25%); /* Keep the left padding the same */
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
	}

	.task-text {
		margin-left: 1rem;
		flex-grow: 1;
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
</style>
