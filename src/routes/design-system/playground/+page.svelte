<script lang="ts">
	import ToDoItem from '$lib/blocks/to-do/ToDoItem.svelte';
	import { tick } from 'svelte';

	let tasks = $state([
		{ id: 1, name: 'Task 1', selected: false, expanded: false },
		{ id: 2, name: 'Task 2', selected: false, expanded: false }
	]);

	let selectedTaskId = $state<number | null>(null);

	function handleSelectTask(taskId: number) {
		tasks = tasks.map((task) => ({
			...task,
			selected: task.id === taskId
		}));
		selectedTaskId = taskId;
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

		tasks = [...tasks, newTask]; // Add the new task to the tasks array;

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

<div class="flex flex-col items-center">
	{#each tasks as task}
		<ToDoItem {task} onSelect={handleSelectTask} />
	{/each}

	<button onclick={addNewTask}>+ New Task</button>
</div>
