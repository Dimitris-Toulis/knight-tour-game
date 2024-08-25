<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Tile from "$lib/components/tile.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import Settings from "$lib/components/Settings.svelte";
	import Highscores from "$lib/components/Highscores.svelte";
	import Challenges from "$lib/components/Challenges.svelte";
	import Solver from "$lib/components/Solver.svelte";

	import { canMove, tileC, tileI } from "$lib/helpers";
	import { newScore } from "$lib/highscores";
	import { presets } from "$lib/presets";
	import * as confetti from "canvas-confetti";
	import { onMount } from "svelte";
	import { checkChallenges, type challengesType } from "$lib/challenges";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";
	import Guide from "$lib/components/Guide.svelte";

	let dimensions = structuredClone(presets.Knight.dimensions);
	let moves = structuredClone(presets.Knight.moves);
	let grid = Array(dimensions.x * dimensions.y).fill(0);

	let counter = 1;
	let lastTile = -1;
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
		return canMove(tileC(lastTile, dimensions), tileC(to, dimensions), moves);
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

	let showHighscoresModal = false;
	let showChallengeModal = false;
	let showSolverModal = false;
	let showGuide = false;
	let solverUsed = false;

	let showModalWin = false;
	let canvasConfetti: confetti.CreateTypes | undefined = undefined;
	onMount(async () => {
		const canvas = document.getElementById("confetti-canvas") as HTMLCanvasElement;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvasConfetti = confetti.create(canvas, {
			disableForReducedMotion: true,
			resize: false,
			useWorker: true
		});
		if (!localStorage.getItem("visited")) {
			localStorage.setItem("visited", "true");
			showGuide = true;
		}
	});

	let challenges: challengesType = {
		magic: false,
		semimagic: false,
		closed: false,
		bisectedH: false,
		bisectedV: false,
		quadrisected: false
	};
	function win() {
		if (solverUsed) return;
		challenges = checkChallenges(
			Array(dimensions.x)
				.fill(null)
				.map((_, x) =>
					Array(dimensions.y)
						.fill(null)
						.map((_, y) => grid[tileI({ x, y }, dimensions)])
				),
			moves,
			dimensions
		);
		showModalWin = true;
		if (canvasConfetti) {
			var end = Date.now() + 5 * 1000;

			(async function frame() {
				canvasConfetti({
					particleCount: 30,
					spread: 55,
					origin: { x: 0.35, y: 0.55 }
				});
				canvasConfetti({
					particleCount: 30,
					spread: 55,
					origin: { x: 0.65, y: 0.55 }
				});
				await new Promise((res) => setTimeout(res, 100));

				if (Date.now() < end) {
					requestAnimationFrame(frame);
				}
			})();
		}
	}

	function restart() {
		grid = Array(dimensions.x * dimensions.y).fill(0);
		counter = 1;
		lastTile = -1;
		solverUsed = false;
	}

	function undo() {
		if (lastTile == -1) return;
		grid[lastTile] = 0;
		lastTile = counter - 2 == 0 ? -1 : grid.indexOf(counter - 2);
		counter--;
	}

	let showModalSettings = false;
	function changeSettings() {
		restart();
		showModalSettings = true;
	}

	$: if (showModalSettings) grid = Array(dimensions.x * dimensions.y).fill(0);
</script>

<ThemeToggle></ThemeToggle>
<div class="px-3 py-5 min-h-[100dvh] flex flex-col gap-7 dark:bg-slate-900 dark:text-gray-100">
	<div class="flex justify-center place-items-center gap-2">
		<h1 class="text-center text-2xl font-500 dark:text-white">Knight Tour Game</h1>
		<button
			class="i-material-symbols-help-outline-rounded text-2xl dark:text-gray-300"
			on:click={() => (showGuide = true)}
		></button>
	</div>
	<main class="flex-1">
		<div class="flex gap-5 <lg:flex-col justify-evenly" class:flex-col={dimensions.x > 15}>
			<div
				id="main-grid"
				class="grid border-4 border-black lg:max-w-[min(80dvh,80dvw)] flex-1 dark:border-gray-100 dark:border-3"
				class:!max-w-full={dimensions.x > 15}
				style="--dimensionX: {dimensions.x}; --max-digits: {Math.ceil(
					Math.log10(dimensions.x * dimensions.y)
				) - 1}"
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
			<div class="flex flex-col gap-3 place-items-center justify-center pbs-3 grid-">
				<div><Button xl on:click={() => (showHighscoresModal = true)}>Highscores</Button></div>
				<div>
					<Button xl on:click={() => (showChallengeModal = true)}>Challenges</Button>
				</div>
				<div><Button xl on:click={changeSettings}>New Game (Change Settings)</Button></div>
				<div><Button xl on:click={restart}>New Game (Same Settings)</Button></div>
				<div><Button xl on:click={() => (showSolverModal = true)}>Open Solver</Button></div>
				<div><Button xl on:click={undo}>Undo</Button></div>
			</div>
		</div>
	</main>
</div>

<Modal bind:showModal={showModalWin}>
	<h2 class="text-4xl text-center">You won!</h2>
	<div class="flex flex-col gap-2">
		{#if challenges.semimagic}
			<p class="font-600">Congratulations! Your board is semimagic!</p>
		{/if}
		{#if !challenges.semimagic && challenges.magic}
			<p class="font-600">Congratulations! Your board is magic!!</p>
		{/if}
		{#if challenges.closed}
			<p class="font-600">Congratulations! Your tour is closed!</p>
		{/if}
		{#if challenges.bisectedH}
			<p class="font-600">Congratulations! Your tour is horizontally bisected!</p>
		{/if}
		{#if challenges.bisectedV}
			<p class="font-600">Congratulations! Your tour is vertically bisected!</p>
		{/if}
		{#if challenges.quadrisected}
			<p class="font-600">Congratulations! Your tour is quadrisected!</p>
		{/if}
	</div>
	<canvas id="confetti-canvas"></canvas>
</Modal>
<Modal bind:showModal={showModalTrapped}>
	<h2 class="text-4xl">You don't have any moves available!</h2>
</Modal>
<Settings bind:dimensions bind:moves bind:showModal={showModalSettings}></Settings>
<Highscores bind:showModal={showHighscoresModal}></Highscores>
<Challenges bind:showModal={showChallengeModal}></Challenges>
<Solver
	bind:showModal={showSolverModal}
	{dimensions}
	{moves}
	bind:grid
	bind:lastTile
	bind:counter
	bind:solverUsed
></Solver>
<Guide bind:showModal={showGuide}></Guide>

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
		font-size: clamp(
			calc(1rem / var(--max-digits)),
			calc(1.5 * (0.7283rem + 1.8898vw) / var(--max-digits)),
			calc(2.5rem / var(--max-digits))
		);
	}
</style>
