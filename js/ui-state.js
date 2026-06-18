export function createUiState() {
  return {
    autoEvolveTimer: null,
    fitnessStatus: document.getElementById("fitnessStatus"),
    autoEvolveButton: document.getElementById("toggleAutoEvolveBtn"),
    pixelSizeSelect: document.getElementById("pixelSizeSelect"),
    referenceImage: document.getElementById("stockImage")
  };
}
