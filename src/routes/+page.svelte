<script lang="ts">
	import Button from "$lib/components/button.svelte";
	import Tile from "$lib/components/tile.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import Settings from "$lib/components/Settings.svelte";
	import Highscores from "$lib/components/Highscores.svelte";

	import { tileC, tileI } from "$lib/helpers";
	import type { Point } from "$lib/helpers";
	import { newScore } from "$lib/highscores";
	import * as confetti from "canvas-confetti";
	import { onMount } from "svelte";

	let dimensions = { x: 8, y: 8 };
	let moves = [
		{ x: 1, y: 2 },
		{ x: 1, y: -2 },
		{ x: -1, y: 2 },
		{ x: -1, y: -2 },
		{ x: 2, y: 1 },
		{ x: 2, y: -1 },
		{ x: -2, y: 1 },
		{ x: -2, y: -1 }
	];
	let grid: number[];
	$: grid = Array(dimensions.x * dimensions.y).fill(0);

	let counter = 1;
	let lastTile = -1;
	function canMove(from: Point, to: Point) {
		const dist = { x: to.x - from.x, y: to.y - from.y };
		return moves.some((m) => m.x == dist.x && m.y == dist.y);
	}
	let availableTiles = [];
	$: availableTiles =
		lastTile == -1
			? []
			: moves
					.map((m) => ({
						x: tileC(lastTile, dimensions).x + m.x,
						y: tileC(lastTile, dimensions).y + m.y
					}))
					.filter((tile) => grid[tileI(tile, dimensions)] == 0);
	$: if (availableTiles.length == 0 && lastTile != -1 && counter != dimensions.x * dimensions.y + 1)
		showModalTrapped = true;
	function canGo(to: number) {
		return canMove(tileC(lastTile, dimensions), tileC(to, dimensions));
	}
	let showModalTrapped = false;
	function gridClick(index: number) {
		if (grid[index] == 0 && (canGo(index) || lastTile == -1)) {
			grid[index] = counter;
			counter++;
			lastTile = index;
			if (counter == dimensions.x * dimensions.y + 1) win();
			newScore(structuredClone(dimensions), structuredClone(moves), structuredClone(counter - 1));
		}
	}

	let showModalWin = false;
	let canvasConfetti: confetti.CreateTypes | undefined = undefined;
	onMount(async () => {
		const canvas = document.getElementById("confetti-canvas") as HTMLCanvasElement;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvasConfetti = await confetti.create(canvas, {
			disableForReducedMotion: true,
			resize: false,
			useWorker: true
		});
	});

	let highscore: number = 0;
	onMount(() => (highscore = parseInt(localStorage.getItem("highscore") ?? "0")));
	function win() {
		showModalWin = true;

		if (canvasConfetti)
			canvasConfetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.7 }
			});
	}

	function restart() {
		grid = Array(dimensions.x * dimensions.y).fill(0);
		counter = 1;
		lastTile = -1;
	}

	function undo() {
		grid[lastTile] = 0;
		lastTile = counter - 2 == 0 ? -1 : grid.indexOf(counter - 2);
		counter--;
	}

	let showModalSettings = false;
	function changeSettings() {
		restart();
		showModalSettings = true;
	}

	let showHighscoresModal = false;
</script>

<div class="px-3 py-5 min-h-[100dvh] flex flex-col gap-7">
	<h1 class="text-center text-2xl font-500">Knight Tour Game</h1>
	<main class="flex-1">
		<div class="flex gap-5 <lg:flex-col" class:flex-col={dimensions.x > 15}>
			<div class="flex place-items-center justify-center flex-1">
				<div
					id="main-grid"
					class="grid border-4 border-black lg:max-w-[min(80dvh,80dvw)] flex-1"
					class:!max-w-full={dimensions.x > 15}
					style="--dimensionX: {dimensions.x}"
				>
					{#each grid as n, index (index)}
						<Tile
							num={n}
							on:click={() => gridClick(index)}
							selected={lastTile == index}
							candidate={lastTile != -1 && grid[index] == 0 && canGo(index)}
						></Tile>
					{/each}
				</div>
			</div>
			<div class="flex flex-col gap-3 place-items-center justify-center pbs-3 grid-">
				<div><Button xl on:click={() => (showHighscoresModal = true)}>Highscores</Button></div>
				<div><Button xl on:click={changeSettings}>New Game (Change Settings)</Button></div>
				<div><Button xl on:click={restart}>New Game (Same Settings)</Button></div>
				<div><Button xl on:click={undo}>Undo</Button></div>
			</div>
		</div>
	</main>
</div>

<Modal bind:showModal={showModalWin}>
	<h2 class="text-4xl">You won!</h2>
	<canvas id="confetti-canvas"></canvas>
</Modal>
<Modal bind:showModal={showModalTrapped}>
	<h2 class="text-4xl">You don't have any moves available!</h2>
</Modal>
<Settings bind:dimensions bind:moves bind:showModal={showModalSettings}></Settings>
<Highscores bind:showModal={showHighscoresModal}></Highscores>

<style>
	#confetti-canvas {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		pointer-events: none;
		z-index: 100;
		width: 100%;
		height: 100%;
	}
	#main-grid {
		grid-template-columns: repeat(var(--dimensionX), minmax(0, 1fr));
	}
</style>
