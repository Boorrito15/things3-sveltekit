<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox.svelte';

	// Define the type for a Task
	interface Task {
		id: number;
		text: string;
		expanded: boolean;
	}

	// Use $state to manage multiple tasks
	let tasks = $state<Task[]>([
		{ id: 1, text: 'Task 1', expanded: false },
		{ id: 2, text: 'Task 2', expanded: false }
	]);

	let clickedTaskId = $state<number | null>(null);

	// Function to toggle the expansion of a task
	function toggleExpand(taskId: number) {
		if (clickedTaskId === taskId && !tasks.find((task) => task.id === taskId)?.expanded) {
			tasks = tasks.map((task) => (task.id === taskId ? { ...task, expanded: true } : task));
			return;
		}

		if (clickedTaskId !== null && clickedTaskId !== taskId) {
			tasks = tasks.map((task) =>
				task.id === clickedTaskId ? { ...task, expanded: false } : task
			);
		}

		clickedTaskId = taskId;
		tasks = tasks.map((task) => (task.id === taskId ? { ...task, expanded: false } : task));
	}

	// Effect to handle clicks outside the task container
	$effect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			const taskElements = Array.from(document.querySelectorAll('.task'));
			if (!taskElements.some((element) => element.contains(event.target as Node))) {
				clickedTaskId = null;
				tasks = tasks.map((task) => ({ ...task, expanded: false }));
			}
		};

		document.addEventListener('click', handleOutsideClick);

		// Cleanup function to remove the event listener when no longer needed
		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	});
</script>

<div class="flex flex-col items-center space-y-2">
	{#each tasks as task}
		<div
			role="button"
			tabindex="0"
			class="task {task.expanded ? 'expanded' : ''} {clickedTaskId === task.id && !task.expanded
				? 'clicked'
				: ''}"
			onclick={() => toggleExpand(task.id)}
			onkeydown={(event) => {
				if (event.key === 'Enter') toggleExpand(task.id);
			}}
			style="height: {task.expanded ? '10rem' : '2rem'}; transform: {task.expanded
				? 'translateY(2rem)'
				: 'translateY(0)'};"
		>
			<div class="task-content flex items-center space-x-2" style="transition: opacity 0.5s ease;">
				<Checkbox />
				<p class="task-editor">{task.text}</p>
			</div>
		</div>
	{/each}
</div>

<style>
	.task {
		padding: 0rem 0.5rem;
		border-radius: 5px;
		overflow: hidden;
		cursor: pointer;
		transition:
			height 0.5s ease,
			transform 0.5s ease,
			padding 0.5s ease,
			background-color 0.5s ease,
			box-shadow 0.5s ease,
			width 0.5s ease,
			margin-left 0.5s ease,
			margin-right 0.5s ease,
			margin-bottom 0.5s ease; /* Corrected this line */
		height: 3rem; /* Default height when collapsed */
		transform: translateY(0); /* Initial transform */
		box-shadow: none;
		background-color: transparent; /* Default background color when collapsed */
		width: 100%; /* Default width when collapsed */
		margin-left: 0; /* No initial left margin */
		margin-right: 0; /* No initial right margin */
		margin-bottom: 0; /* Initial margin-bottom */
	}

	.task.clicked {
		background-color: #cbe2ff; /* Background color when clicked */
	}

	.task.expanded {
		width: 102%; /* Slightly wider when expanded */
		transform: translateY(2rem); /* Only move vertically when expanded */
		height: 10rem; /* Fixed height when expanded */
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08); /* Uniform, subtle shadow around the card */
		background-color: white; /* Background color when expanded */
		margin-bottom: 2rem;
		padding: 1rem;
	}

	.task-content {
		overflow: hidden; /* Ensure content doesn’t overflow */
	}
</style>
