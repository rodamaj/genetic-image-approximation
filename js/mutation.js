function clampColorChannel(value) {
  return Math.max(0, Math.min(255, value));
}

export function mutateFigure(p, figure, mutationStrength = 5) {
  const mutatedColor = p.color(
    clampColorChannel(p.red(figure.color) + p.random(-mutationStrength, mutationStrength)),
    clampColorChannel(p.green(figure.color) + p.random(-mutationStrength, mutationStrength)),
    clampColorChannel(p.blue(figure.color) + p.random(-mutationStrength, mutationStrength)),
    p.alpha(figure.color)
  );

  figure.color = mutatedColor;
  return figure;
}

export function mutateLatestOffspring(
  p,
  state,
  updateFigureFitness,
  updatePopulationFitness,
  redrawPopulation,
  mutationRate = 0.7,
  mutationStrength = 25
) {
  if (state.latestOffspring.length === 0) {
    state.updateStatus("No hay hijos recientes para mutar. Ejecuta el cruce antes de mutar.");
    return [];
  }

  const mutatedFigures = [];

  for (const figure of state.latestOffspring) {
    if (p.random() <= mutationRate) {
      mutateFigure(p, figure, mutationStrength);
      updateFigureFitness(figure);
      figure.isSelected = true;
      mutatedFigures.push(figure);
    }
  }

  if (mutatedFigures.length === 0) {
    const fallbackFigure = state.latestOffspring[0];
    mutateFigure(p, fallbackFigure, mutationStrength);
    updateFigureFitness(fallbackFigure);
    fallbackFigure.isSelected = true;
    mutatedFigures.push(fallbackFigure);
  }

  const averageFitness = updatePopulationFitness();
  redrawPopulation();

  if (averageFitness !== null) {
    state.updateStatus(
      `${mutatedFigures.length} hijos mutados en la generación ${state.generation}. Aptitud promedio: ${averageFitness.toFixed(4)}.`
    );
  }

  return mutatedFigures;
}
