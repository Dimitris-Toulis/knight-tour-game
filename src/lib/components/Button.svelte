<script lang="ts">
	export let xl = false;
	export let classes: string = "";
	export let color = "blue";
</script>

<button
	on:click
	class="!bg-{color}-500 !hover:bg-{color}-600 !dark:hover:bg-{color}-700 dark:!bg-{color}-600 px-3 py-2 rounded-md text-white appearance-none {classes}"
	class:text-2xl={xl}
	{...$$restProps}><slot></slot></button
>
