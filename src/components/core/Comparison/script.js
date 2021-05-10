import { mapGetters, mapMutations } from 'vuex';
import ComputedImage from 'sandtank-ml/src/components/widgets/ComputedImage';
import Selector from 'sandtank-ml/src/components/core/Selector';
import Histogram from 'sandtank-ml/src/components/widgets/Histogram';
import PieChart from 'sandtank-ml/src/components/widgets/PieChart';
import LearningChart from 'sandtank-ml/src/components/widgets/LearningChart';

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
  components: { ComputedImage, Selector, Histogram, PieChart, LearningChart },
  computed: {
    ...mapGetters({
      toNormPress: 'TRAN_PRESS_TO_NORM',
      deltaToColor: 'TRAN_DIFF_COLOR',
      computedPressure: 'SIM_PRESSURE',
      normPressureToColor: 'TRAN_NORM_PRESSURE_TO_COLOR',
      aiTime: 'AI_RUN_TIMESTEP',
      aiLoading: 'AI_IS_RUNNING',
      simulationTime: 'SIM_RUN_TIMESTEP',
      permeabilityToColor: 'TRAN_PERMABILITY_AI',
      isPressure: 'TRAN_PRESS_USE_GRADIENT',
      fieldName: 'TRAN_FIELD_NAME',
      useGradientConfig: 'UI_USE_GRADIENT',
      useHistGlobalMax: 'UI_USE_HIST_GLOBAL_MAX',
      useTrainingLoss: 'UI_USE_TRAINING_LOSS',
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
      trainingLoss: 'UI_TRAINING_LOSS',
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
    chartData() {
      return this.trainingLoss
        ? decorate(this.model.learningStats.training)
        : decorate(this.model.learningStats.validation);
    },
  },
  methods: {
    ...mapMutations({
      setPressure: 'TRAN_PRESS_USE_GRADIENT_SET',
      setGlobalMax: 'UI_GLOBAL_MAX_SET',
      setTrainingLoss: 'UI_TRAINING_LOSS_SET',
    }),
  },
};

function decorate(data) {
  return {
    labels: [...Array(data.length).keys()],
    datasets: [{ data, backgroundColor: 'rgb(10, 10, 10)' }],
  };
}
