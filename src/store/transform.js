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

function toInvGrayScale(min, max) {
  const clampValue = new Uint8ClampedArray(1);
  const delta = max - min;
  return (v) => {
    clampValue[0] = 255 - (255 * (v - min)) / delta;
    return clampValue[0];
  };
}

// Generated
const GRAY_0_1 = toGrayScale(0, 1);
const GRAY_n1_1 = toGrayScale(-1, 1);
const INV_GRAY_0_1 = toInvGrayScale(0, 0.5);
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

const NORM_PRESSURE_COLORS = toCategorical(
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
  [-0.8, -0.25, 0, 0.25, 0.5, 0.75],
);

const NORM_PRESSURE_COLOR = toCategorical(
  [
    [0, 0, 0], // cut-off: -inf
    [180, 180, 180], // dry region: 0
    [187, 222, 251], // water +
  ],
  [-0.8, -0.25],
);

const CAT6_COLORS = [
  [255, 255, 255],
  [255 * 0.760784, 255 * 0.8, 255 * 0.721569],
  [255 * 0.529412, 255 * 0.509804, 255 * 0.447059],
  [255 * 0.858824, 255 * 0.623529, 255 * 0.352941],
  [255 * 1, 255 * 0.945098, 255 * 0.580392],
  [255 * 0.666667, 255 * 0.901961, 255 * 0.670588],
  [255 * 0.494118, 255 * 0.741176, 255 * 0.768627],
];
const COLOR_CAT_PRESS = toCategorical(CAT6_COLORS, [
  -0.8,
  -0.25,
  0,
  0.25,
  0.5,
  0.75,
]);

// const DIFF_COLORS = toCategorical(
//   [
//     [213, 0, 0],
//     [244, 81, 30],
//     [255, 183, 77],
//     [105, 240, 174], // perfect
//     [255, 183, 77],
//     [244, 81, 30],
//     [213, 0, 0],
//   ],
//   [-20, -10, -2, 2, 10],
// );

export default {
  state: {
    srcRange: [-1, 1],
    dstRange: [-30, 50],
    pressureGradient: true,
  },
  getters: {
    TRAN_PRESS_USE_GRADIENT(state) {
      return state.pressureGradient;
    },
    TRAN_PERMABILITY() {
      return GRAY_0_1;
    },
    TRAN_PERMABILITY_AI() {
      return GRAY_n1_1;
    },
    TRAN_PRESSURE() {
      return PRESSURE_COLORS;
    },
    TRAN_NORM_PRESSURE_TO_COLOR(state) {
      return state.pressureGradient
        ? NORM_PRESSURE_COLORS
        : NORM_PRESSURE_COLOR;
    },
    TRAN_PRESS_TO_NORM(state) {
      const [s0, s1] = state.dstRange;
      const [d0, d1] = state.srcRange;
      const sd = s1 - s0;
      const dd = d1 - d0;
      return (v) => {
        if (v < s0) {
          return d0;
        }
        if (v > s1) {
          return d1;
        }
        return (dd * (v - s0)) / sd + d0;
      };
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
        return (dd * (v - s0)) / sd + d0;
      };
    },
    TRAN_DIFF_COLOR() {
      return INV_GRAY_0_1;
    },
    TRAN_CAT_PRESS() {
      return COLOR_CAT_PRESS;
    },
  },
  mutations: {
    TRAN_PRESS_USE_GRADIENT_SET(state, value) {
      state.pressureGradient = value;
    },
  },
};
