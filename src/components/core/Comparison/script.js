import { mapGetters, mapMutations } from 'vuex';
import ImageWithOverlay from 'sandtank-ml/src/components/widgets/ImageWithOverlay';
import Selector from 'sandtank-ml/src/components/core/Selector';
import EpochChart from 'sandtank-ml/src/components/widgets/EpochChart';
import DiffErrorChart from 'sandtank-ml/src/components/widgets/DiffErrorChart';
import DiffErrorHistogram from 'sandtank-ml/src/components/widgets/DiffErrorHistogram';

import { simplifyNumber } from 'sandtank-ml/src/utils/stats';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'Comparison',
  data: () => ({
    scale: 3,
  }),
  props: {
    model: {
      type: Object,
      default: null,
    },
  },
  components: {
    DiffErrorChart,
    DiffErrorHistogram,
    ImageWithOverlay,
    Selector,
    EpochChart,
  },
  computed: {
    ...mapGetters({
      toNormPress: 'TRAN_PRESS_TO_NORM',
      deltaToColor: 'TRAN_DIFF_COLOR',
      computedPressure: 'SIM_PRESSURE',
      normPressureToColor: 'TRAN_NORM_PRESSURE_TO_COLOR',
      aiTime: 'AI_RUN_TIMESTEP',
      aiLoading: 'AI_IS_RUNNING',
      aiModelCount: 'AI_MODEL_COUNT',
      simulationTime: 'SIM_RUN_TIMESTEP',
      permeabilityToColor: 'TRAN_PERMABILITY_AI',
      isPressure: 'TRAN_PRESS_USE_GRADIENT',
      fieldName: 'TRAN_FIELD_NAME',
      useGradientConfig: 'UI_USE_GRADIENT',
      useHistGlobalMax: 'UI_USE_HIST_GLOBAL_MAX',
      useSkipInitial: 'UI_USE_SKIP_INITIAL',
      useDiffLabels: 'UI_USE_DIFF_LABELS',
      useWaterLabels: 'UI_USE_WATER_LABELS',
      //
      showSelection: 'AI_SHOW_SELECTION',
      showPrediction: 'AI_SHOW_PREDICTION',
      showDiff: 'AI_SHOW_DIFF',
      showHist: 'AI_SHOW_HIST',
      showError: 'AI_SHOW_ERROR',
      showStats: 'AI_SHOW_STATS',
      needRunSimulation: 'SIM_RUN_NEEDED',
      needRunAI: 'AI_RUN_NEEDED',
      globalMax: 'UI_GLOBAL_MAX',
      skipInitial: 'UI_SKIP_INITIAL',
    }),
    pressure() {
      return this.model.values;
    },
    currentColorConvert() {
      if (this.simulationTime == -1) {
        return this.permeabilityToColor;
      }
      return this.normPressureToColor;
    },
    showGlobalMaxButton() {
      return (
        this.aiModelCount > 1 && this.isPressure && this.useHistGlobalMax.show
      );
    },
    epochData() {
      if (!this.model.learningStats) {
        return null;
      }

      let validation = Object.values(
        this.model.learningStats.validationByEpoch,
      );
      let training = Object.values(this.model.learningStats.trainingByEpoch);
      let labels = [...Array(validation.length).keys()].map((e) => `E${e}`);

      if (this.skipInitial) {
        labels = labels.slice(1);
        training = training.slice(1);
        validation = validation.slice(1);
      }

      return {
        labels,
        datasets: [
          {
            data: validation,
            borderColor: 'black',
          },
          {
            data: training,
            borderColor: '#cf3f3f',
            backgroundColor: '#cf3f3f',
          },
        ],
      };
    },
  },
  methods: {
    ...mapMutations({
      setPressure: 'TRAN_PRESS_USE_GRADIENT_SET',
      setGlobalMax: 'UI_GLOBAL_MAX_SET',
      setSkipInitial: 'UI_SKIP_INITIAL_SET',
    }),
    simplifyNumber,
    decorate(data) {
      return {
        labels: [...Array(data.length).keys()],
        datasets: [
          {
            data: data,
            backgroundColor: 'rgb(10, 10, 10)',
          },
        ],
      };
    },
  },
};
