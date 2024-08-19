export type Point = { x: number; y: number };
export function tileI(p: Point, d: { x: number; y: number }) {
	return p.x + p.y * d.x;
}
export function tileC(index: number, d: { x: number; y: number }): Point {
	const x = index % d.x;
	const y = (index - x) / d.x;
	return { x, y };
}
