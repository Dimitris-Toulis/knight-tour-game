<script lang="ts">
	import Modal from "@/components/Modal.svelte";

	export let showModal: boolean = false;
</script>

<Modal bind:showModal hasHeader closeBtn="Play!">
	<h2 class="text-2xl text-center" slot="header">How to play?</h2>
	<ul class="list-disc px-3 pt-1 pb-3">
		<li>
			You have a board and your goal is to fill it. You can start anywhere and then you can move
			like a knight (chess) to squares that are not filled
		</li>
		<li>
			Your current square is colored blue and the squares that you can move to are colored green
		</li>
		<li>You can change the dimensions of the board and the moves possible in the settings</li>
		<li>There are also challenges that you can complete</li>
		<li>
			The solver can find the solution from your current board if it exists. Solutions from the
			solver will not count towards challenges and highscores
		</li>
	</ul>
</Modal>
