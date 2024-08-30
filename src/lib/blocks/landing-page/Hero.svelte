<script lang="ts">
	import { Button, Avatar } from '$lib/global-components';
</script>

<section class="flex items-center justify-center min-h-screen text-center">
	<div
		class="mx-auto"
		style="
      padding-left: calc(env(safe-area-inset-left) + 4%);
      padding-right: calc(env(safe-area-inset-right) + 4%);
      max-width: 900px;"
	>
		<img
			src="images/hero-logo-things.png"
			alt="things-logo"
			width="250px"
			height="300px"
			class="mx-auto"
		/>
		<p class="text-xl mb-8 max-w-[440px]">
			Things is the award-winning personal task manager that helps you plan your day, manage your
			projects, and make real progress toward your goals.
		</p>
		<button class="px-4 py-2 font-semibold text-blue-500 bg-white rounded">Get Started</button>
		<Button>ShadCN</Button>
		<Avatar.Root>
			<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root>
	</div>
</section>
