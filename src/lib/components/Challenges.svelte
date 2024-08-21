<script lang="ts">
	import Modal from "./Modal.svelte";

	export let showModal = false;
</script>

<Modal bind:showModal hasHeader closeBtn="Close">
	<h2 class="text-2xl text-center" slot="header">Challenges</h2>
	<div class="py-3 flex gap-3 flex-col">
		<div>
			<h3 class="text-xl text-center">Semimagic Square</h3>
			<hr />
			<p>For square boards. Make all columns and rows sum to the same number</p>
		</div>
		<div>
			<h3 class="text-xl text-center">Magic Square</h3>
			<hr />
			<p>For square boards. Make all columns, rows and diagonals sum to the same number</p>
			<p class="text-sm">Not possible on 8x8 Knight's Tour</p>
		</div>
		<div>
			<h3 class="text-xl text-center">Closed Path</h3>
			<hr />
			<p>Final tile is reachable from the starting tile</p>
		</div>
		<div>
			<h3 class="text-xl text-center">Bisected Tour (Horizontal)</h3>
			<hr />
			<p>Fill half of the board before entering the other half (for even rows)</p>
		</div>
		<div>
			<h3 class="text-xl text-center">Bisected Tour (Vertical)</h3>
			<hr />
			<p>Fill half of the board before entering the other half (for even columns)</p>
		</div>
		<div>
			<h3 class="text-xl text-center">Quadrisected Tour</h3>
			<hr />
			<p>Fill each quadrant of the board before entering the next one (for even dimensions)</p>
		</div>
	</div>
</Modal>
