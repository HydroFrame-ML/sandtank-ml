import { Bar } from 'vue-chartjs';
import { histogram, range } from 'sandtank-ml/src/utils/histogram';

const options = {
  legend: { display: false },
  scales: {
    xAxes: [
      {
        gridLines: {
          offsetGridLines: false,
        },
        ticks: {
          callback: function(value) {
            return String(value).substr(1, 3); //truncate
          },
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          callback: Math.round,
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
    var hist = histogram(this.histData, { pretty: true });
    const binCount = 100;
    var labels = range(1 / binCount, 1 - 1 / binCount, 1 / binCount);
    var bins = Array(labels.length).fill(0);
    for (var i = 0; i < this.histData.length; i++) {
      var value = this.histData[i];
      var index = labels.indexOf(hist.fun(value));
      bins[index] = bins[index] + 1;
    }

    // Configure dataset
    var data = {
      labels: labels,
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
