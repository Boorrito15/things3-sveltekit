export async function load() {
	const todos = [
		{
			id: 1,
			name: 'Task 1',
			notes: 'Some notes for task 1',
			when: new Date('2024-09-18'),
			completed: false,
			// project: 'Work',
			// tags: ['Important', 'Urgent'],
			selected: false,
			expanded: false
		},
		{
			id: 2,
			name: 'Task 2',
			notes: 'Some notes for task 2',
			when: new Date('2024-09-20'),
			completed: false,
			// project: 'Personal',
			// tags: ['Optional'],
			selected: false,
			expanded: false
		},
		{
			id: 3,
			name: 'Task 3',
			notes: 'Some notes for task 3',
			when: new Date(Date.now()),
			completed: false,
			// project: 'Personal',
			// tags: ['Optional'],
			selected: false,
			expanded: false
		}
	];
	return {
		todos
	};
}
