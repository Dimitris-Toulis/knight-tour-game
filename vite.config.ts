import { svelte } from "@sveltejs/vite-plugin-svelte";
import UnoCSS from "unocss/vite";
import extractorSvelte from "@unocss/extractor-svelte";
import { defineConfig, searchForWorkspaceRoot } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { readFile } from "node:fs/promises";
import path from "path";

export default defineConfig({
	plugins: [
		svelte(),
		UnoCSS({
			extractors: [extractorSvelte()]
		}),
		VitePWA({
			registerType: "prompt",
			manifest: false,
			workbox: {
				globPatterns: ["**/*.{js,css,html,wasm,svg}"]
			}
		}),
		{
			name: "vite-plugin-webmanifest-assets",
			async generateBundle(options, bundle) {
				const manifest = JSON.parse(
					new TextDecoder().decode(await readFile("./public/manifest.webmanifest"))
				);
				function mapIcons(icons: { src: string }[]) {
					return icons.map((icon: { src: string }) => {
						const transformedName = Object.entries(bundle)
							.find((entry) => entry[1].name == icon.src.split("/").at(-1))
							?.at(0);
						return transformedName ? { ...icon, src: "/" + transformedName } : icon;
					});
				}
				manifest.icons = mapIcons(manifest.icons);
				manifest.screenshots = mapIcons(manifest.screenshots);
				manifest.shortcuts = manifest.shortcuts.map((s: any) => ({
					...s,
					icons: mapIcons(s.icons)
				}));
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
			else if (filePath.includes("/src/assets/screenshots")) return false;
			else if (content.byteLength < 4096) return true;
			else return false;
		}
	},
	server: {
		fs: {
			allow: [searchForWorkspaceRoot(process.cwd()), "./solver/pkg"]
		}
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src")
		}
	}
});
