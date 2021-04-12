import vtkColorTransferFunction from "vtk.js/Sources/Rendering/Core/ColorTransferFunction";
import vtkColorMaps from "vtk.js/Sources/Rendering/Core/ColorTransferFunction/ColorMaps";

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

// Shared variables
// let CUT_OFF = 20;
// let BRIGTNESS = 3;

// Categorical colors
const CAT6_COLORS = [
  [255, 255, 255],
  [255 * 0.760784, 255 * 0.8, 255 * 0.721569],
  [255 * 0.529412, 255 * 0.509804, 255 * 0.447059],
  [255 * 0.858824, 255 * 0.623529, 255 * 0.352941],
  [255 * 1, 255 * 0.945098, 255 * 0.580392],
  [255 * 0.666667, 255 * 0.901961, 255 * 0.670588],
  [255 * 0.494118, 255 * 0.741176, 255 * 0.768627]
];

// Common functions
function toCategorical(colors, cuts = []) {
  return v => {
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

export function toColorMap(min, max) {
  const color = [0, 0, 0, 0];
  const lookupTable = vtkColorTransferFunction.newInstance();
  lookupTable.applyColorMap(
    vtkColorMaps.getPresetByName("erdc_rainbow_bright")
  );
  lookupTable.setMappingRange(min, max);
  lookupTable.updateRange();
  return v => {
    lookupTable.getColor(v, color);
    color[0] *= 255;
    color[1] *= 255;
    color[2] *= 255;
    return color;
  };
}

function toGrayScale(min, max) {
  const clampValue = new Uint8ClampedArray(1);
  const delta = max - min;
  return v => {
    clampValue[0] = (255 * (v - min)) / delta;
    return clampValue[0];
  };
}

export function rangeMonitor(fn) {
  let min = Number.MAX_VALUE;
  let max = -Number.MAX_VALUE;
  return v => {
    let change = false;
    if (v < min) {
      min = v;
      change = true;
    }
    if (v > max) {
      max = v;
      change = true;
    }
    if (change) {
      console.log(`Range: [${min}, ${max}]`);
    }

    return fn(v);
  };
}

// const COLOR = new Uint8ClampedArray(3);
// return (v) => {
//   COLOR.fill(0);
//   const idx = v > 0 ? 2 : 0;
//   let value = (Math.abs(v) * 255) / 100;
//   if (value > 255) {
//     value = 255;
//   }
//   if (value < 0) {
//     value = 0;
//   }
//   if (value < CUT_OFF) {
//     return [255, 255, 255];
//   }
//   COLOR[idx] = value * BRIGTNESS;
//   return COLOR;
// };
// },

// Generated
const COLOR_CAT_PRESS = toCategorical(CAT6_COLORS, [
  -0.8,
  -0.25,
  0,
  0.25,
  0.5,
  0.75
]);
const GRAY_0_1 = toGrayScale(0, 1);
const GRAY_N1_1 = toGrayScale(-1, 1);
const GRAY_N50_50 = toGrayScale(-50, 50);
const SAME = v => v;
const CONVERT_SAME = () => SAME;
const COLOR_OFF = () => false;
const COLOR_ON = () => true;

const DEFAULT_HANDLER = {
  convert: CONVERT_SAME,
  hasRGB: COLOR_OFF
};

const DEFAULT = {
  inputs: DEFAULT_HANDLER,
  outputs: DEFAULT_HANDLER
};

const ML_TRANSFORMS = {
  RegressionPressureEngine: {
    inputs: {
      convert: toCategorical([GRAY_N1_1, COLOR_CAT_PRESS], [1]),
      hasRGB: toCategorical([false, true], [1])
    },
    outputs: {
      convert: toCategorical([COLOR_CAT_PRESS]),
      hasRGB: COLOR_ON
    },
    xai: {
      // convert: toCategorical([rangeMonitor(GRAY_0_1)]),
      hasRGB: COLOR_ON
    }
  },
  LabelSaturationEngine: {
    inputs: {
      convert: toCategorical([GRAY_0_1]),
      hasRGB: COLOR_OFF
    },
    outputs: {
      convert: toCategorical([GRAY_N50_50]),
      hasRGB: COLOR_OFF
    },
    xai: {
      hasRGB: COLOR_ON
    }
  }
};

export default {
  state: {
    cutoff: 20,
    brightness: 3
  },
  getters: {
    TRAN_CUT_OFF(state) {
      return state.cutoff;
    },
    TRAN_BRIGHTNESS(state) {
      return state.brightness;
    },
    TRAN_ALL() {
      return ML_TRANSFORMS["RegressionPressureEngine"] || DEFAULT;
    },
    TRAN_INPUT_RGB(state, getters) {
      return getters.TRAN_ALL.inputs.hasRGB;
    },
    TRAN_INPUT_CONVERT(state, getters) {
      // const toColor = toColorMap(-1, 1);
      // return () => toColor;
      return getters.TRAN_ALL.inputs.convert;
    },
    TRAN_OUTPUT_RGB(state, getters) {
      return getters.TRAN_ALL.outputs.hasRGB;
    },
    TRAN_OUTPUT_CONVERT(state, getters) {
      return getters.TRAN_ALL.outputs.convert;
    }
  },
  mutations: {
    TRAN_CUT_OFF_SET(state, value) {
      state.cutoff = value;
      // CUT_OFF = value;
    },
    TRAN_BRIGHTNESS_SET(state, value) {
      state.brightness = value;
      // BRIGTNESS = value;
    }
  }
};
