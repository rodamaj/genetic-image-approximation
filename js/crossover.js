function getAverageFitness(population) {
  if (population.length === 0) {
    return null;
  }

  let totalFitness = 0;

  for (const figure of population) {
    totalFitness += figure.fitness ?? 0;
  }

  return totalFitness / population.length;
}

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
  population,
  selectedParents,
  updateFigureFitness,
  generation
) {
  if (population.length === 0) {
    return {
      population,
      selectedParents,
      latestOffspring: [],
      generation,
      averageFitness: null,
      statusMessage: "No hay población disponible. Genera la población antes de cruzar."
    };
  }

  if (selectedParents.length < 2) {
    return {
      population,
      selectedParents,
      latestOffspring: [],
      generation,
      averageFitness: null,
      statusMessage: "Se necesitan al menos dos padres seleccionados antes de cruzar."
    };
  }

  const populationIndexByFigure = new Map(
    population.map(function (figure, index) {
      return [figure, index];
    })
  );
  const sortedWorstFirst = [...population].sort(function (a, b) {
    return (a.fitness ?? Infinity) - (b.fitness ?? Infinity);
  });
  const replacementCount = Math.min(selectedParents.length, sortedWorstFirst.length);
  const nextPopulation = population.map(function (figure) {
    return {
      ...figure,
      isSelected: false
    };
  });
  const offspring = [];

  for (let i = 0; i < replacementCount; i++) {
    const targetFigure = sortedWorstFirst[i];
    const targetIndex = populationIndexByFigure.get(targetFigure);
    const parentA = selectedParents[i % selectedParents.length];
    const parentB = selectedParents[(i + 1) % selectedParents.length];
    const childFigure = {
      ...nextPopulation[targetIndex],
      color: mixParentColors(p, parentA, parentB),
      isSelected: true
    };

    updateFigureFitness(childFigure);
    nextPopulation[targetIndex] = childFigure;
    offspring.push(childFigure);
  }

  const nextGeneration = generation + 1;
  const averageFitness = getAverageFitness(nextPopulation);

  return {
    population: nextPopulation,
    selectedParents: offspring,
    latestOffspring: offspring,
    generation: nextGeneration,
    averageFitness,
    statusMessage:
      `Generación ${nextGeneration} creada mediante cruce. ${offspring.length} hijos ` +
      `reemplazaron a los cuadrados más débiles. Aptitud promedio: ${averageFitness.toFixed(4)}.`
  };
}
