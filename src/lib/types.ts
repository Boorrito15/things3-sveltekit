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
	checklist?: ChecklistItem[]; // Ensure checklist is defined
}

// Define the Tag interface
export interface Tag {
	id: string; // or number, depending on your implementation
	value: string;
	color?: string;
	description?: string;
}

export interface ChecklistItem {
	// id: number;
	name: string;
	completed: boolean;
}
