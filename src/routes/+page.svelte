<script lang="ts">
	import Button from "$lib/components/button.svelte";
	import Tile from "$lib/components/tile.svelte";
	import { tileC, tileI } from "$lib/helpers";
	import type { Point } from "$lib/helpers";

	const dimensions = { x: 10, y: 10 };
	const grid = Array(dimensions.x * dimensions.y).fill(0);

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
				<div><Button xl>New Game</Button></div>
				<div><Button xl>Undo</Button></div>
			</div>
		</div>
	</main>
</div>
