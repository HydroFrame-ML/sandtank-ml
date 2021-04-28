import { hex2float } from 'vtk.js/Sources/Common/Core/Math';

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
const GRAY_n1_1 = toGrayScale(-1, 1);
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

// const NORM_PRESSURE_COLORS_BLUE = toCategorical(
//   [
//     [0, 0, 0], // cut-off: -inf
//     [255, 255, 255], // dry region: 0
//     [187, 222, 251], // water +
//     [144, 202, 249], // water ++
//     [100, 182, 246], // water +++
//     [66, 165, 245], // water ++++
//     [30, 136, 229], // water +++++
//     [25, 118, 210], // water ++++++
//     [21, 101, 192], // water +++++++
//     [13, 71, 161], // water +++++++
//   ],
//   [-0.8, -0.25, 0, 0.25, 0.5, 0.75],
// );

const NORM_PRESSURE_COLORS = toCategorical(
  [
    '#000000', // cut-off: -inf
    '#ffffff', // dry region: 0
    '#B39DDB', // water +
    '#9575CD', // water ++
    '#7E57C2', // water +++
    '#5E35B1', // water ++++
    '#512DA8', // water +++++
    '#4527A0', // water ++++++
    '#311B92', // water +++++++
  ].map(hexStrToUChar),
  [-0.8, -0.25, 0, 0.25, 0.5, 0.75],
);

const NORM_PRESSURE_COLOR = toCategorical(
  [
    [0, 0, 0], // cut-off: -inf
    [255, 255, 255], // dry region: 0
    [66, 165, 245], // water +
  ],
  [-0.8, -0.25],
);

function hexStrToUChar(str) {
  const result = [0, 0, 0];
  hex2float(str, result);
  result[0] = Math.round(255 * result[0]);
  result[1] = Math.round(255 * result[1]);
  result[2] = Math.round(255 * result[2]);
  return result;
}

const PERMEABILITY_COLORS = toCategorical(
  [
    '#000000',
    '#3E2723', // < -0.8
    '#5D4037', // < -0.6
    '#8D6E63', // < -0.4
    '#BCAAA4', // < -0.2
    '#FFB300', // < 0
    '#FF8F00', // < 0.2
    '#FFB300', // < 0.4
    '#FFD54F', // < 0.6
    '#FFECB3', // < 0.8
    '#FFFFFF',
  ].map(hexStrToUChar),
  [0.00001, 0.15, 0.3, 0.45, 0.6, 0.75, 0.8, 0.95],
);

export default {
  state: {
    srcRange: [-1, 1],
    dstRange: [-30, 50],
    pressureGradient: true,
    diffScale: 0.5,
  },
  getters: {
    TRAN_PRESS_USE_GRADIENT(state) {
      return state.pressureGradient;
    },
    TRAN_PERMABILITY() {
      return PERMEABILITY_COLORS;
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
    TRAN_DIFF_COLOR(state) {
      return toInvGrayScale(0, state.diffScale);
    },
    TRAN_DIFF_SCALE(state) {
      return state.diffScale;
    },
  },
  mutations: {
    TRAN_PRESS_USE_GRADIENT_SET(state, value) {
      state.pressureGradient = value;
    },
    TRAN_DIFF_SCALE_SET(state, value) {
      state.diffScale = value;
    },
  },
};
