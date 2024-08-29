<script lang="ts">
	import SettingsInput from "@/components/SettingsInput.svelte";
	import SettingsMoves from "@/components/SettingsMoves.svelte";
	import Button from "@/components/Button.svelte";
	import Modal from "@/components/Modal.svelte";
	import { presets } from "@/lib/presets";
	import type { Point } from "@/lib/helpers";

	export let showModal = false;
	export let dimensions: Point;
	export let moves: Point[];

	let newSettings = {
		dimensions: structuredClone(dimensions),
		moves: structuredClone(moves)
	};

	function preset(p: string) {
		newSettings.dimensions = structuredClone(presets[p as keyof typeof presets].dimensions);
		newSettings.moves = structuredClone(presets[p as keyof typeof presets].moves);
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

	function changeSettings(e: SubmitEvent) {
		const form = e.target as HTMLFormElement;
		if (form.checkValidity()) {
			dimensions = structuredClone(newSettings.dimensions);
			moves = structuredClone(newSettings.moves);
			setTimeout(() => {
				showModal = false;
			}, 1);
		}
	}
</script>

<Modal bind:showModal hasHeader>
	<h2 class="text-2xl text-center" slot="header">Settings</h2>
	<div class="mbs-4 mx-2 flex flex-col gap-3">
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
		<form on:submit|preventDefault={changeSettings} class="flex flex-col gap-3">
			<div>
				<h3 class="text-xl text-center">Dimensions</h3>
				<hr />
				<p class="my-3">Not all dimensions + moves combinations are solvable</p>
				<p class="text-sm">Knight's Tour is not solvable on 4x4</p>
				<div class="flex md:flex-row flex-col gap-3 justify-evenly">
					<SettingsInput
						name="Columns"
						id="dimensionX"
						max={50}
						min={4}
						bind:value={newSettings.dimensions.x}
					></SettingsInput>
					<SettingsInput
						name="Rows"
						id="dimensionY"
						max={50}
						min={4}
						bind:value={newSettings.dimensions.y}
					></SettingsInput>
				</div>
			</div>
			<SettingsMoves bind:moves={newSettings.moves} dimensions={newSettings.dimensions}
			></SettingsMoves>
			<div class="flex justify-center">
				<Button>New Game</Button>
			</div>
		</form>
	</div>
</Modal>
