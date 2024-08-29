<script lang="ts">
	import type { Point } from "@/lib/helpers";
	import Modal from "@/components/Modal.svelte";
	import Button from "@/components/Button.svelte";

	export let grid: number[];
	export let moves: Point[];
	export let dimensions: Point;
	export let showModal: boolean;
	export let lastTile: number;
	export let counter: number;
	export let solverUsed: boolean;
	export let freezeGrid: boolean;

	let slowmo = false;
	let error: string = "";
	let status = 0;

	let initialized = false;
	let _solve: (
		_grid: number[],
		dimensions: Point,
		_moves: Point[],
		lastTile: number
	) => Promise<Int32Array | undefined> | Promise<Uint32Array | undefined>;
	async function initialize() {
		if (initialized) return _solve;
		status = 1;
		const { initialize: init, solve } = await import("@/lib/solver");
		await init();
		initialized = true;
		return (_solve = solve);
	}
	async function solveClick() {
		try {
			const solve = await initialize();
			status = 2;
			const solution = await solve(
				structuredClone(grid),
				structuredClone(dimensions),
				structuredClone(moves),
				lastTile
			);
			if (solution) {
				solverUsed = true;
				if (slowmo) {
					showModal = false;
					freezeGrid = true;
					status = 3;
					for (let i = counter; i <= dimensions.x * dimensions.y; i++) {
						if (!slowmo) {
							grid = Array.from(solution);
							lastTile = grid.indexOf(dimensions.x * dimensions.y);
							counter = dimensions.x * dimensions.y + 1;
							break;
						}
						// check if restarted
						if (i > 1 && lastTile == -1) {
							break;
						}
						const next = solution.indexOf(i);
						grid[next] = i;
						lastTile = next;
						counter++;
						await new Promise((res) => setTimeout(res, 100));
					}
					freezeGrid = false;
				} else {
					grid = Array.from(solution);
					lastTile = grid.indexOf(dimensions.x * dimensions.y);
					counter = dimensions.x * dimensions.y + 1;
				}
			} else {
				status = 4;
				error = "No solution possible!";
				return;
			}
			showModal = false;
			status = 0;
		} catch (e) {
			status = 4;
			if (e instanceof Error) error = e.message;
			else error = JSON.stringify(e);
		}
	}
	$: if (showModal) status = 0;
</script>

<Modal bind:showModal hasHeader>
	<h3 class="text-2xl text-center" slot="header">Solver</h3>
	<p>
		This solver uses the Warnsdorf's rule to quickly find a solution (if possible) to the current
		board
	</p>
	<p>This will not count towards challenges or highscores</p>
	<div class="flex gap-2">
		<input type="checkbox" name="slowmo" id="slowmo" bind:checked={slowmo} />
		<label for="slowmo">Reveal solution step-by-step</label>
	</div>
	<p class:hidden={status != 1}>Downloading solver...</p>
	<div class="flex justify-center place-items-center my-4" class:!hidden={status != 2}>
		<div
			class="border-t-white border-r-white border-b-slate-7 border-l-slate-7 rounded-full aspect-ratio-square w-20 border-3 animate-spin"
		></div>
	</div>
	<p class="text-red-6" class:hidden={status != 4}>Error: {error}</p>
	<div class="flex justify-center my-3 gap-3">
		<Button on:click={solveClick} slot="buttons">Solve!</Button>
		<Button on:click={() => (showModal = false)} slot="buttons">Close</Button>
	</div>
</Modal>
