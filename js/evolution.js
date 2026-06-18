import { getAverageFitness } from "./fitness.js";
import { selectParents } from "./selection.js";
import { crossoverPopulation } from "./crossover.js";
import { mutatePopulation } from "./mutation.js";

export function evolveOneGeneration(p, state, helpers) {
  const parents = selectParents(state.population);
  const crossoverResult = crossoverPopulation(
    p,
    state.population,
    parents,
    helpers.updateFigureFitness
  );
  const mutationResult = mutatePopulation(
    p,
    crossoverResult.population,
    crossoverResult.offspring,
    helpers.updateFigureFitness
  );

  state.population = mutationResult.population;
  state.generation += 1;

  const averageFitness = getAverageFitness(state.population);
  helpers.redrawPopulation();
  state.updateStatus(
    `Generación ${state.generation} evolucionada. ${parents.length} padres, ` +
    `${crossoverResult.offspring.length} hijos y ${mutationResult.mutatedFigures.length} mutaciones aplicadas. ` +
    `Aptitud promedio: ${averageFitness.toFixed(4)}.`
  );

  return {
    parents,
    offspring: crossoverResult.offspring,
    mutatedFigures: mutationResult.mutatedFigures,
    generation: state.generation,
    averageFitness
  };
}
