// uno.config.ts
import { defineConfig } from "unocss";
import presetIcons from "@unocss/preset-icons";
import presetUno from "@unocss/preset-uno";

export default defineConfig({
	presets: [presetUno(), presetIcons()]
});
