// src/routes/inbox/+page.server.ts
import dayjs from 'dayjs';

export async function load() {
	// Mock tasks that will be used for the inbox
	const inboxTasks = [
		{
			id: 1,
			name: 'Task 1',
			completed: true,
			when: dayjs().startOf('day').toISOString()
		},
		{
			id: 2,
			name: 'Task 2',
			completed: false,
			when: dayjs().startOf('day').toISOString()
		},
		{
			id: 3,
			name: 'Task 3',
			completed: false,
			when: ''
		}
	];

	// Return the tasks to be used in the +page.svelte file
	return { tasks: inboxTasks };
}
