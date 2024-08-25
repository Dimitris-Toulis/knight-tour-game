# Knight's Tour Game

This is game based on the [Knight's Tour Problem](https://en.wikipedia.org/wiki/Knight%27s_tour). You have a board and your goal is to fill it by moving like a knight (in chess) to squares that are not filled

## Features

- Your current square is colored blue and the squares that you can move to are colored green
- You can change the dimensions of the board and the moves possible in the settings
  - There are also 3 presets: Knight, Star, Long Knight
- Challenges: Closed tour, Magic / Semimagic square, Bisected tour, Quadrisected tour
- Highscores for the different configurations are stored
- A solver, written in Rust and compiled to WebAssembly, is available that uses Warnsdorf's rule to quickly find a solution (if it exists) to the current board
  - The solver can also reveal the solution step-by-step
- The website is also a PWA which means that you can install it using the browser button and use it offline
- Dark and light modes are available

## To build it locally

For the whole app:

```
$ npm install
$ npm run build
```

To serve it run: `npm run preview`

To build the solver without the app run: `npm run wasm`.
The WebAssembly file will be in `./solver/pkg/solver_bg.wasm` and the javascript glue code in `./solver/pkg/solver.js`

## Screenshots

![Main page with dark mode](https://raw.githubusercontent.com/Dimitris-Toulis/knight-tour-game/main/public/screenshots/wide_dark.jpg)
![Main page with light mode](https://raw.githubusercontent.com/Dimitris-Toulis/knight-tour-game/main/public/screenshots/wide_light.jpg)
![Settings](https://raw.githubusercontent.com/Dimitris-Toulis/knight-tour-game/main/public/screenshots/wide_settings.jpg)
![Challenges](https://raw.githubusercontent.com/Dimitris-Toulis/knight-tour-game/main/public/screenshots/wide_challenges.jpg)
![Solver](https://raw.githubusercontent.com/Dimitris-Toulis/knight-tour-game/main/public/screenshots/wide_solver.jpg)
