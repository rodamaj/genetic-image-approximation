import { selectParents } from "./selection.js";
import { crossoverSelectedParents } from "./crossover.js";
import { mutateLatestOffspring } from "./mutation.js";

export function evolveOneGeneration(p, state, helpers) {
  if (state.population.length === 0) {
    state.updateStatus("No hay población disponible. Genera la población antes de evolucionar.");
    return null;
  }

  const selectionResult = selectParents(state.population);
  if (selectionResult.selectedParents.length < 2) {
    state.population = selectionResult.population;
    state.selectedParents = selectionResult.selectedParents;
    state.latestOffspring = selectionResult.latestOffspring;
    helpers.redrawPopulation();
    state.updateStatus("No fue posible evolucionar: se necesitan al menos dos padres seleccionados.");
    return null;
  }

  const crossoverResult = crossoverSelectedParents(
    p,
    selectionResult.population,
    selectionResult.selectedParents,
    helpers.updateFigureFitness,
    state.generation
  );
  if (crossoverResult.latestOffspring.length === 0) {
    state.population = crossoverResult.population;
    state.selectedParents = crossoverResult.selectedParents;
    state.latestOffspring = crossoverResult.latestOffspring;
    state.generation = crossoverResult.generation;
    helpers.redrawPopulation();
    state.updateStatus("No fue posible evolucionar: el cruce no produjo hijos.");
    return null;
  }

  const mutationResult = mutateLatestOffspring(
    p,
    crossoverResult.population,
    crossoverResult.latestOffspring,
    crossoverResult.selectedParents,
    helpers.updateFigureFitness,
    crossoverResult.generation
  );

  state.population = mutationResult.population;
  state.selectedParents = mutationResult.selectedParents;
  state.latestOffspring = mutationResult.latestOffspring;
  state.generation = mutationResult.generation;

  helpers.redrawPopulation();
  state.updateStatus(
    `Generación ${state.generation} evolucionada. ${selectionResult.selectedParents.length} padres, ` +
    `${crossoverResult.latestOffspring.length} hijos y ${mutationResult.mutatedFigures.length} ` +
    `mutaciones aplicadas. Aptitud promedio: ${mutationResult.averageFitness.toFixed(4)}.`
  );

  return {
    parents: selectionResult.selectedParents,
    offspring: crossoverResult.latestOffspring,
    mutatedFigures: mutationResult.mutatedFigures,
    generation: state.generation,
    averageFitness: mutationResult.averageFitness
  };
}
