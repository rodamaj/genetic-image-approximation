import { syncReferenceImage } from "../genetic/fitness.js";

export function initializeReference(algorithmState, referenceState, updateStatus) {
  algorithmState.referenceReady = syncReferenceImage(referenceState, updateStatus);
  return algorithmState.referenceReady;
}

export function handleReferenceError(algorithmState, updateStatus) {
  algorithmState.referenceReady = false;
  updateStatus("Aptitud no disponible. No se pudo cargar la imagen de referencia local.");
}
