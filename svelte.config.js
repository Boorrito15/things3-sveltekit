import { preprocessMeltUI, sequence } from '@melt-ui/pp';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config}*/
const config = {
	kit: {
		adapter: adapter()
	},
	preprocess: sequence([vitePreprocess(), preprocessMeltUI()]),
	compilerOptions: {
		runes: true
		// Enable Runes for Svelte 5
	}
};
export default config;
