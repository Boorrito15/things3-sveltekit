// src/lib/utils/taskUtils.ts
import type { Task } from '$lib/types';
import dayjs from 'dayjs';

export function formatDate(date: Date | string | null): string {
	if (!date) return '';

	const today = dayjs().startOf('day');
	const targetDate = dayjs(date).startOf('day');
	const daysDiff = targetDate.diff(today, 'day');

	if (daysDiff === 0) return 'Today';
	if (daysDiff === 1) return 'Tomorrow';
	if (daysDiff >= 2 && daysDiff <= 5) return `${targetDate.format('dddd')}`;
	if (targetDate.year() === today.year()) return targetDate.format('ddd, D MMM');
	return targetDate.format('D MMM YYYY');
}

export function filterTasks(
	tasks: Task[],
	today: string
): {
	availableTasks: Task[];
	completedTasks: Task[];
} {
	const availableTasks = tasks.filter(
		(task) => (task.when === today || task.expanded) && !task.completed
	);
	const completedTasks = tasks.filter(
		(task) => (task.when === today || task.expanded) && task.completed
	);
	return { availableTasks, completedTasks };
}

export function createNewTask(tasks: Task[], when: string | null = null): Task {
	return {
		id: Math.max(...tasks.map((t) => t.id), 0) + 1,
		name: '',
		selected: false,
		expanded: true,
		completed: false,
		when: when || '',
		notes: '',
		// tags: [],
		checklist: []
	};
}

export function handleTaskAction(
	tasks: Task[],
	action: 'select' | 'delete' | 'update' | 'complete',
	taskData: Task | number | { id: number; completed: boolean }
): Task[] {
	let updatedTasks: Task[];
	switch (action) {
		case 'select':
			updatedTasks = tasks.map((task) => ({
				...task,
				selected: task.id === taskData
			}));
			break;
		case 'delete':
			updatedTasks = tasks.filter((task) => task.id !== taskData);
			break;
		case 'update':
			updatedTasks = tasks.map((task) =>
				task.id === (taskData as Task).id ? { ...(taskData as Task), selected: false } : task
			);
			break;
		case 'complete':
			updatedTasks = tasks.map((task) =>
				task.id === (taskData as { id: number; completed: boolean }).id
					? { ...task, completed: (taskData as { id: number; completed: boolean }).completed }
					: task
			);
			break;
		default:
			updatedTasks = tasks;
	}
	return updatedTasks;
}

export function addNewTask(tasks: Task[], when: string | null = null): Task[] {
	const newTask = createNewTask(tasks, when);
	return [...tasks, newTask];
}
