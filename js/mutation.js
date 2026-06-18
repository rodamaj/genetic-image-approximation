function clampColorChannel(value) {
  return Math.max(0, Math.min(255, value));
}

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

export function mutateFigure(p, figure, mutationStrength = 5) {
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

export function mutateLatestOffspring(
  p,
  population,
  latestOffspring,
  selectedParents,
  updateFigureFitness,
  generation,
  mutationRate = 0.7,
  mutationStrength = 25
) {
  if (latestOffspring.length === 0) {
    return {
      population,
      latestOffspring,
      selectedParents,
      generation,
      averageFitness: null,
      mutatedFigures: [],
      statusMessage: "No hay hijos recientes para mutar. Ejecuta el cruce antes de mutar."
    };
  }

  const populationIndexByFigure = new Map(
    population.map(function (figure, index) {
      return [figure, index];
    })
  );
  const nextPopulation = population.map(function (figure) {
    return {
      ...figure,
      isSelected: false
    };
  });
  const mutatedFigureIndexes = new Set();

  for (const figure of latestOffspring) {
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
    const fallbackIndex = populationIndexByFigure.get(latestOffspring[0]);
    const fallbackFigure = mutateFigure(p, nextPopulation[fallbackIndex], mutationStrength);
    fallbackFigure.isSelected = true;
    updateFigureFitness(fallbackFigure);
    nextPopulation[fallbackIndex] = fallbackFigure;
    mutatedFigureIndexes.add(fallbackIndex);
  }

  const nextLatestOffspring = latestOffspring.map(function (figure) {
    const index = populationIndexByFigure.get(figure);
    return nextPopulation[index];
  });
  const nextSelectedParents = selectedParents.map(function (figure) {
    const index = populationIndexByFigure.get(figure);
    return nextPopulation[index];
  });
  const mutatedFigures = nextLatestOffspring.filter(function (figure) {
    return figure.isSelected;
  });
  const averageFitness = getAverageFitness(nextPopulation);

  return {
    population: nextPopulation,
    latestOffspring: nextLatestOffspring,
    selectedParents: nextSelectedParents,
    generation,
    averageFitness,
    mutatedFigures,
    statusMessage:
      `${mutatedFigures.length} hijos mutados en la generación ${generation}. ` +
      `Aptitud promedio: ${averageFitness.toFixed(4)}.`
  };
}
