import 'chartjs-chart-box-and-violin-plot';
import { generateChart, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;
const BoxPlot = generateChart('boxplot', 'boxplot');

const options = {
  legend: { display: false },
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
  //tooltips: {
  //  // Disable the on-canvas tooltip
  //  enabled: false,

  //  custom: function(tooltipModel) {
  //    // Tooltip Element
  //    var tooltipEl = document.getElementById('chartjs-tooltip');

  //    // Create element on first render
  //    if (!tooltipEl) {
  //      tooltipEl = document.createElement('div');
  //      tooltipEl.id = 'chartjs-tooltip';
  //      tooltipEl.innerHTML = '<table></table>';
  //      document.body.appendChild(tooltipEl);
  //    }

  //    // Hide if no tooltip
  //    if (tooltipModel.opacity === 0) {
  //      tooltipEl.style.opacity = 0;
  //      return;
  //    }

  //    // Set caret Position
  //    tooltipEl.classList.remove('above', 'below', 'no-transform');
  //    if (tooltipModel.yAlign) {
  //      tooltipEl.classList.add(tooltipModel.yAlign);
  //    } else {
  //      tooltipEl.classList.add('no-transform');
  //    }

  //    function getBody(bodyItem) {
  //      return bodyItem.lines;
  //    }

  //    // Set Text
  //    if (tooltipModel.body) {
  //      var titleLines = tooltipModel.title || [];
  //      var bodyLines = tooltipModel.body.map(getBody);

  //      var innerHtml = '<thead>';

  //      titleLines.forEach(function(title) {
  //        innerHtml += '<tr><th>' + title + '</th></tr>';
  //      });
  //      innerHtml += '</thead><tbody>';

  //      bodyLines.forEach(function(body, i) {
  //        var colors = tooltipModel.labelColors[i];
  //        var style = 'background:' + colors.backgroundColor;
  //        style += '; border-color:' + colors.borderColor;
  //        style += '; border-width: 2px';
  //        var span = '<span style="' + style + '"></span>';
  //        innerHtml += '<tr><td>' + span + body + '</td></tr>';
  //      });
  //      innerHtml += '</tbody>';

  //      var tableRoot = tooltipEl.querySelector('table');
  //      tableRoot.innerHTML = innerHtml;
  //    }

  //    // `this` will be the overall tooltip
  //    var position = this._chart.canvas.getBoundingClientRect();

  //    // Display, position, and set styles for font
  //    tooltipEl.style.opacity = 1;
  //    tooltipEl.style.position = 'absolute';
  //    tooltipEl.style.left =
  //      position.left + window.pageXOffset + tooltipModel.caretX + 'px';
  //    tooltipEl.style.top =
  //      position.top + window.pageYOffset + tooltipModel.caretY + 'px';
  //    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
  //    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
  //    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
  //    tooltipEl.style.padding =
  //      tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
  //    tooltipEl.style.pointerEvents = 'none';
  //  },
  //},
};

export default {
  name: 'EpochChart',
  extends: BoxPlot,
  mixins: [reactiveProp],
  props: ['size', 'scale'],
  mounted() {
    // Set chart canvas size
    const [width, height] = this.size;
    this.$el.firstElementChild.width = width * this.scale - 8 * 2; // Adjust for vuetify pa-2
    this.$el.firstElementChild.height = height * this.scale - 8 * 2;
    this.renderChart(this.chartData, options);
  },
};
