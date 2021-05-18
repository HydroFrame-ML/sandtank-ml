import Bar from 'sandtank-ml/src/components/charts/Bar';
import { histogram, range } from 'sandtank-ml/src/utils/stats';

export default {
  name: 'DiffErrorChart',
  components: { Bar },
  props: {
    data: {},
    labels: {},
    xMax: {},
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
      const xMax = Number(this.xMax);
      const hist = histogram(this.data);
      const binCount = 100;
      const labels = range(1 / binCount, xMax + 1 / binCount, xMax / binCount);
      const bins = Array(labels.length).fill(0);
      for (let i = 0; i < this.data.length; i++) {
        const value = this.data[i];
        const index = labels.indexOf(hist.fun(value));
        bins[index] = bins[index] + 1;
      }

      return {
        data: {
          labels: labels.map((d) => d.toFixed(2)),
          datasets: [
            {
              data: bins,
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
  layout: {
    padding: {
      left: 8,
      right: 8,
      top: 10,
    },
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 2,
          callback: function roundToQuarters(value) {
            if (value > 1) return 1;
            return value;
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
