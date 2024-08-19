<script lang="ts">
	import Button from "$lib/components/button.svelte";
	import Tile from "$lib/components/tile.svelte";
	import { tileC, tileI } from "$lib/helpers";
	import type { Point } from "$lib/helpers";
	import Modal from "$lib/components/Modal.svelte";
	import * as confetti from "canvas-confetti";
	import { onMount } from "svelte";

	const dimensions = { x: 10, y: 10 };
	let grid = Array(dimensions.x * dimensions.y).fill(0);

	let counter = 1;
	let lastTile = -1;
	function canMove(from: Point, to: Point) {
		const distanceX = Math.abs(from.x - to.x);
		const distanceY = Math.abs(from.y - to.y);
		return distanceX + distanceY == 3 && distanceX > 0 && distanceY > 0;
	}
	function canGo(to: number) {
		return canMove(tileC(lastTile, dimensions), tileC(to, dimensions));
	}
	function gridClick(index: number) {
		if (grid[index] == 0 && (canGo(index) || lastTile == -1)) {
			grid[index] = counter;
			counter++;
			lastTile = index;
		}
		if (counter == dimensions.x * dimensions.y + 1) win();
	}

	let showModal = false;
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
	function win() {
		showModal = true;

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
</script>

<div class="px-3 py-5 min-h-[100dvh] flex flex-col gap-7">
	<h1 class="text-center text-2xl font-500">Knight Tour Game</h1>
	<main class="flex-1">
		<div class="grid md:grid-cols-2 gap-5">
			<div class="flex place-items-center justify-center">
				<div class="grid grid-cols-10 border-4 border-black max-w-[min(80dvh,80dvw)] flex-1">
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
				<div><Button xl on:click={restart}>New Game</Button></div>
				<div><Button xl on:click={undo}>Undo</Button></div>
			</div>
		</div>
	</main>
</div>

<Modal bind:showModal>
	<h2 class="text-4xl">You won!</h2>
	<canvas id="confetti-canvas"></canvas>
</Modal>

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
</style>
