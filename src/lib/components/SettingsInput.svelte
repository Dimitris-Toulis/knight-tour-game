<script lang="ts">
	export let value: number;
	export let name: string;
	function preventNonNumbers(e: Event) {
		const elem = e.target as HTMLInputElement;
		let val = parseInt(elem.value) || 0;
		if (val < 4) val = 4;
		if (val > 50) val = 50;
		elem.value = val.toString();
	}
</script>

<div class="flex gap-3 place-items-center justify-between">
	<label for={name}>{name}</label>
	<input
		type="number"
		{name}
		id={name}
		class="border-black border-1 p-2"
		min="4"
		max="50"
		on:input={preventNonNumbers}
		bind:value
	/>
</div>
