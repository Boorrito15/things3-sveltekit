<script lang="ts">
	interface Task {
		id: number;
		text: string;
	}

	let {
		task,
		onSave,
		onCancel
	}: { task: Task; onSave: (text: string) => void; onCancel: () => void } = $props();

	let editText = $state(task.text);

	function save() {
		onSave(editText);
	}

	function cancel() {
		onCancel();
	}
</script>

<div class="task-edit">
	<input type="text" bind:value={editText} class="text-sm" />
	HELLO
	<div class="task-edit-buttons">
		<button onclick={save}>Save</button>
		<button onclick={cancel}>Cancel</button>
	</div>
</div>
