import { getAverageFitness } from "./fitness.js";
import { selectParents } from "./selection.js";
import { crossoverPopulation } from "./crossover.js";
import { mutatePopulation } from "./mutation.js";

export function evolveOneGeneration(p, state, helpers) {
  const selectedPopulation = selectParents(state.population);
  const crossedPopulation = crossoverPopulation(
    p,
    selectedPopulation,
    helpers.updateFigureFitness
  );
  const mutatedPopulation = mutatePopulation(
    p,
    crossedPopulation,
    helpers.updateFigureFitness
  );
  const parents = selectedPopulation.filter(function (figure) {
    return figure.isSelected;
  });
  const offspring = crossedPopulation.filter(function (figure) {
    return figure.isSelected;
  });
  const mutatedFigures = mutatedPopulation.filter(function (figure) {
    return figure.isSelected;
  });

  state.population = mutatedPopulation;
  state.generation += 1;

  const averageFitness = getAverageFitness(state.population);
  helpers.redrawPopulation();
  state.updateStatus(
    `Generación ${state.generation} evolucionada. ${parents.length} padres, ` +
    `${offspring.length} hijos y ${mutatedFigures.length} mutaciones aplicadas. ` +
    `Aptitud promedio: ${averageFitness.toFixed(4)}.`
  );

  return {
    parents,
    offspring,
    mutatedFigures,
    generation: state.generation,
    averageFitness
  };
}
