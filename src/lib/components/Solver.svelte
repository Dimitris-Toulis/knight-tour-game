<script lang="ts">
	import type { Point } from "$lib/helpers";
	import Modal from "./Modal.svelte";
	import Button from "./button.svelte";

	export let grid: number[];
	export let moves: Point[];
	export let dimensions: Point;
	export let showModal: boolean;
	export let lastTile: number;
	export let counter: number;

	let initialized = false;
	let _solve: (
		grid: number[],
		dimensions: Point,
		moves: Point[]
	) => Promise<Uint32Array | undefined>;
	async function initialize() {
		if (initialized) return _solve;
		const { initialize: init, solve } = await import("$lib/solver");
		await init();
		initialized = true;
		return (_solve = solve);
	}
	async function solveClick() {
		const solve = await initialize();
		const solution = await solve(
			structuredClone(grid),
			structuredClone(dimensions),
			structuredClone(moves)
		);
		if (solution) {
			grid = Array.from(solution);
			lastTile = grid.indexOf(dimensions.x * dimensions.y);
			counter = dimensions.x * dimensions.y + 1;
		} else alert("No solution!");
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
