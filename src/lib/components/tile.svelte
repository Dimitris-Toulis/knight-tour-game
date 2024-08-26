<script lang="ts">
	export let num: number;
	export let selected = false;
	export let candidate = true;
	export let x: number;
	export let y: number;
</script>

<button
	on:click
	class="aspect-ratio-square flex place-items-center justify-center font-400 overflow-y-hidden bg-white dark:bg-slate-900"
	class:!bg-blue-600={selected}
	class:!bg-green-600={candidate}
	class:text-white={selected || candidate}
	aria-label="{x},{y}"
	tabindex={candidate ? 0 : -1}
>
	<span>{num == 0 ? "" : num}</span>
</button>
