export function createUiControls(uiState, updateStatus) {
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

  function startAutoEvolve(runStep, intervalMs) {
    uiState.autoEvolveTimer = window.setInterval(function () {
      runStep();
    }, intervalMs);
  }

  function isAutoEvolving() {
    return uiState.autoEvolveTimer !== null;
  }

  return {
    setAutoEvolveButtonLabel,
    stopAutoEvolve,
    startAutoEvolve,
    isAutoEvolving,
    updateStatus
  };
}
