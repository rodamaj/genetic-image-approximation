export function createReferenceState(image) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", {
    willReadFrequently: true
  });

  canvas.width = 400;
  canvas.height = 300;

  return {
    image,
    canvas,
    context
  };
}
