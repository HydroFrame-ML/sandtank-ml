import Bar from 'sandtank-ml/src/components/charts/Bar';

export default {
  name: 'DiffErrorChart',
  components: { Bar },
  props: {
    data: {},
    globalMax: {},
    scale: {
      type: Number,
      default: 10,
    },
    size: {
      type: Array,
      default: () => [10, 10],
    },
  },
  computed: {
    chart() {
      const labels = [...Array(this.data.length).keys()];
      const data = this.data.slice();

      // Whether to scale this histogram for comparison with others
      if (this.globalMax !== -1) {
        options.scales.yAxes[0].ticks.suggestedMax = this.globalMax;
      } else {
        while (!data[data.length - 1]) {
          data.pop();
          labels.pop();
        }
        delete options.scales.yAxes[0].ticks.suggestedMax;
      }

      return {
        data: {
          labels,
          datasets: [
            {
              data,
              label: false,
              backgroundColor: 'rgb(20,20,20)',
              barPercentage: 1.0,
              categoryPercentage: 1.0,
            },
          ],
        },
        options,
      };
    },
  },
};

var options = {
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
