import { Bar, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

const options = {
  legend: { display: false },
  mixins: [reactiveProp],
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 2,
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

export default {
  name: 'LearningChart',
  extends: Bar,
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
