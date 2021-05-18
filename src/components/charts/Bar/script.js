import { Bar } from 'vue-chartjs';

export default {
  name: 'Bar',
  extends: Bar,
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
