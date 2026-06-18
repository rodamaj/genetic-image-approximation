function getPopulationIndexByFigure(population) {
  return new Map(
    population.map(function (figure, index) {
      return [figure, index];
    })
  );
}

function mixParentColors(p, parentA, parentB) {
  return p.color(
    (p.red(parentA.color) + p.red(parentB.color)) / 2,
    (p.green(parentA.color) + p.green(parentB.color)) / 2,
    (p.blue(parentA.color) + p.blue(parentB.color)) / 2,
    (p.alpha(parentA.color) + p.alpha(parentB.color)) / 2
  );
}

export function crossoverPopulation(p, population, updateFigureFitness) {
  const parents = population.filter(function (figure) {
    return figure.isSelected;
  });
  const populationIndexByFigure = getPopulationIndexByFigure(population);
  const sortedWorstFirst = [...population].sort(function (a, b) {
    return (a.fitness ?? Infinity) - (b.fitness ?? Infinity);
  });
  const replacementCount = Math.min(parents.length, sortedWorstFirst.length);
  const nextPopulation = population.map(function (figure) {
    return {
      ...figure,
      isSelected: false
    };
  });

  for (let i = 0; i < replacementCount; i++) {
    const targetFigure = sortedWorstFirst[i];
    const targetIndex = populationIndexByFigure.get(targetFigure);
    const parentA = parents[i % parents.length];
    const parentB = parents[(i + 1) % parents.length];
    const childFigure = {
      ...nextPopulation[targetIndex],
      color: mixParentColors(p, parentA, parentB),
      isSelected: true
    };

    updateFigureFitness(childFigure);
    nextPopulation[targetIndex] = childFigure;
  }

  return nextPopulation;
}
