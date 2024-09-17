<script lang="ts">
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';

	dayjs.extend(utc);
	const { data } = $props();

	let tasks = $state(data.todos);
	let derivedTasks = $derived(tasks.filter((task) => dayjs(task.when).isSame(dayjs(), 'day')));

	function addTask() {
		const newTask = {
			id: tasks.length + 1,
			name: `Task ${tasks.length + 1}`,
			notes: `Some notes for task ${tasks.length + 1}`,
			when: dayjs().startOf('day').toISOString(),
			completed: false,
			selected: false,
			expanded: false
		};

		tasks = [...tasks, newTask];
	}
</script>

<button class="p-1 px-2 text-sm bg-gray-200 border rounded-md" onclick={addTask}>add task</button>

Tasks
{#each tasks as task}
	<p>{task.name} {dayjs(task.when).format('ddd, DD MMM [🔔]')}</p>
{/each}

<br />
Derived task
{#each derivedTasks as derivedTask}
	<p>{derivedTask.name} {dayjs(derivedTask.when).format('ddd, DD MMM [🔔]')}</p>
{/each}
