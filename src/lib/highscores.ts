import { writable, type Writable } from "svelte/store";
import type { Point } from "./helpers";
import { deepEqual } from "./helpers";

const storedScores = JSON.parse(localStorage.getItem("highscores") ?? "[]");

export const scoreStore: Writable<
	{ settings: { moves: Point[]; dimensions: Point }; score: number }[]
> = writable(storedScores);
scoreStore.subscribe((value) => localStorage.setItem("highscores", JSON.stringify(value)));

export function newScore(dimensions: Point, moves: Point[], score: number) {
	const settings = { dimensions, moves };
	scoreStore.update((scores) => {
		const index = scores.findIndex((entry) => deepEqual(entry.settings, settings));
		if (index == -1) scores = [...scores, { settings, score }];
		else scores[index].score = Math.max(scores[index].score, score);
		return scores;
	});
}
