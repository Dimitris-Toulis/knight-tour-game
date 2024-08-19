<script>
	export let xl = false;
</script>

<button on:click class="bg-blue-500 px-3 py-2 rounded-md text-white" class:text-2xl={xl}
	><slot></slot></button
>
