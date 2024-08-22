<script lang="ts">
	import Modal from "./Modal.svelte";
	import { scoreStore } from "$lib/highscores";
	import { presets } from "$lib/presets";
	import { deepEqual } from "$lib/helpers";

	let namedHighscores: Map<string, number>;
	$: namedHighscores = new Map(
		$scoreStore.map((score) => {
			const customMoveDesc: string | null = (Object.entries(presets).find((preset) =>
				deepEqual(score.settings.moves, preset[1].moves)
			) ?? [null])[0];
			const moveDesc = JSON.stringify(score.settings.moves)
				.replaceAll('"x"', "x")
				.replaceAll('"y"', "y");
			const name = `${score.settings.dimensions.x}x${score.settings.dimensions.y} ${customMoveDesc ? customMoveDesc : "with moves: " + moveDesc}`;
			return [name, score.score];
		})
	);

	export let showModal = false;
</script>

<Modal bind:showModal hasHeader closeBtn="Close">
	<h2 class="text-2xl text-center" slot="header">Highscores</h2>
	<div class="py-3">
		<ul>
			{#each namedHighscores as score (score[0])}
				<li class="text-lg"><span>{score[0]}</span>: <span class="font-500">{score[1]}</span></li>
			{/each}
			{#if $scoreStore.length == 0}
				<p class="text-center">Go play!</p>
			{/if}
		</ul>
	</div>
</Modal>
