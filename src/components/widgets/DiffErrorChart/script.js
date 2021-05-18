import PieChart from 'sandtank-ml/src/components/charts/PieChart';

export default {
  name: 'DiffErrorChart',
  components: { PieChart },
  props: {
    data: {},
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
      return {
        data: {
          labels: ['Errors', 'Accuracies'],
          datasets: [
            {
              data: this.data,
              backgroundColor: ['rgb(20,20,20)', 'rgb(200,200,200)'],
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
  tooltips: {
    callbacks: {
      label: function({ index, datasetIndex }, { labels, datasets }) {
        const sum = datasets[datasetIndex].data.reduce((acc, val) => acc + val);
        const numerator = datasets[datasetIndex].data[index];
        return `${labels[index]}: ${numerator / sum}%`;
      },
    },
  },
};
