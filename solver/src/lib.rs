mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn solve(
    mut grid: Box<[u32]>,
    dimension_x: u32,
    dimension_y: u32,
    moves_x: Box<[i32]>,
    moves_y: Box<[i32]>,
) -> Option<Vec<u32>> {
    utils::set_panic_hook();
    grid[0] = 3;
    Some(grid.to_vec())
}
