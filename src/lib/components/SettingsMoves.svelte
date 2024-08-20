<script lang="ts">
	import type { Point } from "$lib/helpers";
	import Button from "./button.svelte";
	import SettingsInput from "./SettingsInput.svelte";
	export let moves: Point[];
	export let dimensions: Point;

	function setMoves(preset: string) {
		switch (preset) {
			case "default":
				moves = [
					{ x: 1, y: 2 },
					{ x: 1, y: -2 },
					{ x: -1, y: 2 },
					{ x: -1, y: -2 },
					{ x: 2, y: 1 },
					{ x: 2, y: -1 },
					{ x: -2, y: 1 },
					{ x: -2, y: -1 }
				];
				break;
			case "preset2":
				moves = [
					{ x: 3, y: 0 },
					{ x: -3, y: 0 },
					{ x: 0, y: 3 },
					{ x: 0, y: -3 },
					{ x: 2, y: 2 },
					{ x: 2, y: -2 },
					{ x: -2, y: -2 },
					{ x: -2, y: 2 }
				];
				break;
		}
	}
</script>

<div>
	<h3 class="text-xl text-center">Moves</h3>
	<hr />
	<p class="my-2">Symmetric movesets might be more interesting</p>
	<div class="flex gap-3 my-3">
		<Button on:click={() => (moves = [...moves, { x: 0, y: 0 }])}
			><div class="i-material-symbols-add"></div></Button
		>
		<Button on:click={() => setMoves("default")}>Default (Knight)</Button>
		<Button on:click={() => setMoves("preset2")}>Preset 2</Button>
	</div>
	<ul class="flex flex-col gap-2">
		{#each moves as move, index (index)}
			<li class="flex justify-around">
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
				<Button on:click={() => (moves = moves.filter((m, i) => i != index))}
					><div class="i-material-symbols-delete"></div></Button
				>
			</li>
		{/each}
	</ul>
</div>
