import { Pie } from 'vue-chartjs';

export default {
  name: 'PieChart',
  extends: Pie,
  props: ['chart', 'size', 'scale'],
  mounted() {
    // Set chart canvas size
    const [width, height] = this.size;
    this.$el.firstElementChild.width = width * this.scale;
    this.$el.firstElementChild.height = height * this.scale;

    this.renderChart(this.chart.data, this.chart.options);
  },
};
