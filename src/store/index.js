// import Vue from 'vue';
import Vuex from 'vuex';

import ai from './ai';
import wslink from './wslink';
import simulation from './simulation';
import transform from './transform';
import ui from './ui';
import walkthrough from './walkthrough';

/* eslint-enable no-param-reassign */

function createStore() {
  return new Vuex.Store({
    modules: {
      ai,
      wslink,
      simulation,
      transform,
      ui,
      walkthrough,
    },
  });
}

export default createStore;
