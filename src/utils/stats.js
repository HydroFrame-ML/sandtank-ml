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

export function histogram(vector, options) {
  // Taken from https://github.com/jrideout/histogram-pretty/blob/master/histogram-pretty.js

  options = options || {};
  options.copy = options.copy === undefined ? true : options.copy;
  options.pretty = options.pretty === undefined ? true : options.pretty;

  var s = vector;
  if (options.copy) s = s.slice();
  s.sort(function(a, b) {
    return a - b;
  });

  function quantile(p) {
    var idx = 1 + (s.length - 1) * p,
      lo = Math.floor(idx),
      hi = Math.ceil(idx),
      h = idx - lo;
    return (1 - h) * s[lo] + h * s[hi];
  }

  function freedmanDiaconis() {
    var iqr = quantile(0.75) - quantile(0.25);
    return 2 * iqr * Math.pow(s.length, -1 / 3);
  }

  function pretty(x) {
    var scale = Math.pow(10, Math.floor(Math.log(x / 10) / Math.LN10)),
      err = (10 / x) * scale;
    if (err <= 0.15) scale *= 10;
    else if (err <= 0.35) scale *= 5;
    else if (err <= 0.75) scale *= 2;
    return scale * 10;
  }

  var h = freedmanDiaconis();
  if (options.pretty) h = pretty(h);

  function bucket(d) {
    return h * Math.floor(d / h);
  }

  function tickRange(n) {
    var extent = [bucket(s[0]), h + bucket(s[s.length - 1])],
      buckets = Math.round((extent[1] - extent[0]) / h),
      step = buckets > n ? Math.round(buckets / n) : 1,
      pad = buckets % step; // to center whole step markings
    return [
      extent[0] + h * Math.floor(pad / 2),
      extent[1] - h * Math.ceil(pad / 2) + h * 0.5, // pad upper extent for d3.range
      h * step,
    ];
  }

  return {
    size: h,
    fun: bucket,
    tickRange: tickRange,
  };
}

export function range(start, end, step = 1) {
  const len = Math.floor((end - start) / step) + 1;
  return Array(len)
    .fill()
    .map((_, idx) => start + idx * step);
}
