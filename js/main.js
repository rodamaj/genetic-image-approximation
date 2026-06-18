import { createAlgorithmState } from "./algorithm-state.js";
import { createUiState } from "./ui-state.js";
import { createReferenceState } from "./reference-state.js";
import { createApp } from "./app.js";

const algorithmState = createAlgorithmState();
const uiState = createUiState();
const referenceState = createReferenceState(uiState.referenceImage);
const app = createApp(algorithmState, uiState, referenceState);

const sketch = function (p) {
  p.setup = function () {
    const canvas = p.createCanvas(400, 300);
    canvas.parent("sketch-holder-2");
    p.background(255);
    app.syncCellSizeFromUI();
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

uiState.pixelSizeSelect.addEventListener("change", function () {
  app.syncCellSizeFromUI();
  app.updateStatus(
    `Tamaño de píxel actualizado a ${algorithmState.cellSize}px. Genera la población nuevamente para aplicar la nueva resolución.`
  );
});

document.getElementById("generatePopulationBtn").addEventListener("click", function () {
  app.syncCellSizeFromUI();
  app.generateRandomFigures(p5instance);
});

document.getElementById("evolveGenerationBtn").addEventListener("click", function () {
  app.evolveGeneration(p5instance);
});

document.getElementById("toggleAutoEvolveBtn").addEventListener("click", function () {
  app.toggleAutoEvolve(p5instance);
});
