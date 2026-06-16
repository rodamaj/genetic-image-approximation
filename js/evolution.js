import { selectParents } from "./selection.js";
import { crossoverSelectedParents } from "./crossover.js";
import { mutateLatestOffspring } from "./mutation.js";

export function evolveOneGeneration(p, state, helpers) {
  if (state.population.length === 0) {
    state.updateStatus("No hay población disponible. Genera la población antes de evolucionar.");
    return null;
  }

  const parents = selectParents(state, helpers.redrawPopulation);
  if (parents.length < 2) {
    state.updateStatus("No fue posible evolucionar: se necesitan al menos dos padres seleccionados.");
    return null;
  }

  const offspring = crossoverSelectedParents(
    p,
    state,
    helpers.updateFigureFitness,
    helpers.updatePopulationFitness,
    helpers.redrawPopulation
  );
  if (offspring.length === 0) {
    state.updateStatus("No fue posible evolucionar: el cruce no produjo hijos.");
    return null;
  }

  const mutatedFigures = mutateLatestOffspring(
    p,
    state,
    helpers.updateFigureFitness,
    helpers.updatePopulationFitness,
    helpers.redrawPopulation
  );
  const averageFitness = state.population.length > 0 ? helpers.updatePopulationFitness() : null;
  helpers.redrawPopulation();

  if (averageFitness !== null) {
    state.updateStatus(
      `Generación ${state.generation} evolucionada. ${parents.length} padres, ${offspring.length} hijos y ${mutatedFigures.length} mutaciones aplicadas. Aptitud promedio: ${averageFitness.toFixed(4)}.`
    );
  }

  return {
    parents,
    offspring,
    mutatedFigures,
    generation: state.generation,
    averageFitness
  };
}
