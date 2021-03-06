import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify, {
  // Config for components to keep during treeshaking
  // Default = all
});

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
    values: {
      logo: 'mdi-head-snowflake-outline',
      run: 'mdi-run',
      results: 'mdi-arrow-right-bold',
      add: 'mdi-plus',
      trash: 'mdi-delete',
      next: 'mdi-chevron-right',
      last: 'mdi-chevron-left',

      // toggles
      toggle: 'mdi-orbit-variant',
      toggleChartCompare: 'mdi-magnify',
      toggleSkipInitial: 'mdi-blur-linear',

      // comparison icons
      close: 'mdi-close',
      showSelection: 'mdi-format-list-checks',
      showPrediction: 'mdi-auto-fix',
      showDiff: 'mdi-vector-difference',
      showLearnStats: 'mdi-school-outline',
      showHist: 'mdi-chart-histogram',
      showError: 'mdi-sigma',
      showLegends: 'mdi-format-list-checkbox',
      //
      diffContrast: 'mdi-contrast-box',
    },
  },
});
