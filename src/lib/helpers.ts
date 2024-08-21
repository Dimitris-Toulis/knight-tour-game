export type Point = { x: number; y: number };
export function tileI(p: Point, d: { x: number; y: number }) {
	return p.x + p.y * d.x;
}
export function tileC(index: number, d: { x: number; y: number }): Point {
	const x = index % d.x;
	const y = (index - x) / d.x;
	return { x, y };
}
export function canMove(from: Point, to: Point, moves: Point[]) {
	const dist = { x: to.x - from.x, y: to.y - from.y };
	return moves.some((m) => m.x == dist.x && m.y == dist.y);
}

export function deepEqual(x: any, y: any): boolean {
	const k = Object.keys,
		tx = typeof x,
		ty = typeof y;
	return x && y && tx === "object" && tx === ty
		? k(x).length === k(y).length && k(x).every((key) => deepEqual(x[key], y[key]))
		: x === y;
}
