# Knight's Tour Game

This is game based on the [Knight's Tour Problem](https://en.wikipedia.org/wiki/Knight%27s_tour). You have a board and your goal is to fill it by moving like a knight (in chess) to squares that are not filled

Play here: https://knight-tour.toulis.net/

## Features

- Your current square is colored blue and the squares that you can move to are colored green
  
- You can change the dimensions of the board and the moves possible in the settings
  - There are also 3 presets: Knight, Star, Long Knight
- **Challenges**: Closed tour, Magic / Semimagic square, Bisected tour, Quadrisected tour
- **Highscores** for the different configurations are stored
- **A solver, written in Rust and compiled to WebAssembly**, is available that uses Warnsdorf's rule to quickly find a solution (if it exists) to the current board
  - The solver can also reveal the solution step-by-step
- The website is also a PWA which means that you can install it using the browser button and use it offline
- Uses TWA (Trusted Web Activity) to run as an **android app**!
- **Dark and light modes** are available

## To build it locally

### **Solver**

Requires:
- Rust (install from https://www.rust-lang.org/tools/install)
- wasm-pack (`npm install -g wasm-pack` or see other methods [here](https://rustwasm.github.io/wasm-pack/installer/))
  
To build the solver without the app run: `npm run wasm`.
The WebAssembly file will be in `./solver/pkg/solver_bg.wasm` and the javascript glue code in `./solver/pkg/solver.js`

### **Web app**

Requires: solver requirements
```
$ npm install
$ npm run build
```

To serve it run: `npm run preview`

### **Android App**

Requires: 
- @bubblewrap/cli (`npm i -g @bubblewrap/cli`)
- JDK and Android SDK (installed by bubblewrap)
- A key store at `twa/android.keystore` with a key named android
```
$ cd twa
$ bubblewrap build
```
The resulting apk is at `twa/app-release-signed.apk`.    
For easier installation connect your phone to your computer, enable USB debugging and run: `bubblewrap install`

## Screenshots

![Main page with dark mode](https://raw.githubusercontent.com/Dimitris-Toulis/knight-tour-game/main/src/assets/screenshots/wide_dark.jpg)
![Main page with light mode](https://raw.githubusercontent.com/Dimitris-Toulis/knight-tour-game/main/src/assets/screenshots/wide_light.jpg)
![Settings](https://raw.githubusercontent.com/Dimitris-Toulis/knight-tour-game/main/src/assets/screenshots/wide_settings.jpg)
![Challenges](https://raw.githubusercontent.com/Dimitris-Toulis/knight-tour-game/main/src/assets/screenshots/wide_challenges.jpg)
![Solver](https://raw.githubusercontent.com/Dimitris-Toulis/knight-tour-game/main/src/assets/screenshots/wide_solver.jpg)
