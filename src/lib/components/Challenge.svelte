<script lang="ts">
	export let name: string;
	export let done: boolean;
</script>

<div>
	<div
		class="flex gap-2 place-items-center justify-center"
		class:text-green-600={done}
		class:dark:text-green-500={done}
	>
		{#if done}
			<div class="i-material-symbols-check-rounded inline-block text-2xl"></div>
		{/if}
		<h3 class="text-xl text-center">{name}</h3>
	</div>
	<hr />
	<p><slot></slot></p>
</div>
