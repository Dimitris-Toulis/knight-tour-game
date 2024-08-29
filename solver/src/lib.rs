#[cfg(debug_assertions)]
mod utils;

use std::collections::VecDeque;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn solve(
    mut grid: Vec<usize>,
    last_tile_x: usize,
    last_tile_y: usize,
    dimension_x: usize,
    dimension_y: usize,
    moves_x: Vec<isize>,
    moves_y: Vec<isize>,
) -> Option<Vec<usize>> {
    #[cfg(debug_assertions)]
    utils::set_panic_hook();

    let dimensions = (dimension_x, dimension_y);
    let counter = grid[tile_i(last_tile_x, last_tile_y, &dimensions)];
    if solve_util_iter(
        &mut grid,
        dimensions,
        &moves_x
            .iter()
            .enumerate()
            .map(|(i, &m)| -> (isize, isize) { (m, moves_y[i]) })
            .collect(),
        (last_tile_x, last_tile_y),
        counter,
    ) {
        Some(grid)
    } else {
        None
    }
}

fn in_bounds(x: isize, y: isize, dimensions: &(usize, usize)) -> bool {
    x >= 0 && y >= 0 && x < dimensions.0 as isize && y < dimensions.1 as isize
}

fn tile_i(x: usize, y: usize, dimensions: &(usize, usize)) -> usize {
    x + y * dimensions.0
}
fn calc_next_tiles(
    grid: &Vec<usize>,
    dimensions: &(usize, usize),
    moves: &Vec<(isize, isize)>,
    tile: &(usize, usize),
) -> Vec<(usize, usize)> {
    let mut next_tiles: Vec<(usize, usize)> = vec![];
    for &(dx, dy) in moves {
        let next_x = tile.0 as isize + dx;
        let next_y = tile.1 as isize + dy;
        if in_bounds(next_x, next_y, dimensions)
            && grid[tile_i(next_x as usize, next_y as usize, dimensions)] == 0
        {
            next_tiles.push((next_x as usize, next_y as usize));
        }
    }
    next_tiles
}

fn solve_util_iter(
    grid: &mut Vec<usize>,
    dimensions: (usize, usize),
    moves: &Vec<(isize, isize)>,
    first_tile: (usize, usize),
    counter: usize,
) -> bool {
    let mut stack = VecDeque::from([(first_tile, false)]);
    let mut counter = counter;

    while let Some((last_tile, delete)) = stack.pop_front() {
        if delete {
            grid[tile_i(last_tile.0, last_tile.1, &dimensions)] = 0;
            counter -= 1;
            continue;
        }
        grid[tile_i(last_tile.0, last_tile.1, &dimensions)] = counter;
        counter += 1;
        if counter == (dimensions.0 * dimensions.1 + 1) {
            return true;
        }

        let mut next_tiles: Vec<(usize, usize)> =
            calc_next_tiles(&grid, &dimensions, moves, &last_tile);
        next_tiles.sort_by(|a, b| {
            let ca = calc_next_tiles(grid, &dimensions, moves, a).len();
            let cb = calc_next_tiles(grid, &dimensions, moves, b).len();
            cb.cmp(&ca)
        });
        stack.push_front((last_tile, true));
        for (x, y) in next_tiles {
            stack.push_front(((x, y), false));
        }
    }

    false
}
