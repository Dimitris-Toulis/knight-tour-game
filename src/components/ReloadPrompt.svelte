<script lang="ts">
	import { useRegisterSW } from "virtual:pwa-register/svelte";
	import Button from "./Button.svelte";

	const intervalMS = 60 * 60 * 1000;

	const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
		onRegisteredSW(swUrl, r) {
			console.log("SW registered");
			r &&
				setInterval(async () => {
					if (r.installing || !navigator) return;

					if ("connection" in navigator && !navigator.onLine) return;

					const resp = await fetch(swUrl, {
						cache: "no-store",
						headers: {
							cache: "no-store",
							"cache-control": "no-cache"
						}
					});

					if (resp?.status === 200) await r.update();
				}, intervalMS);
		},
		onRegisterError(error) {
			console.log("SW registration error", error);
		}
	});

	function close() {
		$offlineReady = false;
		$needRefresh = false;
	}

	$: toast = $offlineReady || $needRefresh;
</script>

{#if toast}
	<div
		class="fixed right-0 bottom-0 m-4 p-3 text-center z-1 rounded-md border-1 border-gray-300 dark:border-gray-700 dark:bg-slate-8 bg-gray-100 dark:text-white shadow-lg shadow-gray-200 dark:shadow-slate-800 dark:shadow-md"
		role="alert"
	>
		<div class="mb-2">
			{#if $offlineReady}
				<p>App ready to work offline</p>
			{:else}
				<p>Update available</p>
				<p>Click on reload button to update</p>
			{/if}
		</div>
		<div class="flex gap-3 flex-row justify-center">
			{#if $needRefresh}
				<Button on:click={() => updateServiceWorker(true)}>Reload</Button>
			{/if}
			<Button on:click={close}>Close</Button>
		</div>
	</div>
{/if}
