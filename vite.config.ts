import { svelte } from "@sveltejs/vite-plugin-svelte";
import UnoCSS from "unocss/vite";
import extractorSvelte from "@unocss/extractor-svelte";
import { defineConfig, searchForWorkspaceRoot } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import topLevelAwait from "vite-plugin-top-level-await";
import { readFile } from "node:fs/promises";

export default defineConfig({
	plugins: [
		svelte(),
		UnoCSS({
			extractors: [extractorSvelte()]
		}),
		VitePWA({
			registerType: "autoUpdate",
			devOptions: {
				enabled: true
			},
			manifest: false,
			workbox: {
				globPatterns: ["**/*.{js,css,html,wasm,svg}"]
			}
		}),
		topLevelAwait(),
		{
			name: "vite-plugin-webmanifest-assets",
			async generateBundle(options, bundle) {
				const manifest = JSON.parse(
					new TextDecoder().decode(await readFile("./src/manifest.webmanifest"))
				);
				manifest.icons = manifest.icons.map((icon: { src: string }) => {
					const transformedName = Object.entries(bundle)
						.find((entry) => entry[1].name == icon.src)
						?.at(0);
					return transformedName ? { ...icon, src: "/" + transformedName } : icon;
				});
				manifest.screenshots = manifest.screenshots.map((icon: { src: string }) => {
					const transformedName = Object.entries(bundle)
						.find((entry) => entry[1].name == icon.src)
						?.at(0);
					return transformedName ? { ...icon, src: "/" + transformedName } : icon;
				});
				this.emitFile({
					type: "asset",
					fileName: "manifest.webmanifest",
					source: JSON.stringify(manifest)
				});
			}
		}
	],
	build: {
		assetsInlineLimit(filePath, content) {
			if (filePath.includes("/src/assets/pwa")) return false;
			else if (content.byteLength < 4096) return true;
			else return false;
		}
	},
	server: {
		fs: {
			allow: [searchForWorkspaceRoot(process.cwd()), "./solver/pkg"]
		}
	}
});
