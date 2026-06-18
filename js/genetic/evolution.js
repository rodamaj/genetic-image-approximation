import { getAverageFitness } from "./fitness.js";
import { selectParents } from "./selection.js";
import { crossoverPopulation } from "./crossover.js";
import { mutatePopulation } from "./mutation.js";

export function evolveOneGeneration(p, algorithmState, helpers) {
  const parents = selectParents(algorithmState.population);
  const crossoverResult = crossoverPopulation(
    p,
    algorithmState.population,
    parents,
    helpers.updateFigureFitness
  );
  const mutationResult = mutatePopulation(
    p,
    crossoverResult.population,
    crossoverResult.offspring,
    helpers.updateFigureFitness
  );

  algorithmState.population = mutationResult.population;
  algorithmState.generation += 1;

  const averageFitness = getAverageFitness(algorithmState.population);
  helpers.redrawPopulation();
  helpers.updateStatus(
    `Generación ${algorithmState.generation} evolucionada. ${parents.length} padres, ` +
    `${crossoverResult.offspring.length} hijos y ${mutationResult.mutatedFigures.length} mutaciones aplicadas. ` +
    `Aptitud promedio: ${averageFitness.toFixed(4)}.`
  );

  return {
    parents,
    offspring: crossoverResult.offspring,
    mutatedFigures: mutationResult.mutatedFigures,
    generation: algorithmState.generation,
    averageFitness
  };
}
