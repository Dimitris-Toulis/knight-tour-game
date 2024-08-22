import { sveltekit } from "@sveltejs/kit/vite";
import UnoCSS from "unocss/vite";
import extractorSvelte from "@unocss/extractor-svelte";
import { defineConfig, searchForWorkspaceRoot } from "vite";

export default defineConfig({
	plugins: [
		sveltekit(),
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
