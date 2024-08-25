<script lang="ts">
	import type { Point } from "$lib/helpers";
	import Button from "./Button.svelte";
	import SettingsInput from "./SettingsInput.svelte";
	export let moves: Point[];
	export let dimensions: Point;
</script>

<div>
	<h3 class="text-xl text-center">Moves</h3>
	<hr />
	<div class="flex place-items-center justify-between gap-2">
		<p class="my-2">Symmetric moves might be more interesting</p>
		<div class="flex gap-3 my-3">
			<Button on:click={() => (moves = [...moves, { x: 0, y: 0 }])} type="button"
				><div class="i-material-symbols-add text-lg"></div></Button
			>
		</div>
	</div>
	<ul class="flex flex-col gap-2">
		{#each moves as move, index (index)}
			<li class="flex justify-between">
				<div class="flex justify-around flex-1">
					<SettingsInput
						id={"move-x" + index}
						name="X"
						max={dimensions.x}
						min={-dimensions.x}
						bind:value={move.x}
					></SettingsInput>
					<SettingsInput
						id={"move-y" + index}
						name="Y"
						max={dimensions.y}
						min={-dimensions.y}
						bind:value={move.y}
					></SettingsInput>
				</div>
				<Button
					on:click={() => (moves = moves.filter((m, i) => i != index))}
					type="button"
					color="red"><div class="i-material-symbols-delete text-lg"></div></Button
				>
			</li>
		{/each}
	</ul>
</div>
