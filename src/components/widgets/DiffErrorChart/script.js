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
      // Chart two percentages that add to 100%
      const [errors, accuracies] = this.data;
      const asPercentages = [errors, accuracies].map(
        (d) => (d / (errors + accuracies)) * 100,
      );
      const bigger = Math.floor(Math.max(...asPercentages));
      const smaller = 100 - bigger;
      const data = errors > accuracies ? [bigger, smaller] : [smaller, bigger];

      return {
        data: {
          labels: ['Errors', 'Accuracies'],
          datasets: [
            {
              data,
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
      label: displayPercentages,
    },
  },
};

function displayPercentages({ index, datasetIndex }, { labels, datasets }) {
  return `${labels[index]}: ${datasets[datasetIndex].data[index]}%`;
}
