<script lang="ts">
	import type { Point } from "$lib/helpers";
	import Modal from "./Modal.svelte";
	import Button from "./Button.svelte";

	export let grid: number[];
	export let moves: Point[];
	export let dimensions: Point;
	export let showModal: boolean;
	export let lastTile: number;
	export let counter: number;
	export let solverUsed: boolean;
	export let freezeGrid: boolean;

	let slowmo = false;

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
			if (slowmo) {
				showModal = false;
				freezeGrid = true;
				for (let i = counter; i <= dimensions.x * dimensions.y; i++) {
					const next = solution.indexOf(i);
					grid[next] = i;
					lastTile = next;
					counter++;
					await new Promise((res) => setTimeout(res, 100));
				}
				freezeGrid = false;
			} else {
				grid = Array.from(solution);
			}
			lastTile = grid.indexOf(dimensions.x * dimensions.y);
			counter = dimensions.x * dimensions.y + 1;
			solverUsed = true;
		} else alert("No solution!");
		showModal = false;
	}
</script>

<Modal bind:showModal hasHeader>
	<h3 class="text-2xl text-center" slot="header">Solver</h3>
	<p>
		This solver uses the Warnsdorf's rule to quickly find a solution (if possible) to the current
		grid
	</p>
	<p>This will not count towards challenges or highscores</p>
	<div class="flex gap-2">
		<input type="checkbox" name="slowmo" id="slowmo" bind:checked={slowmo} />
		<label for="slowmo">Reveal solution step-by-step</label>
	</div>
	<div class="flex justify-center my-3 gap-3">
		<Button on:click={solveClick} slot="buttons">Solve!</Button>
		<Button on:click={() => (showModal = false)} slot="buttons">Close</Button>
	</div>
</Modal>
