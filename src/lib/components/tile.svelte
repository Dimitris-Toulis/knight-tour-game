<script>
	export let num;
</script>

<button
	on:click
	class="aspect-ratio-square border-black border-1 flex place-items-center justify-center"
>
	<span>{num == 0 ? "" : num}</span>
</button>
