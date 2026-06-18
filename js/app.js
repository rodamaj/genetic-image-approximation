import { calculateFigureFitness, updatePopulationFitness } from "./fitness.js";
import { evolveOneGeneration } from "./evolution.js";
import { AUTO_EVOLVE_INTERVAL_MS, FIXED_CELL_SIZE } from "./constants.js";
import { createUiControls } from "./ui-controls.js";
import { redrawPopulation } from "./renderer.js";
import { createPopulation } from "./population-factory.js";
import {
  initializeReference as syncInitialReference,
  handleReferenceError as setReferenceError
} from "./reference-actions.js";

export function createApp(algorithmState, uiState, referenceState) {
  function updateStatus(message) {
    uiState.fitnessStatus.textContent = message;
  }

  const uiControls = createUiControls(uiState, updateStatus);

  function updateFigureFitness(p, figure) {
    return calculateFigureFitness(p, algorithmState.referenceReady, referenceState, figure);
  }

  function generateRandomFigures(p) {
    uiControls.stopAutoEvolve();
    algorithmState.population = createPopulation(
      p,
      algorithmState.referenceReady,
      function update(figure) {
        return updateFigureFitness(p, figure);
      }
    );
    algorithmState.generation = 0;

    const fitnessResult = updatePopulationFitness(
      p,
      algorithmState,
      referenceState,
      updateStatus
    );
    algorithmState.population = fitnessResult.population;
    algorithmState.referenceReady = fitnessResult.averageFitness !== null;
    redrawPopulation(p, algorithmState.population);

    if (fitnessResult.averageFitness === null) {
      return;
    }

    updateStatus(
      `Generación ${algorithmState.generation} lista. ${algorithmState.population.length} cuadrados evaluados con píxeles de ${FIXED_CELL_SIZE}px. Aptitud promedio: ${fitnessResult.averageFitness.toFixed(4)}.`
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
        redrawPopulation(p, algorithmState.population);
      },
      updateStatus
    });
  }

  function toggleAutoEvolve(p, intervalMs = AUTO_EVOLVE_INTERVAL_MS) {
    if (uiControls.isAutoEvolving()) {
      uiControls.stopAutoEvolve();
      updateStatus(`Evolución continua en pausa en la generación ${algorithmState.generation}.`);
      return false;
    }

    if (algorithmState.population.length === 0) {
      generateRandomFigures(p);
    }

    uiControls.startAutoEvolve(function runStep() {
      evolveGeneration(p);
    }, intervalMs);

    uiControls.setAutoEvolveButtonLabel(true);
    updateStatus(`Evolución continua iniciada desde la generación ${algorithmState.generation}.`);
    return true;
  }

  function initializeReference() {
    return syncInitialReference(algorithmState, referenceState, updateStatus);
  }

  function handleReferenceError() {
    setReferenceError(algorithmState, updateStatus);
  }

  return {
    updateStatus,
    setAutoEvolveButtonLabel: uiControls.setAutoEvolveButtonLabel,
    generateRandomFigures,
    evolveGeneration,
    toggleAutoEvolve,
    initializeReference,
    handleReferenceError
  };
}
