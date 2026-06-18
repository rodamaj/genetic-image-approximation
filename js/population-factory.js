import {
  FIGURE_ALPHA,
  FIXED_CELL_SIZE,
  RANDOM_COLOR_MAX,
  RANDOM_COLOR_MIN
} from "./constants.js";

function createFigure(p, x, y, referenceReady, updateFigureFitness) {
  const figure = {
    x,
    y,
    size: FIXED_CELL_SIZE,
    color: p.color(
      p.random(RANDOM_COLOR_MIN, RANDOM_COLOR_MAX),
      p.random(RANDOM_COLOR_MIN, RANDOM_COLOR_MAX),
      p.random(RANDOM_COLOR_MIN, RANDOM_COLOR_MAX),
      FIGURE_ALPHA
    ),
    fitness: null,
    targetColor: null,
    isSelected: false
  };

  if (referenceReady) {
    return updateFigureFitness(figure);
  }

  return figure;
}

export function createPopulation(p, referenceReady, updateFigureFitness) {
  const population = [];

  for (let y = 0; y < p.height; y += FIXED_CELL_SIZE) {
    for (let x = 0; x < p.width; x += FIXED_CELL_SIZE) {
      population.push(createFigure(p, x, y, referenceReady, updateFigureFitness));
    }
  }

  return population;
}
