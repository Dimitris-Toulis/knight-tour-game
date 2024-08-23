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
		_grid: number[],
		dimensions: Point,
		_moves: Point[],
		lastTile: number
	) => Promise<Int32Array | undefined> | Promise<Uint32Array | undefined>;
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
			structuredClone(moves),
			lastTile
		);
		if (solution) {
			grid = Array.from(solution);
			lastTile = grid.indexOf(dimensions.x * dimensions.y);
			counter = dimensions.x * dimensions.y + 1;
		} else alert("No solution!");
	}
</script>

<Modal bind:showModal hasHeader closeBtn="Close">
	<h3 class="text-2xl text-center" slot="header">Solver</h3>
	<hr />
	<p>
		This solver uses the Warnsdorf's rule to quickly find a solution (if possible) to the current
		grid
	</p>
	<p>This will not count towards challenges</p>
	<Button on:click={solveClick} slot="buttons">Solve!</Button>
</Modal>
