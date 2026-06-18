export function selectParents(population, topPercent = 0.2) {
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

  return population.map(function (figure, index) {
    return {
      ...figure,
      isSelected: selectedIndexes.has(index)
    };
  });
}
