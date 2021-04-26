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
      compare: 'mdi-scale-balance',
      run: 'mdi-run',
      results: 'mdi-arrow-right-bold',
      water: 'mdi-water',
      add: 'mdi-plus',
      trash: 'mdi-delete',
      // comparison icons
      closeComparison: 'mdi-close',
      showSelection: 'mdi-format-list-checks',
      showPrediction: 'mdi-auto-fix',
      showDiff: 'mdi-vector-difference',
      showLearnStats: 'mdi-school-outline',
    },
  },
});
