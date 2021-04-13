// import Vue from 'vue';
import Vuex from 'vuex';

import wslink from 'compare-sandtank-ai/src/store/wslink';
import simulation from 'compare-sandtank-ai/src/store/simulation';
import transform from 'compare-sandtank-ai/src/store/transform';

/* eslint-enable no-param-reassign */

function createStore() {
  return new Vuex.Store({
    modules: {
      wslink,
      simulation,
      transform,
    },
  });
}

export default createStore;
