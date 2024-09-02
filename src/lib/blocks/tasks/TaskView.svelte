<script lang="ts">
	import { Checkbox } from '$lib/global-components';
	interface Task {
		id: number;
		text: string;
		expanded: boolean;
	}

	let { task, onClick }: { task: Task; onClick: () => void } = $props();
</script>

<!-- Using a div to wrap the content instead of a button -->
<div
	class="task"
	role="button"
	tabindex="0"
	onclick={onClick}
	onkeydown={(event) => event.key === 'Enter' && onClick()}
>
	<div class="task-content flex items-center space-x-2" style="transition: opacity 0.3s ease;">
		<Checkbox />
		<!-- Checkbox component with no nesting issues -->
		<p class="task">{task.text}</p>
	</div>
</div>

<style>
	.task {
		padding: 0rem 0.5rem;
		border-radius: 5px;
		overflow: hidden;
		cursor: pointer;
		transition:
			height 0.3s ease,
			padding 0.3s ease,
			background-color 0.3s ease,
			box-shadow 0.3s ease,
			width 0.3s ease,
			margin-top 0.3s ease,
			margin-bottom 0.3s ease;
		height: 2rem; /* Default height when collapsed */
		box-shadow: none;
		background-color: transparent; /* Default background color when collapsed */
		width: 100%; /* Default width when collapsed */
		margin-top: 0;
		margin-bottom: 0; /* Initial margin-bottom */
	}

	.task.clicked {
		background-color: #cbe2ff; /* Background color when clicked */
	}

	.task.expanded {
		width: 102%; /* Slightly wider when expanded */
		height: 10rem; /* Fixed height when expanded */
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08); /* Uniform, subtle shadow around the card */
		background-color: white; /* Background color when expanded */
		margin-top: 2rem; /* Apply a margin-top to create the space */
		margin-bottom: 2rem;
		padding: 1rem;
	}

	.task-content {
		overflow: hidden; /* Ensure content doesn’t overflow */
	}
</style>
