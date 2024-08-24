<script lang="ts">
	export let value: number;
	export let name: string;
	export let id: string;
	export let max: number;
	export let min: number;
</script>

<div class="flex gap-3 place-items-center justify-between">
	<label for={id}>{name}</label>
	<input
		type="number"
		name={id}
		{id}
		class="border-black border-1 p-2 rounded-md invalid:border-red-500"
		required
		{min}
		{max}
		step={1}
		bind:value
	/>
</div>
