import { mapGetters } from 'vuex';
import ComputedImage from 'sandtank-ml/src/components/widgets/ComputedImage';
import Selector from 'sandtank-ml/src/components/core/Selector';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'Comparison',
  props: {
    model: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    size: [102, 50],
  }),
  components: { ComputedImage, Selector },
  computed: {
    ...mapGetters({
      toNormPress: 'TRAN_PRESS_TO_NORM',
      deltaToColor: 'TRAN_DIFF_COLOR',
      computedPressure: 'SIM_PRESSURE',
      normPressureToColor: 'TRAN_NORM_PRESSURE_TO_COLOR',
      simulationTime: 'SIM_RUN_TIMESTEP',
      permeabilityToColor: 'TRAN_PERMABILITY_AI',
      //
      showSelection: 'AI_SHOW_SELECTION',
      showPrediction: 'AI_SHOW_PREDICTION',
      showDiff: 'AI_SHOW_DIFF',
      showStats: 'AI_SHOW_STATS',
    }),
    pressure() {
      return this.model.values;
    },
    delta() {
      const out = [];
      out.length = 102 * 50;
      const press = this.pressure;
      const ref = this.computedPressure;
      for (let j = 0; j < 50; j++) {
        for (let i = 0; i < 102; i++) {
          const dstIdx = i + 102 * j;
          const srcIdx = i - 1 + 100 * j;
          if (i == 0 || i == 101) {
            out[dstIdx] = 0;
          } else {
            out[dstIdx] = Math.abs(
              this.toNormPress(ref[srcIdx]) - press[dstIdx],
            );
          }
        }
      }
      return out;
    },
    currentColorConvert() {
      if (this.simulationTime == -1) {
        return this.permeabilityToColor;
      }
      return this.normPressureToColor;
    },
  },
};
