<script lang="ts">
	import TaskItem from '$lib/blocks/tasks/TaskItem.svelte';

	let tasks = $state([
		{ id: 1, text: 'Task 1', selected: false, expanded: false },
		{ id: 2, text: 'Task 2', selected: false, expanded: false }
	]);

	let selectedTaskId = $state<number | null>(null);

	function handleSelectTask(taskId: number) {
		// Update task selection
		tasks = tasks.map((task) => ({
			...task,
			selected: task.id === taskId
		}));
		selectedTaskId = taskId;
	}
</script>

<div class="flex flex-col items-center">
	{#each tasks as task}
		<TaskItem {task} onSelect={handleSelectTask} />
	{/each}
</div>
