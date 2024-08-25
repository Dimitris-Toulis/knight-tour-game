<script lang="ts">
	import Modal from "./Modal.svelte";
	import { scoreStore } from "../highscores";
	import { presets } from "../presets";
	import { deepEqual } from "../helpers";
	import Button from "./Button.svelte";

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

	function deleteScore(index: number) {
		$scoreStore = $scoreStore.filter((_, i) => i != index);
	}

	export let showModal = false;
</script>

<Modal bind:showModal hasHeader closeBtn="Close">
	<h2 class="text-2xl text-center" slot="header">Highscores</h2>
	<div class="p-3">
		{#if $scoreStore.length == 0}
			<p class="text-center">Go play!</p>
		{/if}
		<ul class="list-disc flex flex-col gap-1">
			{#each namedHighscores as score, index (score[0])}
				<li class="text-lg">
					<div class="flex gap-4 justify-between">
						<div><span>{score[0]}</span>: <span class="font-500">{score[1]}</span></div>
						<div class="flex place-items-center">
							<Button color="red" classes="!p-2" on:click={() => deleteScore(index)}
								><div class="i-material-symbols-delete"></div></Button
							>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</Modal>
