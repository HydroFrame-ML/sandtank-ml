import { mapGetters, mapMutations } from 'vuex';
import ImageWithOverlay from 'sandtank-ml/src/components/widgets/ImageWithOverlay';
import ComputedImage from 'sandtank-ml/src/components/widgets/ComputedImage';
import Selector from 'sandtank-ml/src/components/core/Selector';
import Histogram from 'sandtank-ml/src/components/widgets/Histogram';
import PieChart from 'sandtank-ml/src/components/widgets/PieChart';
import LearningChart from 'sandtank-ml/src/components/widgets/LearningChart';
import EpochChart from 'sandtank-ml/src/components/widgets/EpochChart';

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
    ImageWithOverlay,
    ComputedImage,
    Selector,
    Histogram,
    PieChart,
    LearningChart,
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
      simulationTime: 'SIM_RUN_TIMESTEP',
      permeabilityToColor: 'TRAN_PERMABILITY_AI',
      isPressure: 'TRAN_PRESS_USE_GRADIENT',
      fieldName: 'TRAN_FIELD_NAME',
      useGradientConfig: 'UI_USE_GRADIENT',
      useHistGlobalMax: 'UI_USE_HIST_GLOBAL_MAX',
      useSkipInitial: 'UI_USE_SKIP_INITIAL',
      useDiffLabels: 'UI_USE_DIFF_LABELS',
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
    epochData() {
      if (!this.model.learningStats) {
        return {};
      }
      //      let validationMean = this.model.learningStats.validationByEpoch.map(
      //        (d) => d.mean,
      //      );
      let trainingMean = this.model.learningStats.trainingByEpoch.map(
        (d) => d.mean,
      );
      let validationByEpoch = this.model.learningStats.validationByEpoch;
      let trainingByEpoch = this.model.learningStats.trainingByEpoch;
      let labels = [...Array(trainingMean.length).keys()];

      // Hide outlier, first training round
      if (this.skipInitial) {
        //validationMean = validationMean.slice(1);
        trainingMean = trainingMean.slice(1);
        validationByEpoch = validationByEpoch.slice(1);
        trainingByEpoch = trainingByEpoch.slice(1);
        labels = labels.slice(1);
      }

      return {
        labels: labels.map((n) => `e${n}`),
        datasets: [
          // lineDataset(trainingMean),
          // lineDataset(validationMean),
          // ...stackedDataset(trainingByEpoch, 'Training', 1),
          // ...stackedDataset(validationByEpoch, 'Validation', 0.4),
          {
            data: validationByEpoch.map((d) => [d.min, d.mean, d.max]),
          },
          {
            data: trainingByEpoch.map((d) => [d.min, d.mean, d.max]),
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

// function lineDataset(data) {
//   return {
//     label: 'mean',
//     data,
//     type: 'line',
//     fill: false,
//     lineTension: 0,
//   };
// }

//function stackedDataset(data, label, bar) {
//  const colors = {
//    min: 'rgba(100, 100, 200, .7)',
//    mean: 'rgba(100, 200, 100, .7)',
//    max: 'rgba(200, 100, 100, .7)',
//  };
//
//  //const sumAdjustedStats = (d) => {
//  //  const stats = {
//  //    min: d.min,
//  //    mean: d.mean - d.min,
//  //    max: d.max - (d.mean - d.min) - d.min,
//  //  };
//  //  console.log('og', { min: d.min, mean: d.mean, max: d.max });
//  //  return stats;
//  //};
//
//  return ['min', 'mean', 'max'].map((stat) => ({
//    label: label + ' ' + stat,
//    data: data.map((d) => d[stat]),
//    barPercentage: bar,
//    scales: {
//      yAxes: [{ stacked: true }],
//      xAxes: [{ stacked: true }],
//    },
//    backgroundColor: colors[stat],
//    stack: label,
//  }));
//}
