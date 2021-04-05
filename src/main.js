// Import polyfills
import "core-js/modules/es7.promise.finally";
import "core-js/modules/web.immediate";

import Vue from "vue";
import Vuex from "vuex";

import App from "compare-sandtank-ai/src/components/core/App";
import vuetify from "compare-sandtank-ai/src/plugins/vuetify.js";
import store from "compare-sandtank-ai/src/store";

/* eslint-disable-next-line import/extensions */
import "typeface-roboto";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuex);

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount("#app");
