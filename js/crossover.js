export function mixParentColors(p, parentA, parentB) {
  return p.color(
    (p.red(parentA.color) + p.red(parentB.color)) / 2,
    (p.green(parentA.color) + p.green(parentB.color)) / 2,
    (p.blue(parentA.color) + p.blue(parentB.color)) / 2,
    (p.alpha(parentA.color) + p.alpha(parentB.color)) / 2
  );
}

export function crossoverSelectedParents(
  p,
  state,
  updateFigureFitness,
  updatePopulationFitness,
  redrawPopulation
) {
  if (state.population.length === 0) {
    state.updateStatus("No hay población disponible. Genera la población antes de cruzar.");
    return [];
  }

  if (state.selectedParents.length < 2) {
    state.updateStatus("Se necesitan al menos dos padres seleccionados antes de cruzar.");
    return [];
  }

  for (const figure of state.population) {
    figure.isSelected = false;
  }

  const sortedWorstFirst = [...state.population].sort(function (a, b) {
    return (a.fitness ?? Infinity) - (b.fitness ?? Infinity);
  });
  const replacementCount = Math.min(state.selectedParents.length, sortedWorstFirst.length);
  const offspring = [];

  for (let i = 0; i < replacementCount; i++) {
    const targetFigure = sortedWorstFirst[i];
    const parentA = state.selectedParents[i % state.selectedParents.length];
    const parentB = state.selectedParents[(i + 1) % state.selectedParents.length];
    const childColor = mixParentColors(p, parentA, parentB);

    targetFigure.color = childColor;
    targetFigure.isSelected = true;
    updateFigureFitness(targetFigure);
    offspring.push(targetFigure);
  }

  state.selectedParents = offspring;
  state.latestOffspring = offspring;
  state.generation += 1;

  const averageFitness = updatePopulationFitness();
  redrawPopulation();

  if (averageFitness !== null) {
    state.updateStatus(
      `Generación ${state.generation} creada mediante cruce. ${offspring.length} hijos reemplazaron a los cuadrados más débiles. Aptitud promedio: ${averageFitness.toFixed(4)}.`
    );
  }

  return offspring;
}
