export interface Task {
	id: number;
	name: string;
	notes?: string;
	selected?: boolean;
	expanded?: boolean;
	completed?: boolean;
	when?: string | undefined;
	dueDate?: Date;
	// tags?: Tag[];
	priority?: 'low' | 'medium' | 'high';
	checklist?: ChecklistItem[];
}

// export interface Tag {
// 	id: number;
// 	name: string;
// 	color?: string;
// 	description?: string;
// }

export interface ChecklistItem {
	id: number;
	name: string;
	completed: boolean;
}
