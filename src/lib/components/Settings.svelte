<script lang="ts">
	import SettingsInput from "$lib/components/SettingsInput.svelte";
	import SettingsMoves from "$lib/components/SettingsMoves.svelte";
	import Button from "./button.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import { presets } from "$lib/presets";
	import type { Point } from "$lib/helpers";

	export let showModal = false;
	export let dimensions: Point;
	export let moves: Point[];

	function preset(p: string) {
		dimensions = structuredClone(presets[p as keyof typeof presets].dimensions);
		moves = structuredClone(presets[p as keyof typeof presets].moves);
	}
	function exportSettings() {
		alert(JSON.stringify({ dimensions, moves }));
	}
	function importSettings() {
		const settings = JSON.parse(prompt("Settings") ?? "{}");
		if (typeof settings?.dimensions?.x == "number" && typeof settings?.dimensions?.y == "number") {
			if (
				Array.isArray(settings?.moves) &&
				settings.moves.every((move: any) => typeof move.x == "number" && typeof move.y == "number")
			) {
				dimensions.x = settings.dimensions.x;
				dimensions.y = settings.dimensions.y;
				moves = [];
				settings.moves.forEach((move: Point) => {
					moves.push({ x: move.x, y: move.y });
				});
			}
		}
	}
</script>

<Modal bind:showModal closeBtn="New Game" hasHeader>
	<h2 class="text-2xl text-center" slot="header">Settings</h2>
	<div class="my-4 mx-2 flex flex-col gap-3">
		<div>
			<h3 class="text-xl text-center">Presets</h3>
			<hr />
			<div class="flex my-3 gap-2 flex-wrap justify-center">
				{#each Object.entries(presets) as [name, _], index (index)}
					<Button on:click={() => preset(name)}>{name}{index == 0 ? " (Default)" : ""}</Button>
				{/each}
				<Button on:click={exportSettings}>Export settings</Button>
				<Button on:click={importSettings}>Import settings</Button>
			</div>
		</div>
		<div>
			<h3 class="text-xl text-center">Dimensions</h3>
			<hr />
			<p class="my-3">
				Not all dimensions + moveset combinations are solvable
				<span class="text-sm">Knight's Tour is not solvable on 4x4</span>
			</p>
			<div class="flex flex-col gap-3">
				<SettingsInput name="Columns" id="dimensionX" max={50} min={4} bind:value={dimensions.x}
				></SettingsInput>
				<SettingsInput name="Rows" id="dimensionY" max={50} min={4} bind:value={dimensions.y}
				></SettingsInput>
			</div>
		</div>
		<SettingsMoves bind:moves {dimensions}></SettingsMoves>
	</div>
</Modal>
