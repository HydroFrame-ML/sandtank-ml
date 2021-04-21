// Common functions
function toCategorical(colors, cuts = []) {
  return (v) => {
    let index = 0;
    while (index < cuts.length) {
      const cut = cuts[index];
      if (v < cut) {
        return colors[index];
      }
      // Move to next cut
      index++;
    }
    return colors[index];
  };
}

function toGrayScale(min, max) {
  const clampValue = new Uint8ClampedArray(1);
  const delta = max - min;
  return (v) => {
    clampValue[0] = (255 * (v - min)) / delta;
    return clampValue[0];
  };
}

// Generated
const GRAY_0_1 = toGrayScale(0, 1);
const PRESSURE_COLORS = toCategorical(
  [
    [0, 0, 0], // cut-off: -inf
    [180, 180, 180], // dry region: 0
    [187, 222, 251], // water +
    [144, 202, 249], // water ++
    [100, 182, 246], // water +++
    [66, 165, 245], // water ++++
    [30, 136, 229], // water +++++
    [25, 118, 210], // water ++++++
    [21, 101, 192], // water +++++++
    [13, 71, 161], // water +++++++
  ],
  [-20, 0, 1, 5, 10, 15, 20, 30, 40],
);

export default {
  state: {
    srcRange: [-1, 1],
    dstRange: [-30, 50],
  },
  getters: {
    TRAN_PERMABILITY() {
      return GRAY_0_1;
    },
    TRAN_PRESSURE() {
      return PRESSURE_COLORS;
    },
    TRAN_AI_TO_PRESS(state) {
      const [s0, s1] = state.srcRange;
      const [d0, d1] = state.dstRange;
      const sd = s1 - s0;
      const dd = d1 - d0;
      return (v) => {
        if (v < s0) {
          return d0;
        }
        if (v > s1) {
          return d1;
        }
        return dd * (v - s0) / sd + d0;
      }
    },
  },
};
