<script lang="ts">
	export let value: number;
	export let name: string;
	export let id: string;
	export let max: number;
	export let min: number;
	function preventNonNumbers(e: Event) {
		const elem = e.target as HTMLInputElement;
		let val = parseInt(elem.value) || 0;
		if (val < min) val = min;
		if (val > max) val = max;
		elem.value = val.toString();
	}
</script>

<div class="flex gap-3 place-items-center justify-between">
	<label for={id}>{name}</label>
	<input
		type="number"
		name={id}
		{id}
		class="border-black border-1 p-2"
		{min}
		{max}
		on:input={preventNonNumbers}
		bind:value
	/>
</div>
