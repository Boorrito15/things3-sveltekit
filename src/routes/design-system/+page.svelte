<script module lang="ts">
	export const load = async () => {
		if (process.env.NODE_ENV === 'production') {
			// Redirect to home or show a 404 page
			return {
				status: 302,
				redirect: '/'
			};
		}
	};

	import { Checkbox } from '$lib/global-components';
</script>

<Checkbox />
