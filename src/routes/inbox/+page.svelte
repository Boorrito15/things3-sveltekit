<!-- src/routes/today/+page.svelte -->
<script lang="ts">
	import { Collapsible } from '$lib/global-components';
	import ToDo from '$lib/blocks/to-do/ToDo.svelte';
	import type { Task } from '$lib/types';
	import { filterTasks, addNewTask, handleTaskAction } from '$lib/utils/taskUtils';

	const { data } = $props<{ data: { tasks: Task[] } }>();

	// No 'today' variable needed for inbox

	let tasks = $state(data.tasks);

	let availableTasks = $derived(filterTasks(tasks, '').availableTasks);
	let completedTasks = $derived(filterTasks(tasks, '').completedTasks);

	function handleTaskActionWrapper(
		action: 'select' | 'delete' | 'update' | 'complete',
		taskData: Task | number
	) {
		tasks = handleTaskAction(tasks, action, taskData);
	}
	function addNewTaskWrapper() {
		tasks = addNewTask(tasks, '');
	}
</script>

<h4 class="mb-12">📥 Inbox</h4>

<div class="flex flex-col items-center">
	{#if availableTasks.length > 0}
		{#each availableTasks as task (task.id)}
			<ToDo
				{task}
				onSelect={(id) => handleTaskActionWrapper('select', id)}
				onDelete={(id) => handleTaskActionWrapper('delete', id)}
				onUpdate={(updatedTask) => handleTaskActionWrapper('update', updatedTask)}
				onComplete={(updatedTask) => handleTaskActionWrapper('complete', updatedTask)}
			/>
		{/each}
	{:else}
		<p>No tasks available.</p>
	{/if}
	<button class="text-sm" onclick={addNewTaskWrapper}>+ New Task</button>

	{#if completedTasks.length > 0}
		<Collapsible>
			{#snippet heading()}
				<p
					class="leading-3 text-sm font-semibold text-gray-500 border border-transparent hover:border-gray-300 p-1"
				>
					Hidden
				</p>
			{/snippet}

			{#snippet items()}
				{#each completedTasks as task (task.id)}
					<ToDo
						{task}
						onSelect={(id) => handleTaskActionWrapper('select', id)}
						onDelete={(id) => handleTaskActionWrapper('delete', id)}
						onUpdate={(updatedTask: number | Task) =>
							handleTaskActionWrapper('update', updatedTask)}
						onComplete={(updatedTask: number | Task) =>
							handleTaskActionWrapper('complete', updatedTask)}
					/>
				{/each}
			{/snippet}
		</Collapsible>
	{/if}
</div>
