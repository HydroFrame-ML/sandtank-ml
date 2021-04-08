// import Vue from 'vue';
import Vuex from "vuex";

import wslink from "compare-sandtank-ai/src/store/wslink";
import candidates from "compare-sandtank-ai/src/store/candidates";
import comparisons from "compare-sandtank-ai/src/store/comparisons";
import conditions from "compare-sandtank-ai/src/store/conditions";

/* eslint-enable no-param-reassign */

function createStore() {
  return new Vuex.Store({
    modules: {
      wslink,
      candidates,
      comparisons,
      conditions
    }
  });
}

export default createStore;
