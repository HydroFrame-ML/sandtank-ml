import { Bar } from 'vue-chartjs';
import { histogram, range } from 'sandtank-ml/src/utils/histogram';

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

export default {
  name: 'Histogram',
  extends: Bar,
  props: ['histData', 'size', 'scale'],
  mounted() {
    // Set chart canvas size
    const [width, height] = this.size;
    this.$el.firstElementChild.width = width * this.scale;
    this.$el.firstElementChild.height = height * this.scale;

    // Fill histogram bins
    const binCount = 100;
    const hist = histogram(this.histData, { pretty: true });
    const labels = range(1 / binCount, 1 + 1 / binCount, 1 / binCount);
    const bins = Array(labels.length).fill(0);
    for (let i = 0; i < this.histData.length; i++) {
      const value = this.histData[i];
      const index = labels.indexOf(hist.fun(value));
      bins[index] = bins[index] + 1;
    }

    // Configure dataset
    const data = {
      labels,
      datasets: [
        {
          data: bins,
          label: false,
          backgroundColor: 'rgb(20,20,20)',
          barPercentage: 1.0,
          categoryPercentage: 1.0,
        },
      ],
    };

    this.renderChart(data, options);
  },
};
