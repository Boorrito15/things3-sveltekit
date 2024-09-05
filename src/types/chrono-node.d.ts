declare module 'chrono-node' {
	// Declare the module as `unknown` to avoid TypeScript errors
	export function parseDate(text: string, refDate?: Date, options?: unknown): Date | null;
	export function parse(text: string, refDate?: Date, options?: unknown): Array<unknown>;
	const chrono: unknown;
	export = chrono;
}
