import { Bar, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;
const options = {
  legend: { display: false },
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 2,
          callback: function roundToQuarters(value) {
            return Math.floor(value * 4) / 4;
          },
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          maxTicksLimit: 4,
          callback: function hideZero(x) {
            return Math.round(x) || '';
          },
        },
      },
    ],
  },
};

export default {
  name: 'Histogram',
  extends: Bar,
  mixins: [reactiveProp],
  props: ['max', 'size', 'scale'],
  mounted() {
    // Set chart canvas size
    const [width, height] = this.size;
    this.$el.firstElementChild.width = width * this.scale - 8 * 2; // Adjust for vuetify pa-2
    this.$el.firstElementChild.height = height * this.scale - 8 * 2;
    this.render();
  },
  watch: {
    max() {
      this.render();
    },
  },
  methods: {
    render() {
      if (this.max === -1) {
        delete options.scales.yAxes[0].ticks.suggestedMax;
      } else {
        options.scales.yAxes[0].ticks.suggestedMax = this.max;
      }

      this.renderChart(this.chartData, options);
    },
  },
};
