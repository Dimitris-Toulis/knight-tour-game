// uno.config.ts
import { defineConfig } from "unocss";
import presetIcons from "@unocss/preset-icons";
import presetUno from "@unocss/preset-uno";

const buttonClasses =
	"!bg-{color}-500 !hover:bg-{color}-600 !dark:hover:bg-{color}-700 dark:!bg-{color}-600";

export default defineConfig({
	presets: [presetUno(), presetIcons()],
	safelist: [
		...buttonClasses.replaceAll("{color}", "blue").split(" "),
		...buttonClasses.replaceAll("{color}", "red").split(" ")
	]
});
