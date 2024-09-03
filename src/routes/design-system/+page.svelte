<script module lang="ts">
	export const load = async () => {
		if (process.env.NODE_ENV === 'production') {
			// Redirect to home or show a 404 page
			return {
				status: 302,
				redirect: '/'
			};
		}
	};

	import { Checkbox } from '$lib/global-components';

	// To do

	import ToDoItem from '$lib/blocks/to-do/ToDoItem.svelte';

	let tasks = $state([
		{ id: 1, name: '#To-do 1', selected: false, expanded: false },
		{
			id: 2,
			name: '#To-do 2',
			selected: false,
			expanded: false,
			notes:
				'You’re looking at a to-do! Complete it by clicking the checkbox on the left. Completed to-dos are collected at the bottom of your project.'
		}
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
		<Checkbox />
	</section>
	<!-- App components -->
	<section class="space-y-6">
		<h1>App components</h1>
		<br />
		<h4>To do</h4>
		<div class="flex flex-col items-center">
			{#each tasks as task}
				<ToDoItem {task} onSelect={handleSelectTask} />
			{/each}
		</div>
	</section>
</div>
