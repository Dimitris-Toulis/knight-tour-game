import { writable, type Writable } from "svelte/store";
import { canMove, type Point } from "./helpers";

function checkMagic(grid: number[][], dimensions: Point) {
	const sum = grid[0].reduce((acc, cur) => acc + cur, 0);
	let semimagic = true;
	for (let x = 0; x < dimensions.x; x++) {
		semimagic &&= sum == grid[x].reduce((acc, cur) => acc + cur, 0);
	}
	for (let y = 0; y < dimensions.y; y++) {
		semimagic &&= sum == grid.reduce((acc, cur) => acc + cur[y], 0);
	}
	let magic = semimagic;
	let sumD1 = 0,
		sumD2 = 0;
	for (let i = 0; i < dimensions.x; i++) {
		sumD1 += grid[i][i];
		sumD2 += grid[i][dimensions.y - i - 1];
	}
	magic &&= sumD1 == sum && sumD2 == sum;

	return { semimagic, magic };
}

function checkClosed(grid: number[][], moves: Point[], dimensions: Point) {
	let start = null,
		end = null;
	const endN = dimensions.x * dimensions.y;
	for (let x = 0; x < dimensions.x; x++) {
		for (let y = 0; y < dimensions.y; y++) {
			if (grid[x][y] == 1) start = { x, y };
			if (grid[x][y] == endN) end = { x, y };
		}
	}
	return canMove(end!, start!, moves);
}

function checkBisectedH(grid: number[][], dimensions: Point) {
	if (dimensions.y % 2 != 0) return false;
	const middle = dimensions.y / 2;
	let maxN = 0;
	for (let x = 0; x < dimensions.x; x++) {
		for (let y = 0; y < middle; y++) {
			maxN = Math.max(grid[x][y], maxN);
		}
	}
	return maxN == middle * dimensions.x;
}

function checkBisectedV(grid: number[][], dimensions: Point) {
	if (dimensions.x % 2 != 0) return false;
	const middle = dimensions.x / 2;
	let maxN = 0;
	for (let x = 0; x < middle; x++) {
		for (let y = 0; y < dimensions.y; y++) {
			maxN = Math.max(grid[x][y], maxN);
		}
	}
	return maxN == middle * dimensions.y;
}

function checkQuadrisected(grid: number[][], dimensions: Point) {
	const middleX = dimensions.x / 2;
	const middleY = dimensions.y / 2;
	let quadrisected = true;
	for (const bounds of [
		{ x: [0, middleX], y: [0, middleY] },
		{ x: [middleX, dimensions.x], y: [0, middleY] },
		{ x: [0, middleX], y: [middleY, dimensions.y] },
		{ x: [middleX, dimensions.x], y: [middleY, dimensions.y] }
	]) {
		let maxN = 0,
			minN = dimensions.x * dimensions.y;
		for (let x = bounds.x[0]; x < bounds.x[1]; x++) {
			for (let y = bounds.y[0]; y < bounds.y[1]; y++) {
				maxN = Math.max(maxN, grid[x][y]);
				minN = Math.min(minN, grid[x][y]);
			}
		}
		quadrisected &&= maxN - minN - 1 == (dimensions.x * dimensions.y) / 4;
	}
	return quadrisected;
}

export type challengesType = {
	semimagic: boolean;
	magic: boolean;
	closed: boolean;
	bisectedH: boolean;
	bisectedV: boolean;
	quadrisected: boolean;
};
const storedChallenges: challengesType = JSON.parse(
	localStorage.getItem("challenges") ?? "null"
) ?? {
	magic: false,
	semimagic: false,
	closed: false,
	bisectedH: false,
	bisectedV: false,
	quadrisected: false
};

export const challengeStore: Writable<challengesType> = writable(storedChallenges);
challengeStore.subscribe((value) => localStorage.setItem("challenges", JSON.stringify(value)));

export function checkChallenges(
	grid: number[][],
	moves: Point[],
	dimensions: Point
): challengesType {
	const { semimagic, magic } =
		dimensions.x == dimensions.y
			? checkMagic(grid, dimensions)
			: { semimagic: false, magic: false };
	const closed = checkClosed(grid, moves, dimensions);
	const bisectedH = checkBisectedH(grid, dimensions);
	const bisectedV = checkBisectedV(grid, dimensions);
	const quadrisected =
		dimensions.x % 2 == 0 && dimensions.y % 2 == 0 ? checkQuadrisected(grid, dimensions) : false;
	const result = { semimagic, magic, closed, bisectedH, bisectedV, quadrisected };

	updateStore(result);
	return structuredClone(result);
}
function updateStore(result: ReturnType<typeof checkChallenges>) {
	challengeStore.update((val) => {
		(Object.keys(result) as (keyof typeof result)[]).forEach((c) => {
			if (!Object.hasOwn(val, c) || val[c] == false) {
				//@ts-ignore
				val[c] = result[c];
			}
		});
		return val;
	});
}
