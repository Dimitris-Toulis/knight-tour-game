<script lang="ts">
	import Button from "./lib/components/Button.svelte";
	import Tile from "./lib/components/tile.svelte";
	import Modal from "./lib/components/Modal.svelte";
	import type TSettings from "./lib/components/Settings.svelte";
	import type THighscores from "./lib/components/Highscores.svelte";
	import type TChallenges from "./lib/components/Challenges.svelte";
	import type TSolver from "./lib/components/Solver.svelte";
	import type TGuide from "./lib/components/Guide.svelte";

	import { canMove, tileC, tileI } from "./lib/helpers";
	import { newScore } from "./lib/highscores";
	import { presets } from "./lib/presets";
	import { onMount } from "svelte";
	import { checkChallenges, type challengesType } from "./lib/challenges";
	import ThemeToggle from "./lib/components/ThemeToggle.svelte";

	let dimensions = structuredClone(presets.Knight.dimensions);
	let moves = structuredClone(presets.Knight.moves);
	let grid = Array(dimensions.x * dimensions.y).fill(0);

	let counter = 1;
	let lastTile = -1;
	let availableTiles;
	function canGo(to: number) {
		return canMove(tileC(lastTile, dimensions), tileC(to, dimensions), moves);
	}
	let showModalTrapped = false;
	let freezeGrid = false;
	function gridClick(index: number) {
		if (freezeGrid) return;
		if (grid[index] == 0 && (canGo(index) || lastTile == -1)) {
			grid[index] = counter;
			counter++;
			lastTile = index;
			if (counter == dimensions.x * dimensions.y + 1) win();
			if (!solverUsed) {
				newScore(structuredClone(dimensions), structuredClone(moves), structuredClone(counter - 1));
			}
			availableTiles = moves
				.map((m) => ({
					x: tileC(lastTile, dimensions).x + m.x,
					y: tileC(lastTile, dimensions).y + m.y
				}))
				.filter(
					(tile) =>
						grid[tileI(tile, dimensions)] == 0 &&
						tile.x >= 0 &&
						tile.x < dimensions.x &&
						tile.y >= 0 &&
						tile.y < dimensions.y
				);
			if (
				availableTiles.length == 0 &&
				lastTile != -1 &&
				counter != dimensions.x * dimensions.y + 1
			) {
				showModalTrapped = true;
			}
		}
	}
	const show = {
		Highscores: false,
		Challenges: false,
		Solver: false,
		Guide: false,
		Settings: false
	};
	const components: {
		Highscores?: Promise<THighscores>;
		Challenges?: Promise<TChallenges>;
		Solver?: Promise<TSolver>;
		Guide?: Promise<TGuide>;
		Settings?: Promise<TSettings>;
	} = Object.fromEntries(
		Object.entries(show).map(([c, _]) => [
			c,
			(async () => (await import(`./lib/components/${c}.svelte`)).default)()
		])
	);

	let solverUsed = false;

	let showModalWin = false;
	let canvasConfetti: confetti.CreateTypes | undefined = undefined;
	onMount(async () => {
		const canvas = document.getElementById("confetti-canvas") as HTMLCanvasElement;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvasConfetti = (await import("canvas-confetti")).default.create(canvas, {
			disableForReducedMotion: true,
			resize: false,
			useWorker: true
		});
		if (!localStorage.getItem("visited")) {
			localStorage.setItem("visited", "true");
			openModal("Guide");
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
		if (freezeGrid) return;
		if (lastTile == -1) return;
		grid[lastTile] = 0;
		lastTile = counter - 2 == 0 ? -1 : grid.indexOf(counter - 2);
		counter--;
	}

	function changeSettings() {
		restart();
		openModal("Settings");
	}
	$: if (show.Settings) grid = Array(dimensions.x * dimensions.y).fill(0);

	async function openModal(name: keyof typeof components) {
		show[name] = true;
	}
</script>

<ThemeToggle></ThemeToggle>
<div class="px-3 py-5 min-h-[100dvh] flex flex-col gap-7 dark:bg-slate-900 dark:text-gray-100">
	<div class="flex justify-center place-items-center gap-2">
		<h1 class="text-center text-2xl font-500 dark:text-white">Knight's tour game</h1>
		<button
			class="i-material-symbols-help-outline-rounded text-2xl dark:text-gray-300"
			on:click={() => openModal("Guide")}
			aria-label="Open Guide"
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
						x={tileC(index, dimensions).x}
						y={tileC(index, dimensions).y}
						on:click={() => gridClick(index)}
						selected={lastTile == index}
						candidate={lastTile != -1 && grid[index] == 0 && canGo(index) && !freezeGrid}
					></Tile>
				{/each}
			</div>
			<div
				class="flex lg:flex-col flex-row flex-wrap gap-3 place-items-center justify-center pbs-3"
			>
				<div><Button xl on:click={() => openModal("Highscores")}>Highscores</Button></div>
				<div>
					<Button xl on:click={() => openModal("Challenges")}>Challenges</Button>
				</div>
				<div><Button xl on:click={changeSettings}>New Game (Change Settings)</Button></div>
				<div><Button xl on:click={restart}>New Game (Same Settings)</Button></div>
				<div><Button xl on:click={() => openModal("Solver")}>Open Solver</Button></div>
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
{#await components.Settings then Settings}
	<svelte:component this={Settings} bind:dimensions bind:moves bind:showModal={show.Settings}
	></svelte:component>
{/await}

{#await components.Highscores then Highscores}<svelte:component
		this={Highscores}
		bind:showModal={show.Highscores}
	></svelte:component>
{/await}

{#await components.Challenges then Challenges}<svelte:component
		this={Challenges}
		bind:showModal={show.Challenges}
	></svelte:component>
{/await}

{#await components.Solver then Solver}<svelte:component
		this={Solver}
		bind:showModal={show.Solver}
		{dimensions}
		{moves}
		bind:grid
		bind:lastTile
		bind:counter
		bind:solverUsed
		bind:freezeGrid
	></svelte:component>
{/await}

{#await components.Guide then Guide}<svelte:component this={Guide} bind:showModal={show.Guide}
	></svelte:component>
{/await}

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
