import { svelte } from "@sveltejs/vite-plugin-svelte";
import UnoCSS from "unocss/vite";
import extractorSvelte from "@unocss/extractor-svelte";
import { defineConfig, searchForWorkspaceRoot } from "vite";
import { VitePWA } from "vite-plugin-pwa";

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
			manifest: {
				name: "Knight's tour game",
				short_name: "Knight's Tour",
				description: "A game where you try to fill a board with configurable dimensions and moves",
				theme_color: "#1D4ED8",
				background_color: "#0F172A",
				icons: [
					{
						src: "icon.svg",
						sizes: "any",
						type: "image/svg+xml",
						purpose: "any"
					},
					{
						src: "maskable_icon_x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable"
					}
				],
				screenshots: [
					{ form_factor: "wide", src: "/screenshots/wide_dark.jpg", sizes: "3658x2028" },
					{ form_factor: "wide", src: "/screenshots/wide_light.jpg", sizes: "3658x2028" },
					{ form_factor: "wide", src: "/screenshots/wide_settings.jpg", sizes: "3658x2028" },
					{ form_factor: "narrow", src: "/screenshots/narrow_dark.jpg", sizes: "1240x2028" },
					{ form_factor: "narrow", src: "/screenshots/narrow_light.jpg", sizes: "1240x2028" },
					{ form_factor: "narrow", src: "/screenshots/narrow_settings.jpg", sizes: "1240x2028" }
				]
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,wasm,svg}"]
			}
		})
	],
	server: {
		fs: {
			allow: [searchForWorkspaceRoot(process.cwd()), "./solver/pkg"]
		}
	}
});
