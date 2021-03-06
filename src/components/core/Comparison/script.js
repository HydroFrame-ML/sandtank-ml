import { mapGetters, mapMutations } from 'vuex';
import ImageWithOverlay from 'sandtank-ml/src/components/widgets/ImageWithOverlay';
import Selector from 'sandtank-ml/src/components/core/Selector';
import EpochChart from 'sandtank-ml/src/components/widgets/EpochChart';
import DiffErrorChart from 'sandtank-ml/src/components/widgets/DiffErrorChart';
import DiffErrorHistogram from 'sandtank-ml/src/components/widgets/DiffErrorHistogram';
import WalkthroughStep from 'sandtank-ml/src/components/widgets/WalkthroughStep';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'Comparison',
  data: () => ({
    scale: 3,
    toggleSteps: ['compareAIWater', 'noticeAIDiff', 'noticeErrorDist'],
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
    WalkthroughStep,
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
      isPressure: 'TRAN_USE_PRESSURE',
      fieldName: 'TRAN_FIELD_NAME',
      diffScale: 'TRAN_DIFF_SCALE',
      usePressureConfig: 'UI_USE_PRESSURE',
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
      return this.aiModelCount > 1 && this.isPressure;
    },
  },
  methods: {
    ...mapMutations({
      setPressure: 'TRAN_USE_PRESSURE_SET',
      setSkipInitial: 'UI_SKIP_INITIAL_SET',
    }),
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
