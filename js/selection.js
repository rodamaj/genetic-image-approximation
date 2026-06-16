export function selectParents(state, redrawPopulation, topPercent = 0.2) {
  if (state.population.length === 0) {
    state.updateStatus("No hay población disponible. Genera la población antes de seleccionar padres.");
    return [];
  }

  for (const figure of state.population) {
    figure.isSelected = false;
  }

  const sortedPopulation = [...state.population].sort(function (a, b) {
    return (b.fitness ?? -Infinity) - (a.fitness ?? -Infinity);
  });
  const parentCount = Math.max(1, Math.floor(sortedPopulation.length * topPercent));
  state.selectedParents = sortedPopulation.slice(0, parentCount);

  for (const figure of state.selectedParents) {
    figure.isSelected = true;
  }

  redrawPopulation();
  state.updateStatus(
    `${state.selectedParents.length} padres seleccionados de ${state.population.length} cuadrados. Mejor aptitud: ${state.selectedParents[0].fitness.toFixed(4)}.`
  );

  return state.selectedParents;
}
