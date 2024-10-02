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

export function formatDateTime(date: Date | string | null): string {
	if (!date) return '';

	const formattedDate = formatDate(date);
	const formattedTime = dayjs(date).format('h:mm A');
	return `${formattedDate} at ${formattedTime}`;
}

export function filterTasks(
	tasks: Task[],
	filter: 'all' | 'today' | 'inbox' | null = null
): {
	availableTasks: Task[];
	completedTasks: Task[];
} {
	const today = dayjs().startOf('day');

	const filterFunction = (task: Task): boolean => {
		switch (filter) {
			case 'all':
				return true;
			case 'today':
				return !!task.when && dayjs(task.when).startOf('day').isSame(today);
			case 'inbox':
				return !task.when;
			default:
				return true;
		}
	};

	const availableTasks = tasks
		.filter((task) => !task.completed && filterFunction(task))
		.sort((a, b) => {
			if (!a.when && !b.when) return 0;
			if (!a.when) return 1;
			if (!b.when) return -1;
			return dayjs(a.when).diff(dayjs(b.when));
		});

	const completedTasks = tasks
		.filter((task) => task.completed && filterFunction(task))
		.sort((a, b) => {
			if (!a.when && !b.when) return 0;
			if (!a.when) return 1;
			if (!b.when) return -1;
			return dayjs(a.when).diff(dayjs(b.when));
		});

	return { availableTasks, completedTasks };
}

export function createNewTask(tasks: Task[], when: string | null = null): Task {
	const maxId = Math.max(0, ...tasks.map((t) => t.id));
	return {
		id: maxId + 1,
		name: '',
		selected: false,
		expanded: true,
		completed: false,
		when: when || '',
		notes: '',
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
				task.id === (taskData as Task).id ? { ...task, ...(taskData as Task) } : task
			);
			// console.log('Task updated in taskUtils:', taskData);
			if ((taskData as Task).tags) {
				console.log('Updated tags:', (taskData as Task).tags);
			}
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
