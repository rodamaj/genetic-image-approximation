import {
  COLOR_CHANNEL_MAX,
  COLOR_CHANNEL_MIN,
  FIGURE_ALPHA,
  FIXED_CELL_SIZE,
  MUTATION_STRENGTH,
  RANDOM_COLOR_MAX,
  RANDOM_COLOR_MIN
} from "../config/constants.js";

function clampColorChannel(value) {
  return Math.max(COLOR_CHANNEL_MIN, Math.min(COLOR_CHANNEL_MAX, value));
}

function createColor(r, g, b, a = FIGURE_ALPHA) {
  return { r, g, b, a };
}

export class Figure {
  constructor({ x, y, size = FIXED_CELL_SIZE, color, fitness = null, targetColor = null, isSelected = false }) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.fitness = fitness;
    this.targetColor = targetColor;
    this.isSelected = isSelected;
  }

  static createRandom(x, y, randomBetween) {
    return new Figure({
      x,
      y,
      color: createColor(
        randomBetween(RANDOM_COLOR_MIN, RANDOM_COLOR_MAX),
        randomBetween(RANDOM_COLOR_MIN, RANDOM_COLOR_MAX),
        randomBetween(RANDOM_COLOR_MIN, RANDOM_COLOR_MAX),
        FIGURE_ALPHA
      )
    });
  }

  withSelection(isSelected) {
    return new Figure({
      ...this,
      isSelected
    });
  }

  withColor(color) {
    return new Figure({
      ...this,
      color
    });
  }

  withFitness(targetColor, fitness) {
    return new Figure({
      ...this,
      targetColor,
      fitness
    });
  }

  clearFitness() {
    return new Figure({
      ...this,
      fitness: null,
      targetColor: null,
      isSelected: false
    });
  }

  mixColorWith(otherFigure) {
    return createColor(
      (this.color.r + otherFigure.color.r) / 2,
      (this.color.g + otherFigure.color.g) / 2,
      (this.color.b + otherFigure.color.b) / 2,
      (this.color.a + otherFigure.color.a) / 2
    );
  }

  mutateColor(randomBetween, mutationStrength = MUTATION_STRENGTH) {
    return createColor(
      clampColorChannel(this.color.r + randomBetween(-mutationStrength, mutationStrength)),
      clampColorChannel(this.color.g + randomBetween(-mutationStrength, mutationStrength)),
      clampColorChannel(this.color.b + randomBetween(-mutationStrength, mutationStrength)),
      this.color.a
    );
  }
}
