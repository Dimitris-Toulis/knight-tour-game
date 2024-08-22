<script lang="ts">
	import type { Point } from "$lib/helpers";
	import Modal from "./Modal.svelte";
	import { initialize, solve } from "$lib/solver";
	import Button from "./button.svelte";

	export let grid: number[];
	export let moves: Point[];
	export let dimensions: Point;
	export let showModal: boolean;

	let initialized = false;
	async function solveClick() {
		if (!initialized) await initialize();
		initialized = true;
		const solution = await solve(
			structuredClone(grid),
			structuredClone(dimensions),
			structuredClone(moves)
		);
		console.log(solution);
	}
</script>

<Modal {showModal} hasHeader closeBtn="Close">
	<h3 class="text-2xl text-center" slot="header">Solver</h3>
	<hr />
	<p>
		This solver uses the Warnsdorf's rule to quickly find a solution (if possible) to the current
		grid
	</p>
	<p>
		If there is no solution and it is not detected by some simple heuristics the solver may take a
		long time to run because it needs to check all possible paths
	</p>
	<Button on:click={solveClick} slot="buttons">Solve!</Button>
</Modal>
