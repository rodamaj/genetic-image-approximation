function getPopulationIndexByFigure(population) {
  return new Map(
    population.map(function (figure, index) {
      return [figure, index];
    })
  );
}

function clampColorChannel(value) {
  return Math.max(0, Math.min(255, value));
}

function mutateFigure(p, figure, mutationStrength = 5) {
  return {
    ...figure,
    color: p.color(
      clampColorChannel(p.red(figure.color) + p.random(-mutationStrength, mutationStrength)),
      clampColorChannel(p.green(figure.color) + p.random(-mutationStrength, mutationStrength)),
      clampColorChannel(p.blue(figure.color) + p.random(-mutationStrength, mutationStrength)),
      p.alpha(figure.color)
    )
  };
}

export function mutatePopulation(
  p,
  population,
  updateFigureFitness,
  mutationRate = 0.7,
  mutationStrength = 25
) {
  const offspring = population.filter(function (figure) {
    return figure.isSelected;
  });
  const populationIndexByFigure = getPopulationIndexByFigure(population);
  const nextPopulation = population.map(function (figure) {
    return {
      ...figure,
      isSelected: false
    };
  });
  const mutatedFigureIndexes = new Set();

  for (const figure of offspring) {
    if (p.random() <= mutationRate) {
      const targetIndex = populationIndexByFigure.get(figure);
      const mutatedFigure = mutateFigure(p, nextPopulation[targetIndex], mutationStrength);
      mutatedFigure.isSelected = true;
      updateFigureFitness(mutatedFigure);
      nextPopulation[targetIndex] = mutatedFigure;
      mutatedFigureIndexes.add(targetIndex);
    }
  }

  if (mutatedFigureIndexes.size === 0) {
    const fallbackIndex = populationIndexByFigure.get(offspring[0]);
    const fallbackFigure = mutateFigure(p, nextPopulation[fallbackIndex], mutationStrength);
    fallbackFigure.isSelected = true;
    updateFigureFitness(fallbackFigure);
    nextPopulation[fallbackIndex] = fallbackFigure;
  }

  return nextPopulation;
}
