import { Bar } from 'vue-chartjs';

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
  name: 'LearningChart',
  extends: Bar,
  props: ['learningData', 'size', 'scale'],
  mounted() {
    // Set chart canvas size
    const [width, height] = this.size;
    this.$el.firstElementChild.width = width * this.scale - 8 * 2; // Adjust for vuetify pa-2
    this.$el.firstElementChild.height = height * this.scale - 8 * 2;

    const { learning, validation } = this.learningData;
    this.chartData = {
      labels: [...Array(learning.length).keys()],
      datasets: [
        {
          data: learning,
          backgroundColor: 'rgb(20,80,20)',
        },
        {
          data: validation,
          backgroundColor: 'rgb(20,20,80)',
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
