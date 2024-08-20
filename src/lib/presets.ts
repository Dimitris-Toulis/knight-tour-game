export const presets = {
	Knight: {
		dimensions: { x: 8, y: 8 },
		moves: [
			{ x: 1, y: 2 },
			{ x: 1, y: -2 },
			{ x: -1, y: 2 },
			{ x: -1, y: -2 },
			{ x: 2, y: 1 },
			{ x: 2, y: -1 },
			{ x: -2, y: 1 },
			{ x: -2, y: -1 }
		]
	},
	Star: {
		dimensions: { x: 10, y: 10 },
		moves: [
			{ x: 3, y: 0 },
			{ x: -3, y: 0 },
			{ x: 0, y: 3 },
			{ x: 0, y: -3 },
			{ x: 2, y: 2 },
			{ x: 2, y: -2 },
			{ x: -2, y: -2 },
			{ x: -2, y: 2 }
		]
	}
};
