import init, { solve as wasmSolve } from "../../solver/pkg/solver";
import wasmPath from "../../solver/pkg/solver_bg.wasm?url";
import { tileC, type Point } from "./helpers";

export async function initialize() {
	await init({ module_or_path: wasmPath });
}
export async function solve(_grid: number[], dimensions: Point, _moves: Point[], lastTile: number) {
	if (lastTile == -1) {
		for (let i = 0; i < dimensions.x * dimensions.y; i++) {
			_grid[i] = 1;
			const sol = await solve_call(_grid, dimensions, _moves, i);
			if (sol) return sol;
			_grid[i] = 0;
		}
	} else return await solve_call(_grid, dimensions, _moves, lastTile);
}

async function solve_call(_grid: number[], dimensions: Point, _moves: Point[], lastTile: number) {
	const lastTileC = tileC(lastTile, dimensions);
	const grid = new Uint32Array(_grid);
	const moves_x = new Int32Array(_moves.map((m) => m.x));
	const moves_y = new Int32Array(_moves.map((m) => m.y));
	const solution = wasmSolve(
		grid,
		lastTileC.x,
		lastTileC.y,
		dimensions.x,
		dimensions.y,
		moves_x,
		moves_y
	);
	return solution;
}
