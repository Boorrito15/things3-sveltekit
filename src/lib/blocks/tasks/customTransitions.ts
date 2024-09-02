import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

export function flyFade(
	node: HTMLElement,
	{ y = 20, duration = 300, easing = cubicOut } = {}
): TransitionConfig {
	const style = getComputedStyle(node);
	const opacity = +style.opacity;

	return {
		duration,
		easing,
		css: (t) => `
			transform: translateY(${(1 - t) * y}px);
			opacity: ${t * opacity};
		`
	};
}
