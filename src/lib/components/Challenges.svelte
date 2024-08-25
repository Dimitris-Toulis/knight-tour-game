<script lang="ts">
	import Modal from "./Modal.svelte";
	import { challengeStore } from "../challenges";
	import Challenge from "./Challenge.svelte";

	export let showModal = false;
</script>

<Modal bind:showModal hasHeader closeBtn="Close">
	<h2 class="text-2xl text-center" slot="header">Challenges</h2>
	<div class="py-3 flex gap-3 flex-col">
		<Challenge name="Semimagic Square" done={$challengeStore.semimagic}>
			For square boards. Make all columns and rows sum to the same number
		</Challenge>
		<Challenge name="Magic Square" done={$challengeStore.magic}>
			For square boards. Make all columns, rows and diagonals sum to the same number
			<p class="text-sm">Not possible on 8x8 Knight's Tour</p>
		</Challenge>
		<Challenge name="Closed Path" done={$challengeStore.closed}>
			Final tile is reachable from the starting tile
		</Challenge>
		<Challenge name="Bisected Tour (Horizontal)" done={$challengeStore.bisectedH}>
			Fill one horizontal half of the board before entering the other half (for even rows)
		</Challenge>
		<Challenge name="Bisected Tour (Vertical)" done={$challengeStore.bisectedV}>
			Fill one vertical half of the board before entering the other half (for even rows)
		</Challenge>
		<Challenge name="Quadrisected Tour" done={$challengeStore.quadrisected}>
			Fill each quadrant of the board before entering the next one (for even dimensions)
		</Challenge>
	</div>
</Modal>
