import init, { solve as wasmSolve } from "../../solver/pkg/solver";
import wasmPath from "../../solver/pkg/solver_bg.wasm?url";
import type { Point } from "./helpers";

export async function initialize() {
	await init({ module_or_path: wasmPath });
}
export async function solve(_grid: number[], dimensions: Point, _moves: Point[], lastTile: number) {
	if (lastTile == -1) {
		lastTile = 0;
		_grid[0] = 1;
	}
	const grid = new Int32Array(_grid);
	const moves_x = new Int32Array(_moves.map((m) => m.x));
	const moves_y = new Int32Array(_moves.map((m) => m.y));
	const solution = wasmSolve(grid, lastTile, dimensions.x, dimensions.y, moves_x, moves_y);
	return solution;
}
