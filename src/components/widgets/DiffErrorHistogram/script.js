import Bar from 'sandtank-ml/src/components/charts/Bar';
import { Histogram, range } from 'sandtank-ml/src/utils/stats';

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
      const binCount = 100;
      const labels = range(1 / binCount, xMax + 1 / binCount, xMax / binCount);
      const hist = new Histogram(this.data, labels);

      return {
        data: {
          labels: formatLabels(labels),
          datasets: [
            {
              data: hist.calculateBins(),
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

function formatLabels(values) {
  // 3 decimal places, then remove trailing zeroes
  return values.map((d) => String(Number(d.toFixed(3))));
}
