import 'chartjs-chart-box-and-violin-plot';
import { generateChart } from 'vue-chartjs';

const BoxPlot = generateChart('boxplot', 'boxplot');

export default {
  name: 'BaxPlot',
  extends: BoxPlot,
  props: ['chart', 'size', 'scale'],
  mounted() {
    // Set chart canvas size
    const [width, height] = this.size;
    this.$el.firstElementChild.width = width * this.scale;
    this.$el.firstElementChild.height = height * this.scale;
    this.renderChart(this.chart.data, this.chart.options);
  },
  watch: {
    chart() {
      this.renderChart(this.chart.data, this.chart.options);
    },
  },
};
