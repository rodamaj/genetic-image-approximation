import { evolveOneGeneration } from "../genetic/evolution.js";
import {
  AUTO_EVOLVE_INTERVAL_MS,
  FIXED_CELL_SIZE,
  MAX_AUTO_EVOLVE_GENERATIONS
} from "../config/constants.js";
import { createUiControls } from "./ui-controls.js";
import { redrawPopulation } from "./renderer.js";
import { createPopulation } from "./population-factory.js";
import {
  evaluateFigureWithReference,
  evaluatePopulationWithReference
} from "./reference-fitness.js";
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
    if (!algorithmState.referenceReady) {
      return figure.clearFitness();
    }

    return evaluateFigureWithReference(figure, referenceState);
  }

  function generateRandomFigures(p) {
    uiControls.stopAutoEvolve();
    algorithmState.referenceReady = initializeReference();
    algorithmState.population = createPopulation(
      p,
      algorithmState.referenceReady,
      function update(figure) {
        return updateFigureFitness(figure);
      }
    );
    algorithmState.generation = 0;

    if (!algorithmState.referenceReady) {
      redrawPopulation(p, algorithmState.population);
      return;
    }

    const fitnessResult = evaluatePopulationWithReference(
      algorithmState.population,
      referenceState
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

    if (!algorithmState.referenceReady) {
      algorithmState.referenceReady = initializeReference();
      if (!algorithmState.referenceReady) {
        return null;
      }
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
      const result = evolveGeneration(p);

      if (result !== null && algorithmState.generation >= MAX_AUTO_EVOLVE_GENERATIONS) {
        uiControls.stopAutoEvolve();
        updateStatus(
          `Evolución continua detenida en la generación ${algorithmState.generation} al alcanzar el límite de ${MAX_AUTO_EVOLVE_GENERATIONS} generaciones.`
        );
      }
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
