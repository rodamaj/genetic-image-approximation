import { getPopulationIndexByFigure } from "./population.js";
import { MUTATION_RATE, MUTATION_STRENGTH } from "../config/constants.js";

export function mutatePopulation(
  population,
  offspring,
  updateFigureFitness,
  random,
  randomBetween,
) {
  const populationIndexByFigure = getPopulationIndexByFigure(population);
  const nextPopulation = population.map(function (figure) {
    return figure.withSelection(false);
  });
  const mutatedFigureIndexes = new Set();

  for (const figure of offspring) {
    if (random() <= MUTATION_RATE) {
      const targetIndex = populationIndexByFigure.get(figure);
      const mutatedFigure = nextPopulation[targetIndex]
        .withColor(nextPopulation[targetIndex].mutateColor(randomBetween, MUTATION_STRENGTH))
        .withSelection(true);
      const evaluatedMutatedFigure = updateFigureFitness(mutatedFigure);
      nextPopulation[targetIndex] = evaluatedMutatedFigure;
      mutatedFigureIndexes.add(targetIndex);
    }
  }

  if (mutatedFigureIndexes.size === 0) {
    const fallbackIndex = populationIndexByFigure.get(offspring[0]);
    const fallbackFigure = nextPopulation[fallbackIndex]
      .withColor(nextPopulation[fallbackIndex].mutateColor(randomBetween, MUTATION_STRENGTH))
      .withSelection(true);
    nextPopulation[fallbackIndex] = updateFigureFitness(fallbackFigure);
  }

  return {
    population: nextPopulation,
    mutatedFigures: nextPopulation.filter(function (figure) {
      return figure.isSelected;
    })
  };
}
