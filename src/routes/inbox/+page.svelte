<!-- src/routes/inbox/+page.svelte -->
<script lang="ts">
	import ToDo from '$lib/blocks/to-do/ToDo.svelte';
	import { tick } from 'svelte';

	// Safely access props and ensure tasks is always an array
	const { data } = $props();
	let tasks = $state(data.tasks);

	let selectedTaskId: number | null = null;

	function handleSelectTask(taskId: number) {
		tasks = tasks.map((task) => ({
			...task,
			selected: task.id === taskId
		}));
		selectedTaskId = taskId;
	}

	async function handleDeleteTask(taskId: number) {
		tasks = tasks.filter((task) => task.id !== taskId);
	}

	async function addNewTask() {
		tasks = tasks.map((task) => {
			if (task.selected) {
				return { ...task, selected: false };
			}
			return task;
		});

		const newTask = {
			id: tasks.length + 1, // Assign a unique ID
			name: ``,
			selected: false,
			expanded: false
		};

		tasks = [...tasks, newTask]; // Add the new task to the tasks array

		// Wait for DOM to update before expanding the new task
		await tick();

		// Directly set the new task to expanded
		newTask.expanded = true;

		setTimeout(() => {
			// Directly set the new task to expanded
			tasks = tasks.map((task) => (task.id === newTask.id ? { ...task, expanded: true } : task));
		}, 0); // Small delay to allow the initial rendering to complete
	}
</script>

<h4 class="mb-12">📥 Inbox</h4>
<div class="flex flex-col items-center">
	{#if tasks.length > 0}
		{#each tasks as task (task.id)}
			<ToDo {task} onSelect={handleSelectTask} onDelete={handleDeleteTask} />
		{/each}
	{:else}
		<p>No tasks available.</p>
	{/if}

	<button onclick={addNewTask}>+ New Task</button>
</div>
