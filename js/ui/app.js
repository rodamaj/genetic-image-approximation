import { calculateFigureFitness, updatePopulationFitness } from "../genetic/fitness.js";
import { evolveOneGeneration } from "../genetic/evolution.js";
import { AUTO_EVOLVE_INTERVAL_MS, FIXED_CELL_SIZE } from "../config/constants.js";
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

  function updateFigureFitness(figure) {
    return calculateFigureFitness(algorithmState.referenceReady, referenceState, figure);
  }

  function generateRandomFigures(p) {
    uiControls.stopAutoEvolve();
    algorithmState.population = createPopulation(
      p,
      algorithmState.referenceReady,
      function update(figure) {
        return updateFigureFitness(figure);
      }
    );
    algorithmState.generation = 0;

    const fitnessResult = updatePopulationFitness(
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

    const result = evolveOneGeneration(
      algorithmState.population,
      {
        updateFigureFitness: function update(figure) {
          return updateFigureFitness(figure);
        },
        random: function random() {
          return p.random();
        },
        randomBetween: function randomBetween(min, max) {
          return p.random(min, max);
        }
      }
    );

    algorithmState.population = result.population;
    algorithmState.generation += 1;

    redrawPopulation(p, algorithmState.population);
    updateStatus(
      `Generación ${algorithmState.generation} evolucionada. ${result.parents.length} padres, ` +
      `${result.offspring.length} hijos y ${result.mutatedFigures.length} mutaciones aplicadas. ` +
      `Aptitud promedio: ${result.averageFitness.toFixed(4)}.`
    );

    return {
      ...result,
      generation: algorithmState.generation
    };
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
