import { createAlgorithmState } from "./state/algorithm-state.js";
import { createUiState } from "./state/ui-state.js";
import { createReferenceState } from "./state/reference-state.js";
import { createApp } from "./ui/app.js";
import { BACKGROUND_COLOR, CANVAS_HEIGHT, CANVAS_WIDTH } from "./config/constants.js";

const algorithmState = createAlgorithmState();
const uiState = createUiState();
const referenceState = createReferenceState(uiState.referenceImage);
const app = createApp(algorithmState, uiState, referenceState);

const sketch = function (p) {
  p.setup = function () {
    const canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent("sketch-holder-2");
    p.background(BACKGROUND_COLOR);
    app.initializeReference();
    app.setAutoEvolveButtonLabel(false);
  };
};

const p5instance = new p5(sketch);

uiState.referenceImage.addEventListener("load", function () {
  app.initializeReference();
});

uiState.referenceImage.addEventListener("error", function () {
  app.handleReferenceError();
});

document.getElementById("generatePopulationBtn").addEventListener("click", function () {
  app.generateRandomFigures(p5instance);
});

document.getElementById("evolveGenerationBtn").addEventListener("click", function () {
  app.evolveGeneration(p5instance);
});

document.getElementById("toggleAutoEvolveBtn").addEventListener("click", function () {
  app.toggleAutoEvolve(p5instance);
});
