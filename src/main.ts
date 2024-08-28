import "uno.css";
import "@unocss/reset/tailwind.css";
import "./style.css";
import App from "./App.svelte";

// Include icons in bundle
import.meta.glob("./assets/screenshots/*.jpg", { query: "?url" });
import.meta.glob("./assets/*.png", { query: "?url" });

const app = new App({
	target: document.getElementById("app")!
});
export default app;
