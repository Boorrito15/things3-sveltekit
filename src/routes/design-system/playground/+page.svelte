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

<div class="wrapper">
	<div class="inner">
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mi enim, venenatis non
		facilisis sed, finibus in enim. Sed auctor enim nisl, sit amet feugiat risus blandit vitae. <br
		/><br />

		Integer dapibus tortor lorem, quis interdum erat maximus eu. Nam varius, nisl ac pharetra
		convallis, neque ex blandit quam, sit amet condimentum lectus elit vel ligula. Donec commodo
		porta elit quis facilisis. Sed non purus a massa convallis ultricies. Donec malesuada
		sollicitudin dui, vel lobortis arcu rutrum ut. Curabitur lobortis ac tellus non tempor. Donec
		nisl risus, cursus vel odio quis, convallis euismod ante. <br /><br />

		Nulla lectus diam, sagittis id urna in, tincidunt facilisis sapien. Sed ante turpis, porttitor a
		diam at, auctor lobortis sapien. Cras ornare dolor sed arcu laoreet volutpat ut tristique ipsum.
	</div>
</div>

<style>
	.wrapper {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.5s;
		margin: 1rem;
		padding: 1rem;
		background: skyblue;
	}

	.wrapper:hover {
		grid-template-rows: 1fr;
	}

	.inner {
		overflow: hidden;
	}
</style>
