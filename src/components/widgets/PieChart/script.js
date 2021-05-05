import { Pie, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;
const options = { legend: { display: false } };

export default {
  name: 'PieChart',
  extends: Pie,
  mixins: [reactiveProp],
  props: ['size', 'scale'],
  mounted() {
    // Set chart canvas size
    const [width, height] = this.size;
    this.$el.firstElementChild.width = width * this.scale;
    this.$el.firstElementChild.height = height * this.scale;

    this.renderChart(this.chartData, options);
  },
};
