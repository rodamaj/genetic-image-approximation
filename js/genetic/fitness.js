export function syncReferenceImage(referenceState, updateStatus) {
  if (!referenceState.image.complete || referenceState.image.naturalWidth === 0) {
    updateStatus("Aptitud pendiente. La imagen de referencia todavía está cargando.");
    return false;
  }

  try {
    referenceState.context.clearRect(
      0,
      0,
      referenceState.canvas.width,
      referenceState.canvas.height
    );
    referenceState.context.drawImage(
      referenceState.image,
      0,
      0,
      referenceState.canvas.width,
      referenceState.canvas.height
    );
    referenceState.context.getImageData(0, 0, 1, 1);
    updateStatus("Imagen de referencia lista. Genera la población para evaluar cada cuadrado.");
    return true;
  } catch (error) {
    updateStatus("Aptitud no disponible. No se pudo muestrear la imagen de referencia.");
    console.error("Reference image sampling failed:", error);
    return false;
  }
}

export function getAverageReferenceColor(referenceState, x, y, size) {
  const { data, width, height } = referenceState.context.getImageData(x, y, size, size);
  let red = 0;
  let green = 0;
  let blue = 0;
  let alpha = 0;
  const pixels = width * height;

  for (let i = 0; i < data.length; i += 4) {
    red += data[i];
    green += data[i + 1];
    blue += data[i + 2];
    alpha += data[i + 3];
  }

  return {
    r: red / pixels,
    g: green / pixels,
    b: blue / pixels,
    a: alpha / pixels
  };
}

export function calculateFigureFitness(referenceReady, referenceState, figure) {
  if (!referenceReady) {
    return figure.withFitness(null, null);
  }

  const targetColor = getAverageReferenceColor(referenceState, figure.x, figure.y, figure.size);
  const redDiff = figure.color.r - targetColor.r;
  const greenDiff = figure.color.g - targetColor.g;
  const blueDiff = figure.color.b - targetColor.b;
  const alphaDiff = figure.color.a - targetColor.a;
  const distance = Math.sqrt(
    redDiff ** 2 +
    greenDiff ** 2 +
    blueDiff ** 2 +
    alphaDiff ** 2
  );

  return figure.withFitness(targetColor, 1 / (1 + distance));
}

export function getAverageFitness(population) {
  if (population.length === 0) {
    return null;
  }

  let totalFitness = 0;

  for (const figure of population) {
    totalFitness += figure.fitness ?? 0;
  }

  return totalFitness / population.length;
}

export function updatePopulationFitness(
  algorithmState,
  referenceState,
  updateStatus
) {
  if (!syncReferenceImage(referenceState, updateStatus)) {
    return {
      population: algorithmState.population.map(function (figure) {
        return figure.clearFitness();
      }),
      averageFitness: null
    };
  }

  const population = algorithmState.population.map(function (figure) {
    return calculateFigureFitness(true, referenceState, figure);
  });

  return {
    population,
    averageFitness: getAverageFitness(population)
  };
}
