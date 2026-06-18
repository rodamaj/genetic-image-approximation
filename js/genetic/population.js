export function getPopulationIndexByFigure(population) {
  return new Map(
    population.map(function (figure, index) {
      return [figure, index];
    })
  );
}
