import { mapGetters, mapMutations } from 'vuex';
import BoxPlot from 'sandtank-ml/src/components/charts/BoxPlot';
import Bar from 'sandtank-ml/src/components/charts/Bar';

export default {
  name: 'EpochChart',
  components: { BoxPlot, Bar },
  data: () => ({
    epochIndex: null,
  }),
  props: ['data', 'size', 'scale'],
  computed: {
    ...mapGetters({
      skipInitial: 'UI_SKIP_INITIAL',
      useSkipInitial: 'UI_USE_SKIP_INITIAL',
      aiLoading: 'AI_IS_RUNNING',
      needRunAI: 'AI_RUN_NEEDED',
    }),

    chart() {
      let validation = Object.values(this.data.validationByEpoch);
      let training = Object.values(this.data.trainingByEpoch);
      let labels = [...Array(validation.length).keys()].map((e) => `E${e}`);

      if (this.skipInitial && labels.length > 1) {
        labels = labels.slice(1);
        training = training.slice(1);
        validation = validation.slice(1);
      }

      return {
        data: {
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
        },
        options: { ...options, onClick: this.setEpochIndex },
      };
    },
    epochBySteps() {
      // Pad both arrays so validation occurs after training
      const idx = this.skipInitial ? this.epochIndex + 1 : this.epochIndex;
      const training = this.data.trainingByEpoch[idx];
      const validation = this.data.validationByEpoch[idx];
      const paddedTraining = training.concat(Array(validation.length).fill(0));
      const paddedValidation = Array(training.length)
        .fill(0)
        .concat(validation);

      const labels = [...Array(paddedTraining.length).keys()];
      return {
        data: {
          labels,
          datasets: [
            {
              label: 'Training',
              data: paddedTraining,
              borderColor: 'black',
              backgroundColor: 'black',
            },
            {
              label: 'Validation',
              data: paddedValidation,
              borderColor: '#cf3f3f',
              backgroundColor: '#cf3f3f',
            },
          ],
        },
        options: epochByStepOptions,
      };
    },
    showSkipInitialButton() {
      if (this.data) {
        const v = this.data.validationByEpoch;
        const epochCount = Object.keys(v).length;
        return epochCount > 1 && this.useSkipInitial.show;
      }
      return false;
    },
  },
  methods: {
    ...mapMutations({
      setSkipInitial: 'UI_SKIP_INITIAL_SET',
    }),
    setEpochIndex(_e, charts) {
      try {
        this.epochIndex = charts[0]._index;
      } catch {
        this.resetEpochIndex();
      }
    },
    resetEpochIndex() {
      this.epochIndex = null;
    },
  },
};

var options = {
  legend: { display: false },
  layout: {
    padding: {
      top: 16,
      bottom: 0,
      left: 8,
      right: 16,
    },
  },
  animation: false,
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 4,
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          maxTicksLimit: 4,
        },
      },
    ],
  },
  tooltipDecimals: 3,
};

var epochByStepOptions = {
  ...options,
  legend: { display: true },
  layout: {},
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 4,
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          maxTicksLimit: 4,
        },
      },
    ],
  },
};
