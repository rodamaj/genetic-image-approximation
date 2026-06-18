import { getAverageFitness } from "./fitness.js";
import { selectParents } from "./selection.js";
import { crossoverPopulation } from "./crossover.js";
import { mutatePopulation } from "./mutation.js";

export function evolveOneGeneration(population, helpers) {
  const parents = selectParents(population);
  const crossoverResult = crossoverPopulation(population, parents, helpers.updateFigureFitness);
  const mutationResult = mutatePopulation(
    crossoverResult.population,
    crossoverResult.offspring,
    helpers.updateFigureFitness,
    helpers.random,
    helpers.randomBetween
  );
  const averageFitness = getAverageFitness(mutationResult.population);

  return {
    population: mutationResult.population,
    parents,
    offspring: crossoverResult.offspring,
    mutatedFigures: mutationResult.mutatedFigures,
    averageFitness
  };
}
