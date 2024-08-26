<script lang="ts">
	import Button from "./Button.svelte";
	export let showModal: boolean;
	export let closeBtn: string = "";
	export let hasHeader: boolean = false;

	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) {
		dialog.showModal();
		dialog.focus();
		dialog.blur();
	}
	$: if (dialog && !showModal) dialog.close();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
	class="rounded-md p-0 max-w-lg"
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation class="p-4 dark:bg-slate-7 dark:text-gray-100">
		{#if hasHeader}
			<slot name="header" />
			<hr class="mb-1" />
		{/if}
		<slot />
		{#if closeBtn != ""}
			<div class="flex justify-center">
				<Button on:click={() => dialog.close()}>{closeBtn}</Button>
			</div>
		{/if}
	</div>
</dialog>

<style>
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	:global(body.dark) dialog::backdrop {
		background: rgba(0, 0, 0, 0.4);
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
