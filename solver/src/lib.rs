mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn solve(
    grid: Box<[i32]>,
    last_tile: usize,
    dimension_x: usize,
    dimension_y: usize,
    moves_x: Box<[isize]>,
    moves_y: Box<[isize]>,
) -> Option<Vec<i32>> {
    utils::set_panic_hook();
    solve_util(
        &mut grid.to_vec(),
        (dimension_x, dimension_y),
        &moves_x
            .iter()
            .enumerate()
            .map(|(i, &m)| -> (isize, isize) { (m, moves_y[i]) })
            .collect(),
        tile_c(last_tile, (dimension_x, dimension_y)),
        grid.to_vec()[last_tile],
    )
}

fn in_bounds(x: isize, y: isize, dimensions: (usize, usize)) -> bool {
    x >= 0 && y >= 0 && x < dimensions.0 as isize && y < dimensions.1 as isize
}

fn tile_i(x: usize, y: usize, dimensions: (usize, usize)) -> usize {
    x + y * dimensions.0
}
fn tile_c(index: usize, dimensions: (usize, usize)) -> (usize, usize) {
    (
        index % dimensions.0,
        (index - index % dimensions.0) / dimensions.0,
    )
}

fn solve_util(
    grid: &mut Vec<i32>,
    dimensions: (usize, usize),
    moves: &Vec<(isize, isize)>,
    last_tile: (usize, usize),
    counter: i32,
) -> Option<Vec<i32>> {
    if counter == ((dimensions.0 * dimensions.1) as i32) {
        return Some(grid.clone());
    }
    for &(dx, dy) in moves {
        let next_x = last_tile.0 as isize + dx;
        let next_y = last_tile.1 as isize + dy;

        if in_bounds(next_x, next_y, dimensions)
            && grid[tile_i(next_x as usize, next_y as usize, dimensions)] == 0
        {
            grid[tile_i(next_x as usize, next_y as usize, dimensions)] = counter + 1;

            let sol = solve_util(
                grid,
                dimensions,
                &moves,
                (next_x as usize, next_y as usize),
                counter + 1,
            );
            if sol.is_none() {
                grid[tile_i(next_x as usize, next_y as usize, dimensions)] = 0;
            } else {
                return sol;
            }
        }
    }

    None
}
