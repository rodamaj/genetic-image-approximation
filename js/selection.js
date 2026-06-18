import { SELECTION_RATE } from "./constants.js";

export function selectParents(population, topPercent = SELECTION_RATE) {
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

  return population.filter(function (_figure, index) {
    return selectedIndexes.has(index);
  });
}
