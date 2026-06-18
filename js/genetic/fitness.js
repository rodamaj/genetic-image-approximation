export function calculateFigureFitness(figure) {
  if (figure.targetColor === null) {
    return figure.withFitness(null, null);
  }

  const redDiff = figure.color.r - figure.targetColor.r;
  const greenDiff = figure.color.g - figure.targetColor.g;
  const blueDiff = figure.color.b - figure.targetColor.b;
  const alphaDiff = figure.color.a - figure.targetColor.a;
  const distance = Math.sqrt(
    redDiff ** 2 +
    greenDiff ** 2 +
    blueDiff ** 2 +
    alphaDiff ** 2
  );

  return figure.withFitness(figure.targetColor, 1 / (1 + distance));
}

export function getAverageFitness(population) {
  if (population.length === 0) {
    return null;
  }

  let totalFitness = 0;

  for (const figure of population) {
    totalFitness += figure.fitness ?? 0;
  }

  return totalFitness / population.length;
}

export function updatePopulationFitness(population) {
  const nextPopulation = population.map(function (figure) {
    return calculateFigureFitness(figure);
  });

  return {
    population: nextPopulation,
    averageFitness: getAverageFitness(nextPopulation)
  };
}
