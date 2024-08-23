mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn solve(
    mut grid: Vec<i32>,
    last_tile: usize,
    dimension_x: usize,
    dimension_y: usize,
    moves_x: Vec<isize>,
    moves_y: Vec<isize>,
) -> Option<Vec<i32>> {
    utils::set_panic_hook();
    let counter = grid[last_tile];
    if solve_util(
        &mut grid,
        (dimension_x, dimension_y),
        &moves_x
            .iter()
            .enumerate()
            .map(|(i, &m)| -> (isize, isize) { (m, moves_y[i]) })
            .collect(),
        tile_c(last_tile, (dimension_x, dimension_y)),
        counter,
    ) {
        Some(grid)
    } else {
        None
    }
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

fn calc_next_tiles(
    grid: &Vec<i32>,
    dimensions: (usize, usize),
    moves: &Vec<(isize, isize)>,
    tile: (usize, usize),
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

fn solve_util(
    grid: &mut Vec<i32>,
    dimensions: (usize, usize),
    moves: &Vec<(isize, isize)>,
    last_tile: (usize, usize),
    counter: i32,
) -> bool {
    if counter == ((dimensions.0 * dimensions.1) as i32) {
        return true;
    }
    let mut next_tiles: Vec<(usize, usize)> = calc_next_tiles(&grid, dimensions, moves, last_tile);
    next_tiles.sort_by(|a, b| {
        let ca = calc_next_tiles(grid, dimensions, moves, *a).len();
        let cb = calc_next_tiles(grid, dimensions, moves, *b).len();
        ca.cmp(&cb)
    });
    for (x, y) in next_tiles {
        grid[tile_i(x, y, dimensions)] = counter + 1;

        let sol = solve_util(grid, dimensions, &moves, (x, y), counter + 1);
        if !sol {
            grid[tile_i(x, y, dimensions)] = 0;
        } else {
            return true;
        }
    }

    false
}
