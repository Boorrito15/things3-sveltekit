export interface Task {
	id: number;
	name: string;
	completed: boolean;
	notes?: string;
	selected?: boolean;
	expanded?: boolean;
	when?: Date;
	dueDate?: Date;
}
