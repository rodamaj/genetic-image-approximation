export function selectParents(population, topPercent = 0.2) {
  if (population.length === 0) {
    return {
      population,
      selectedParents: [],
      latestOffspring: [],
      statusMessage:
        "No hay población disponible. Genera la población antes de seleccionar padres."
    };
  }

  const indexedPopulation = population.map(function (figure, index) {
    return { figure, index };
  });
  const sortedPopulation = [...indexedPopulation].sort(function (a, b) {
    return (b.figure.fitness ?? -Infinity) - (a.figure.fitness ?? -Infinity);
  });
  const parentCount = Math.max(1, Math.floor(sortedPopulation.length * topPercent));
  const selectedIndexes = new Set(
    sortedPopulation.slice(0, parentCount).map(function ({ index }) {
      return index;
    })
  );
  const nextPopulation = population.map(function (figure, index) {
    return {
      ...figure,
      isSelected: selectedIndexes.has(index)
    };
  });
  const selectedParents = nextPopulation.filter(function (_figure, index) {
    return selectedIndexes.has(index);
  });
  const bestFitness = selectedParents[0].fitness;
  const bestFitnessLabel =
    typeof bestFitness === "number" ? bestFitness.toFixed(4) : "sin evaluar";

  return {
    population: nextPopulation,
    selectedParents,
    latestOffspring: [],
    statusMessage:
      `${selectedParents.length} padres seleccionados de ${nextPopulation.length} cuadrados. ` +
      `Mejor aptitud: ${bestFitnessLabel}.`
  };
}
