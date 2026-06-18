import { BACKGROUND_COLOR, HIGHLIGHT_STROKE_COLOR } from "../config/constants.js";

function drawFigure(p, figure) {
  p.noStroke();
  p.fill(figure.color.r, figure.color.g, figure.color.b, figure.color.a);
  p.square(figure.x, figure.y, figure.size);

  if (figure.isSelected) {
    p.noFill();
    p.stroke(HIGHLIGHT_STROKE_COLOR);
    p.strokeWeight(2);
    p.square(figure.x + 1, figure.y + 1, figure.size - 2);
  }
}

export function redrawPopulation(p, population) {
  p.background(BACKGROUND_COLOR);

  for (const figure of population) {
    drawFigure(p, figure);
  }
}
