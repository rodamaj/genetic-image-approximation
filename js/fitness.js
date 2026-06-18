export function syncReferenceImage(state) {
  if (!state.referenceImage.complete || state.referenceImage.naturalWidth === 0) {
    state.referenceReady = false;
    state.updateStatus("Aptitud pendiente. La imagen de referencia todavía está cargando.");
    return false;
  }

  try {
    state.referenceContext.clearRect(
      0,
      0,
      state.referenceCanvas.width,
      state.referenceCanvas.height
    );
    state.referenceContext.drawImage(
      state.referenceImage,
      0,
      0,
      state.referenceCanvas.width,
      state.referenceCanvas.height
    );
    state.referenceContext.getImageData(0, 0, 1, 1);
    state.referenceReady = true;
    state.updateStatus("Imagen de referencia lista. Genera la población para evaluar cada cuadrado.");
    return true;
  } catch (error) {
    state.referenceReady = false;
    state.updateStatus("Aptitud no disponible. No se pudo muestrear la imagen de referencia.");
    console.error("Reference image sampling failed:", error);
    return false;
  }
}

export function getAverageReferenceColor(state, x, y, size) {
  const { data, width, height } = state.referenceContext.getImageData(x, y, size, size);
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

export function calculateFigureFitness(p, state, figure) {
  if (!state.referenceReady) {
    return {
      ...figure,
      fitness: null,
      targetColor: null
    };
  }

  const targetColor = getAverageReferenceColor(state, figure.x, figure.y, figure.size);
  const redDiff = p.red(figure.color) - targetColor.r;
  const greenDiff = p.green(figure.color) - targetColor.g;
  const blueDiff = p.blue(figure.color) - targetColor.b;
  const alphaDiff = p.alpha(figure.color) - targetColor.a;
  const distance = Math.sqrt(
    redDiff ** 2 +
    greenDiff ** 2 +
    blueDiff ** 2 +
    alphaDiff ** 2
  );

  return {
    ...figure,
    targetColor,
    fitness: 1 / (1 + distance)
  };
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

export function updatePopulationFitness(p, state) {
  if (!syncReferenceImage(state)) {
    return {
      population: state.population.map(function (figure) {
        return {
          ...figure,
          fitness: null,
          targetColor: null,
          isSelected: false
        };
      }),
      averageFitness: null
    };
  }

  const population = state.population.map(function (figure) {
    return calculateFigureFitness(p, state, figure);
  });

  return {
    population,
    averageFitness: getAverageFitness(population)
  };
}
