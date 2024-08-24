<script lang="ts">
	export let xl = false;
	export let classes: string = "";
</script>

<button
	on:click
	class="!bg-blue-500 dark:!bg-blue-600 px-3 py-2 rounded-md text-white appearance-none {classes}"
	class:text-2xl={xl}
	{...$$restProps}><slot></slot></button
>
