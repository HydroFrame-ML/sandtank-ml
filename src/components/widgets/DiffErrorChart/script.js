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
    chartData() {
      return {
        labels: ['Errors', 'Accuracies'],
        datasets: [
          {
            data: this.data,
            backgroundColor: ['rgb(20,20,20)', 'rgb(200,200,200)'],
          },
        ],
      };
    },
    chartOptions() {
      return {};
    },
  },
};
