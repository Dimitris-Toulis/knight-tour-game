<script lang="ts">
	import SettingsInput from "$lib/components/SettingsInput.svelte";
	import SettingsMoves from "$lib/components/SettingsMoves.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import type { Point } from "$lib/helpers";

	export let showModal = false;
	export let dimensions: Point;
	export let moves: Point[];
</script>

<Modal bind:showModal closeBtn="New Game" hasHeader>
	<h2 class="text-2xl text-center" slot="header">Settings</h2>
	<div class="my-4 mx-2 flex flex-col gap-3">
		<SettingsInput name="Columns" id="dimensionX" max={50} min={4} bind:value={dimensions.x}
		></SettingsInput>
		<SettingsInput name="Rows" id="dimensionY" max={50} min={4} bind:value={dimensions.y}
		></SettingsInput>
		<SettingsMoves bind:moves {dimensions}></SettingsMoves>
	</div>
</Modal>
