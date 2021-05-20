import { mapGetters } from 'vuex';
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
        options: { ...options, onClick: this.onClickBox },
      };
    },
    epochBySteps() {
      let validation = this.data.validationByEpoch[this.epochIndex];
      let training = this.data.trainingByEpoch[this.epochIndex];

      let labels = [...Array(validation.length).keys()].map((e) => `s${e}`);

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
        options: { ...options, onClick: this.onClickBar },
      };
    },
  },
  methods: {
    onClickBox(_e, charts) {
      console.log('clickBox', { epochIndex: this.epochIndex });
      try {
        this.epochIndex = charts[0]._index;
      } catch {
        this.epochIndex = null;
      }
    },
    onClickBar() {
      console.log('clickBar', { epochIndex: this.epochIndex });
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
  events: ['click', 'mousemove', 'mouseout'],
};
