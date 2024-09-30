export interface Task {
	id: number;
	name: string;
	notes?: string;
	selected?: boolean;
	expanded?: boolean;
	completed?: boolean;
	when?: string | undefined;
	dueDate?: Date;
	tags?: Tag[]; // Ensure this is defined as an array of Tag
	priority?: 'low' | 'medium' | 'high';
	checklist?: ChecklistItem[];
}

// Define the Tag interface
export interface Tag {
	id: string; // or number, depending on your implementation
	value: string;
}

export interface ChecklistItem {
	name: string;
	completed: boolean;
}
