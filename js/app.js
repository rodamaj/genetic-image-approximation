import {
  syncReferenceImage,
  calculateFigureFitness,
  updatePopulationFitness
} from "./fitness.js";
import { evolveOneGeneration } from "./evolution.js";

export function createApp(algorithmState, uiState, referenceState) {
  function updateStatus(message) {
    uiState.fitnessStatus.textContent = message;
  }

  function setAutoEvolveButtonLabel(isRunning) {
    uiState.autoEvolveButton.textContent = isRunning
      ? "Pausar Evolución Continua"
      : "Iniciar Evolución Continua";
  }

  function stopAutoEvolve() {
    if (uiState.autoEvolveTimer !== null) {
      window.clearInterval(uiState.autoEvolveTimer);
      uiState.autoEvolveTimer = null;
    }

    setAutoEvolveButtonLabel(false);
  }

  function syncCellSizeFromUI() {
    algorithmState.cellSize = Number(uiState.pixelSizeSelect.value);
  }

  function updateFigureFitness(p, figure) {
    return calculateFigureFitness(p, algorithmState.referenceReady, referenceState, figure);
  }

  function createFigure(p, x, y) {
    const figure = {
      x,
      y,
      size: algorithmState.cellSize,
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

    if (algorithmState.referenceReady) {
      return updateFigureFitness(p, figure);
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
    for (const figure of algorithmState.population) {
      drawFigure(p, figure);
    }
  }

  function generateRandomFigures(p) {
    stopAutoEvolve();
    algorithmState.population = [];
    algorithmState.generation = 0;

    for (let y = 0; y < p.height; y += algorithmState.cellSize) {
      for (let x = 0; x < p.width; x += algorithmState.cellSize) {
        algorithmState.population.push(createFigure(p, x, y));
      }
    }

    const fitnessResult = updatePopulationFitness(
      p,
      algorithmState,
      referenceState,
      updateStatus
    );
    algorithmState.population = fitnessResult.population;
    algorithmState.referenceReady = fitnessResult.averageFitness !== null;
    redrawPopulation(p);

    if (fitnessResult.averageFitness === null) {
      return;
    }

    updateStatus(
      `Generación ${algorithmState.generation} lista. ${algorithmState.population.length} cuadrados evaluados con píxeles de ${algorithmState.cellSize}px. Aptitud promedio: ${fitnessResult.averageFitness.toFixed(4)}.`
    );
  }

  function evolveGeneration(p) {
    if (algorithmState.population.length === 0) {
      generateRandomFigures(p);
    }

    return evolveOneGeneration(p, algorithmState, {
      updateFigureFitness: function update(figure) {
        return updateFigureFitness(p, figure);
      },
      redrawPopulation: function redraw() {
        redrawPopulation(p);
      },
      updateStatus
    });
  }

  function toggleAutoEvolve(p, intervalMs = 250) {
    if (uiState.autoEvolveTimer !== null) {
      stopAutoEvolve();
      updateStatus(`Evolución continua en pausa en la generación ${algorithmState.generation}.`);
      return false;
    }

    if (algorithmState.population.length === 0) {
      generateRandomFigures(p);
    }

    uiState.autoEvolveTimer = window.setInterval(function () {
      evolveGeneration(p);
    }, intervalMs);

    setAutoEvolveButtonLabel(true);
    updateStatus(`Evolución continua iniciada desde la generación ${algorithmState.generation}.`);
    return true;
  }

  function initializeReference() {
    algorithmState.referenceReady = syncReferenceImage(referenceState, updateStatus);
    return algorithmState.referenceReady;
  }

  function handleReferenceError() {
    algorithmState.referenceReady = false;
    updateStatus("Aptitud no disponible. No se pudo cargar la imagen de referencia local.");
  }

  return {
    updateStatus,
    setAutoEvolveButtonLabel,
    syncCellSizeFromUI,
    redrawPopulation,
    generateRandomFigures,
    evolveGeneration,
    toggleAutoEvolve,
    initializeReference,
    handleReferenceError
  };
}
