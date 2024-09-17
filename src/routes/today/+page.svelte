<!-- src/routes/inbox/+page.svelte -->
<script lang="ts">
	import { Collapsible } from '$lib/global-components';
	import ToDo from '$lib/blocks/to-do/ToDo.svelte';
	import { tick } from 'svelte';
	import dayjs from 'dayjs';

	// Safely access props and ensure tasks is always an array
	const { data } = $props();
	let tasks = $state(
		data.tasks.filter((task) => task.when === dayjs().startOf('day').toISOString())
	);

	let availableTasks = $derived(tasks.filter((task) => task.completed === false));

	let completedTasks = $derived(tasks.filter((task) => task.completed === true));

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
			completed: false,
			when: dayjs().startOf('day').toISOString()
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

<h4 class="mb-12">⭐️ Today</h4>

<div class="flex flex-col items-center">
	{#if availableTasks.length > 0}
		{#each availableTasks as task (task.id)}
			<ToDo {task} onSelect={handleSelectTask} onDelete={handleDeleteTask} />
		{/each}
	{:else}
		<p>No tasks available.</p>
	{/if}

	<button class="text-sm" onclick={addNewTask}>+ New Task</button>
	<br /><br />
	{#if completedTasks.length > 0}
		<Collapsible>
			{#snippet heading()}
				{@const heading = 'Hidden'}
				<p
					class="leading-3 text-sm font-semibold text-gray-500 border border-transparent hover:border-gray-300 p-1"
				>
					{heading}
				</p>
			{/snippet}

			{#snippet items()}
				{#each completedTasks as task (task.id)}
					{@const items = task}
					<ToDo {task} onSelect={handleSelectTask} onDelete={handleDeleteTask} />
				{/each}
			{/snippet}
		</Collapsible>
	{/if}
</div>
