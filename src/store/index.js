// import Vue from 'vue';
import Vuex from 'vuex';

import wslink from 'sandtank-ml/src/store/wslink';
import simulation from 'sandtank-ml/src/store/simulation';
import transform from 'sandtank-ml/src/store/transform';

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
