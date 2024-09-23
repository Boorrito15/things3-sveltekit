<script lang="ts">
	import type { Page } from '@sveltejs/kit';
	import { page } from '$app/stores'; // Import the page store from SvelteKit
	// import { InboxIcon, CalendarIcon } from '$lib/global-icons';
</script>

<nav class="w-80 bg-[#F5F6F8] h-screen pt-4 px-3 border-r border-neutral-200">
	<ul class="m-0 font-medium">
		<li class="m-0">
			<a
				href="/inbox"
				class="flex items-center px-1 rounded-md {$page.url.pathname === '/inbox'
					? 'bg-[#DEE0E6]'
					: ''}"
			>
				<p>📥 Inbox</p>
			</a>
		</li>

		<li class="mt-4">
			<a
				href="/today"
				class="flex items-center px-1 rounded-md {$page.url.pathname === '/today'
					? 'bg-[#DEE0E6]'
					: ''}"
			>
				<p>⭐️ Today</p>
			</a>
		</li>

		<li class="m-0">
			<a
				href="/upcoming"
				class="flex items-center px-1 rounded-md {$page.url.pathname === '/upcoming'
					? 'bg-[#DEE0E6]'
					: ''}"
			>
				<p>📅 Upcoming</p>
			</a>
		</li>
	</ul>
</nav>
