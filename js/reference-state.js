import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";

export function createReferenceState(image) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", {
    willReadFrequently: true
  });

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  return {
    image,
    canvas,
    context
  };
}
