import 'chartjs-chart-box-and-violin-plot';
import { generateChart, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;
const BoxPlot = generateChart('boxplot', 'boxplot');

const options = {
  legend: { display: false },
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
};

export default {
  name: 'EpochChart',
  extends: BoxPlot,
  mixins: [reactiveProp],
  props: ['size', 'scale'],
  mounted() {
    // Set chart canvas size
    const [width, height] = this.size;
    this.$el.firstElementChild.width = width * this.scale - 8 * 2; // Adjust for vuetify pa-2
    this.$el.firstElementChild.height = height * this.scale - 8 * 2;
    this.renderChart(this.chartData, options);
  },
};
