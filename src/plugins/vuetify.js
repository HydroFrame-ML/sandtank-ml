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
      parflow: 'mdi-water',
      run: 'mdi-run',
      results: 'mdi-arrow-right-bold',
      water: 'mdi-water',
      add: 'mdi-plus',
      trash: 'mdi-delete',
      ai: 'mdi-brain',
      // toggles
      toggle: 'mdi-orbit-variant',
      toggleGlobalMax: 'mdi-arrow-vertical-lock',
      toggleSkipInitial: 'mdi-blur-linear',

      // comparison icons
      closeComparison: 'mdi-close',
      showSelection: 'mdi-format-list-checks',
      showPrediction: 'mdi-auto-fix',
      showDiff: 'mdi-vector-difference',
      showLearnStats: 'mdi-school-outline',
      showHist: 'mdi-chart-histogram',
      showError: 'mdi-sigma',
      //
      diffContrast: 'mdi-contrast-box',
    },
  },
});
