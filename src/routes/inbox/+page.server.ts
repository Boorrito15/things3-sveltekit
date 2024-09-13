// src/routes/inbox/+page.server.ts
export async function load() {
	// Mock tasks that will be used for the inbox
	const inboxTasks = [
		{ id: 1, name: 'Task 1', selected: false, expanded: false },
		{ id: 2, name: 'Task 2', selected: false, expanded: false }
	];

	// Return the tasks to be used in the +page.svelte file
	return { tasks: inboxTasks };
}
