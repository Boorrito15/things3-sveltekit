<!-- src/routes/inbox/+page.svelte -->
<script lang="ts">
	import ToDo from '$lib/blocks/to-do/ToDo.svelte';
	import { tick } from 'svelte';

	// Safely access props and ensure tasks is always an array
	const { data } = $props();
	let tasks = $state(data.tasks);

	let availableTasks = $derived(tasks.filter((task) => task.completed === false));

	let completedTasks = $derived(tasks.filter((task) => task.completed === true));

	if (data === undefined) {
		console.error('Data is undefined in the script.');
	} else {
		console.log('Data in script:', tasks);
	}
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
			expanded: false,
			completed: false
		};

		tasks.push(newTask); // Add the new task to the tasks array

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
	{#if availableTasks.length > 0}
		{#each availableTasks as task (task.id)}
			<ToDo {task} onSelect={handleSelectTask} onDelete={handleDeleteTask} />
		{/each}
	{:else}
		<p>No tasks available.</p>
	{/if}

	<button class="text-sm" onclick={addNewTask}>+ New Task</button>
</div>

<div class="mt-12">
	<small class="ml-3">Hidden</small>
	{#each completedTasks as task (task.id)}
		<ToDo {task} onSelect={handleSelectTask} onDelete={handleDeleteTask} />
	{/each}
</div>
