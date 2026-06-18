export function createUiState() {
  return {
    autoEvolveTimer: null,
    fitnessStatus: document.getElementById("fitnessStatus"),
    autoEvolveButton: document.getElementById("toggleAutoEvolveBtn"),
    referenceImage: document.getElementById("stockImage")
  };
}
