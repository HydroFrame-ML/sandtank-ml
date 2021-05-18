import BoxPlot from 'sandtank-ml/src/components/charts/BoxPlot';
import Bar from 'sandtank-ml/src/components/charts/Bar';

export default {
  name: 'EpochChart',
  components: { BoxPlot, Bar },
  data: () => ({
    epochIndex: null,
  }),
  props: ['data', 'size', 'scale'],
  computed: {
    chart() {
      let validation = Object.values(this.data.validationByEpoch);
      let training = Object.values(this.data.trainingByEpoch);
      let labels = [...Array(validation.length).keys()].map((e) => `E${e}`);

      if (this.skipInitial) {
        labels = labels.slice(1);
        training = training.slice(1);
        validation = validation.slice(1);
      }

      return {
        data: {
          labels,
          datasets: [
            {
              data: validation,
              borderColor: 'black',
            },
            {
              data: training,
              borderColor: '#cf3f3f',
              backgroundColor: '#cf3f3f',
            },
          ],
        },
        options,
      };
    },
  },
};

function onClick(e, charts) {
  try {
    this.epochIndex = charts[0]._index;
  } catch {
    this.epochIndex = null;
  }
}

var options = {
  legend: { display: false },
  layout: {
    padding: {
      top: 16,
      bottom: 0,
      left: 8,
      right: 16,
    },
  },
  animation: false,
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
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
  tooltipDecimals: 3,
  events: ['click', 'mousemove', 'mouseout'],
  onClick,
};
