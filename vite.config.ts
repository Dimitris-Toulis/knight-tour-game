import { svelte } from "@sveltejs/vite-plugin-svelte";
import UnoCSS from "unocss/vite";
import extractorSvelte from "@unocss/extractor-svelte";
import { defineConfig, searchForWorkspaceRoot } from "vite";

export default defineConfig({
	plugins: [
		svelte(),
		UnoCSS({
			extractors: [extractorSvelte()]
		})
	],
	server: {
		fs: {
			allow: [searchForWorkspaceRoot(process.cwd()), "./solver/pkg"]
		}
	}
});
