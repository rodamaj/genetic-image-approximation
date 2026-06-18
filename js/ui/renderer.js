import { BACKGROUND_COLOR } from "../config/constants.js";

function drawFigure(p, figure) {
  p.noStroke();
  p.fill(figure.color.r, figure.color.g, figure.color.b, figure.color.a);
  p.square(figure.x, figure.y, figure.size);
}

export function redrawPopulation(p, population) {
  p.background(BACKGROUND_COLOR);

  for (const figure of population) {
    drawFigure(p, figure);
  }
}
