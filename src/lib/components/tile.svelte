<script>
	export let num;
	export let selected = false;
	export let candidate = true;
</script>

<button
	on:click
	class="aspect-ratio-square border-black border-1 flex place-items-center justify-center font-400 dark:border-gray-300"
	class:bg-blue-600={selected}
	class:bg-green-600={candidate}
	class:text-white={selected || candidate}
>
	<span>{num == 0 ? "" : num}</span>
</button>
