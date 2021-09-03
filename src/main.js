// Import polyfills
import 'core-js/modules/es7.promise.finally';
import 'core-js/modules/web.immediate';

import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

import App from 'sandtank-ml/src/components/core/App';
import Sandtank from 'sandtank-ml/src/components/core/Sandtank';
import Glossary from 'sandtank-ml/src/components/core/Glossary';
import Welcome from 'sandtank-ml/src/components/core/Welcome';
import Resources from 'sandtank-ml/src/components/core/Resources';
import vuetify from 'sandtank-ml/src/plugins/vuetify.js';
import store from 'sandtank-ml/src/store';

/* eslint-disable-next-line import/extensions */
import 'typeface-roboto';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuex);
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Sandtank },
    { path: '/glossary', component: Glossary },
    { path: '/welcome', component: Welcome },
    { path: '/resources', component: Resources },
  ],
});

window.Vue = new Vue({
  vuetify,
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
