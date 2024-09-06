declare module 'chrono-node' {
	export interface ParsedComponents {
		date: () => Date;
		get: (component: string) => number | null;
		isCertain: (component: string) => boolean;
	}

	export interface ParsedResult {
		index: number;
		text: string;
		start: ParsedComponents;
		end?: ParsedComponents;
	}

	export function parseDate(text: string, refDate?: Date, options?: unknown): Date | null;
	export function parse(text: string, refDate?: Date, options?: unknown): ParsedResult[];
}
