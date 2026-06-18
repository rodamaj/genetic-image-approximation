# Genetic Image Approximation

Small project that uses a simple genetic algorithm to approximate a reference image with colored squares on a `p5.js` canvas.

## What It Does

- Loads a reference image.
- Generates a population of square-based figures.
- Evaluates each figure against the reference image.
- Repeats selection, crossover, and mutation to improve the approximation over generations.

## How To Run

Because this project uses ES modules, it should be served from a local web server instead of opening `index.html` directly.

Example:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

You can also just install a live server extension on VS Code and run it from the project root directory, or any other local web server approach you want to use.

## Controls

- `Generar Poblacion`: creates the initial population.
- `Evolucionar 1 Generacion`: runs one generation of the genetic algorithm.
- `Iniciar Evolucion Continua`: keeps evolving automatically until paused or until the configured generation limit is reached.
