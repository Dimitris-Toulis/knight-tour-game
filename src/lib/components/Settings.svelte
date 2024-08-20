<script lang="ts">
	import SettingsInput from "$lib/components/SettingsInput.svelte";
	import SettingsMoves from "$lib/components/SettingsMoves.svelte";
	import Button from "./button.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import type { Point } from "$lib/helpers";

	export let showModal = false;
	export let dimensions: Point;
	export let moves: Point[];

	function preset(n: number) {
		switch (n) {
			case 0:
				dimensions.x = 8;
				dimensions.y = 8;
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
			case 1:
				dimensions.x = 10;
				dimensions.y = 10;
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

<Modal bind:showModal closeBtn="New Game" hasHeader>
	<h2 class="text-2xl text-center" slot="header">Settings</h2>
	<div class="my-4 mx-2 flex flex-col gap-3">
		<div>
			<h3 class="text-xl text-center">Presets</h3>
			<hr />
			<div class="flex my-3 gap-2">
				<Button on:click={() => preset(0)}>Default (Knight)</Button>
				<Button on:click={() => preset(1)}>Preset Star</Button>
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
