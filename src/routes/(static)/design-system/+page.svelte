<script module lang="ts">
	// export const load = async () => {
	// 	if (process.env.NODE_ENV === 'production') {
	// 		// Redirect to home or show a 404 page
	// 		return {
	// 			status: 302,
	// 			redirect: '/'
	// 		};
	// 	}
	// };

	// To do
	import ToDo from '$lib/components/ToDo.svelte';
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

	// To do
</script>

<div class="space-y-24">
	<!-- Typography -->
	<section class="space-y-6">
		<h1>Typography</h1>
		<br />
		<div class="space-y-12">
			<h1>Heading 1</h1>
			<h2>Heading 2</h2>
			<h3>Heading 3</h3>
			<h4>Heading 4</h4>
			<p>This is a paragraph demonstrating the <code>p</code> tag styling.</p>
			<blockquote>“This is a blockquote example with border and italicization.”</blockquote>
			<p>
				<strong>Lead:</strong>
				<span style="font-size: 1.25rem; color: #969ea8;">This is a lead text example.</span>
			</p>
			<p>
				<strong>Large:</strong>
				<span style="font-size: 1.125rem; font-weight: 600; color: #090c1a;"
					>This is a large text example.</span
				>
			</p>
			<p>
				<strong>Small:</strong>
				<span style="font-size: 0.875rem; font-weight: 500; color: #090c1a;"
					>This is a small text example.</span
				>
			</p>
			<p>
				<strong>Muted:</strong>
				<span style="font-size: 0.875rem; color: #969ea8;">This is a muted text example.</span>
			</p>
		</div>
	</section>
	<!-- Base components -->
	<section class="space-y-6">
		<h1>Base components</h1>
		<br />
		<h4>Checkbox</h4>
	</section>
	<!-- App components -->
</div>
