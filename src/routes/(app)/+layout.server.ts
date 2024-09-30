import dayjs from 'dayjs';

export async function load() {
	// Mock tasks that will be used for the inbox
	const tasks = [
		{
			id: 1,
			name: 'Task 1',
			selected: false,
			expanded: false,
			completed: true,
			when: dayjs().startOf('day').toISOString(),
			tags: [{ id: '1', value: 'Svelte' }] // Ensure tags are in the correct format
		},

		{
			id: 2,
			name: 'Task 2',
			selected: false,
			expanded: false,
			completed: false,
			when: dayjs().startOf('day').toISOString(),
			tags: []
		},
		{
			id: 3,
			name: 'Task 3',
			selected: false,
			expanded: false,
			completed: false,
			when: null,
			tags: [],
			checklist: []
		}
	];

	// Return the tasks to be used in the +page.svelte file
	return { tasks: tasks };
}
