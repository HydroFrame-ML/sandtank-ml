export const addErrorStats = (models, ref) => {
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

    // Generate histogram data
    model.stats.histData = model.stats.presDelta;

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

export class Histogram {
  constructor(values, labels) {
    this.values = values;
    this.labels = labels;
  }

  calculateBins() {
    const bins = Array(this.labels.length).fill(0);
    for (const value of this.values) {
      for (var i = 1; i < this.labels.length; i++)
        if (this.labels[i - 1] < value && value < this.labels[i]) {
          bins[i] += 1;
          break;
        }
    }
    return bins;
  }
}

export function range(start, end, step = 1) {
  const len = Math.floor((end - start) / step) + 1;
  return Array(len)
    .fill()
    .map((_, idx) => start + idx * step);
}
