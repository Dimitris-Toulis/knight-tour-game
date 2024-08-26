<script lang="ts">
	let mode: "dark" | "light" =
		(localStorage.getItem("mode") as "dark" | "light") ??
		(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
	if (mode == "dark") document.body.classList.add("dark");
	function changeMode() {
		if (mode == "dark") mode = "light";
		else if (mode == "light") mode = "dark";
		localStorage.setItem("mode", mode);
		if (mode == "dark") document.body.classList.add("dark");
		else document.body.classList.remove("dark");
	}
</script>

<button
	class="position-absolute top-0 right-0 w-10 h-10 flex justify-center place-items-center text-3xl mbs-1 mie-1"
	on:click={changeMode}
	aria-label="Change Theme"
>
	<div class="i-material-symbols-mode-night text-yellow-500" class:hidden={mode == "dark"}></div>
	<div
		class="i-material-symbols-light-mode-outline text-yellow-500"
		class:hidden={mode == "light"}
	></div>
</button>
