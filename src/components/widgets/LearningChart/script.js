import { Line } from 'vue-chartjs';

const options = {};

export default {
  name: 'LearningChart',
  extends: Line,
  props: ['learningData', 'size', 'scale'],
  mounted() {
    // Set chart canvas size
    const [width, height] = this.size;
    this.$el.firstElementChild.width = width * this.scale - 8 * 2; // Adjust for vuetify pa-2
    this.$el.firstElementChild.height = height * this.scale - 8 * 2;

    const { validation, training } = this.learningData;
    this.chartData = {
      datasets: [
        {
          data: validation,
          backgroundColor: 'rgb(20,20,20)',
        },
        {
          data: training,
          backgroundColor: 'rgb(20,20,20)',
        },
      ],
    };

    this.render();
  },
  methods: {
    render() {
      this.renderChart(this.chartData, options);
    },
  },
};
