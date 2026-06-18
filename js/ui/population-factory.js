import { FIXED_CELL_SIZE } from "../config/constants.js";
import { Figure } from "../genetic/figure.js";

function createFigure(p, x, y, referenceReady, updateFigureFitness) {
  const figure = Figure.createRandom(x, y, function randomBetween(min, max) {
    return p.random(min, max);
  });

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
