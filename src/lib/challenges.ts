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
	if (start == null || end == null) return;
	return canMove(end, start, moves);
}

export function checkChallenges(grid: number[][], moves: Point[], dimensions: Point) {
	const { semimagic, magic } =
		dimensions.x == dimensions.y ? checkMagic(grid, dimensions) : { semimagic: null, magic: null };
	const closed = checkClosed(grid, moves, dimensions);
	return { semimagic, magic, closed };
}
