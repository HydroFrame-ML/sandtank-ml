import { histogram, range } from 'sandtank-ml/src/utils/histogram';

export const addErrorStats = (models, ref) => {
  let globalMax = 0;

  for (const model of models) {
    model.stats = {};

    // Add delta
    model.stats.presDelta = model.values.map((p, idx) =>
      Math.abs(ref[idx] - p),
    );
    const normCutoff = -0.25;
    model.stats.satDelta = model.values.map((p, idx) =>
      ref[idx] > normCutoff === p > normCutoff ? 0 : 1,
    );

    // Fill histogram bins
    const binCount = 100;
    const hist = histogram(model.stats.presDelta, { pretty: true });
    const labels = range(1 / binCount, 1 + 1 / binCount, 1 / binCount);
    model.stats.histData = Array(labels.length).fill(0);
    for (let i = 0; i < model.stats.presDelta.length; i++) {
      const value = model.stats.presDelta[i];
      const index = labels.indexOf(hist.fun(value));
      model.stats.histData[index] = model.stats.histData[index] + 1;
    }

    // Track global max
    const localMax = Math.max(...model.stats.histData);
    if (localMax > globalMax) {
      globalMax = localMax;
    }

    // Add Pie Data
    const errorCount = ([errors, accuracies], val) => {
      if (val) {
        errors++;
      } else {
        accuracies++;
      }
      return [errors, accuracies];
    };
    model.stats.pieData = model.stats.satDelta.reduce(errorCount, [0, 0]);

    // Add error statistics
    const L1Error = (acc, val, idx) => {
      const resid = Math.abs(val - ref[idx]);
      acc.l1 += resid;
      if (resid > acc.lmax) {
        acc.lmax = resid;
      }
      return acc;
    };
    model.stats = {
      ...model.stats,
      ...model.values.reduce(L1Error, { l1: 0, lmax: 0 }),
    };

    const stdDev = (acc, val, idx) => {
      acc += (val - ref[idx]) ** 2;
      return acc;
    };
    model.stats.stdDev =
      (model.values.reduce(stdDev) / model.values.length) ** 0.5;
  }

  // Set global histogram yMax on all models
  for (let model of models) {
    model.stats.histGlobalMax = globalMax;
  }
};

export const simplifyNumber = (n) => {
  // Removes all non-zero digits except one
  if (n === 0) {
    return 0;
  }

  if (n >= 10) {
    return Math.round(n);
  }

  let decimalPlaces = 0 - Math.ceil(Math.log(n) / Math.log(10));
  if (isNaN(decimalPlaces)) {
    decimalPlaces = 1;
  }

  const result = n.toFixed(decimalPlaces);

  // Handle negative zero
  if (Math.sign(result) === 0) {
    return 0;
  }

  return result;
};
