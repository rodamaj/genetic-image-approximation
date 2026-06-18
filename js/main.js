import {
  syncReferenceImage,
  calculateFigureFitness,
  updatePopulationFitness
} from "./fitness.js";
import { evolveOneGeneration } from "./evolution.js";

const state = {
  population: [],
  generation: 0,
  autoEvolveTimer: null,
  cellSize: 10,
  referenceReady: false,
  fitnessStatus: document.getElementById("fitnessStatus"),
  autoEvolveButton: document.getElementById("toggleAutoEvolveBtn"),
  pixelSizeSelect: document.getElementById("pixelSizeSelect"),
  referenceImage: document.getElementById("stockImage"),
  referenceCanvas: document.createElement("canvas")
};

state.referenceContext = state.referenceCanvas.getContext("2d", {
  willReadFrequently: true
});
state.referenceCanvas.width = 400;
state.referenceCanvas.height = 300;

function updateStatus(message) {
  state.fitnessStatus.textContent = message;
}

state.updateStatus = updateStatus;

function setAutoEvolveButtonLabel(isRunning) {
  state.autoEvolveButton.textContent = isRunning
    ? "Pausar Evolución Continua"
    : "Iniciar Evolución Continua";
}

function stopAutoEvolve() {
  if (state.autoEvolveTimer !== null) {
    window.clearInterval(state.autoEvolveTimer);
    state.autoEvolveTimer = null;
  }

  setAutoEvolveButtonLabel(false);
}

function syncCellSizeFromUI() {
  state.cellSize = Number(state.pixelSizeSelect.value);
}

function createFigure(p, x, y) {
  const figure = {
    x,
    y,
    size: state.cellSize,
    color: p.color(
      p.random(40, 255),
      p.random(40, 255),
      p.random(40, 255),
      190
    ),
    fitness: null,
    targetColor: null,
    isSelected: false
  };

  if (state.referenceReady) {
    updateFigureFitness(p, figure);
  }

  return figure;
}

function drawFigure(p, figure) {
  p.noStroke();
  p.fill(figure.color);
  p.square(figure.x, figure.y, figure.size);

  if (figure.isSelected) {
    p.noFill();
    p.stroke(255);
    p.strokeWeight(2);
    p.square(figure.x + 1, figure.y + 1, figure.size - 2);
  }
}

function redrawPopulation(p) {
  p.background(255);
  for (const figure of state.population) {
    drawFigure(p, figure);
  }
}

function updateFigureFitness(p, figure) {
  return calculateFigureFitness(p, state, figure);
}

function generateRandomFigures(p) {
  stopAutoEvolve();
  state.population = [];
  state.generation = 0;

  for (let y = 0; y < p.height; y += state.cellSize) {
    for (let x = 0; x < p.width; x += state.cellSize) {
      state.population.push(createFigure(p, x, y));
    }
  }

  const averageFitness = updatePopulationFitness(p, state);
  redrawPopulation(p);

  if (averageFitness === null) {
    return;
  }

  updateStatus(
    `Generación ${state.generation} lista. ${state.population.length} cuadrados evaluados con píxeles de ${state.cellSize}px. Aptitud promedio: ${averageFitness.toFixed(4)}.`
  );
}

const sketch2 = function (p) {
  p.generateRandomFigures = function () {
    generateRandomFigures(p);
  };

  p.evolveOneGeneration = function () {
    if (state.population.length === 0) {
      generateRandomFigures(p);
    }

    return evolveOneGeneration(p, state, {
      updateFigureFitness: function update(figure) {
        return updateFigureFitness(p, figure);
      },
      redrawPopulation: function redraw() {
        redrawPopulation(p);
      }
    });
  };

  p.toggleAutoEvolve = function (intervalMs = 250) {
    if (state.autoEvolveTimer !== null) {
      stopAutoEvolve();
      updateStatus(`Evolución continua en pausa en la generación ${state.generation}.`);
      return false;
    }

    if (state.population.length === 0) {
      generateRandomFigures(p);
    }

    state.autoEvolveTimer = window.setInterval(function () {
      p.evolveOneGeneration();
    }, intervalMs);

    setAutoEvolveButtonLabel(true);
    updateStatus(`Evolución continua iniciada desde la generación ${state.generation}.`);
    return true;
  };

  p.setup = function () {
    const canvas = p.createCanvas(400, 300);
    canvas.parent("sketch-holder-2");
    p.background(255);
    syncCellSizeFromUI();
    syncReferenceImage(state);
    setAutoEvolveButtonLabel(false);
  };
};

state.referenceImage.addEventListener("load", function () {
  syncReferenceImage(state);
});

state.referenceImage.addEventListener("error", function () {
  state.referenceReady = false;
  updateStatus("Aptitud no disponible. No se pudo cargar la imagen de referencia local.");
});

state.pixelSizeSelect.addEventListener("change", function () {
  syncCellSizeFromUI();
  updateStatus(
    `Tamaño de píxel actualizado a ${state.cellSize}px. Genera la población nuevamente para aplicar la nueva resolución.`
  );
});

const p5instance2 = new p5(sketch2);

document.getElementById("generatePopulationBtn").addEventListener("click", function () {
  syncCellSizeFromUI();
  p5instance2.generateRandomFigures();
});

document.getElementById("evolveGenerationBtn").addEventListener("click", function () {
  p5instance2.evolveOneGeneration();
});

document.getElementById("toggleAutoEvolveBtn").addEventListener("click", function () {
  p5instance2.toggleAutoEvolve();
});
