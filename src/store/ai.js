import ModelSelector from 'sandtank-ml/src/utils/ModelSelector';

const RESET_RUN = { left: null, right: null, time: null };
let CALLBACK = null;

export default {
  state: {
    config: {},
    models: [],
    left: 0,
    right: 0,
    modulesVisibility: ['selection', 'prediction', 'diff', 'stats'],
    lastRun: RESET_RUN,
  },
  getters: {
    AI_CONFIG(state) {
      return state.config;
    },
    AI_MODELS(state) {
      return state.models;
    },
    AI_MODULE_VISIBILITY(state) {
      return state.modulesVisibility;
    },
    AI_SHOW_SELECTION(state) {
      return state.modulesVisibility.includes('selection');
    },
    AI_SHOW_PREDICTION(state) {
      return state.modulesVisibility.includes('prediction');
    },
    AI_SHOW_DIFF(state) {
      return state.modulesVisibility.includes('diff');
    },
    AI_SHOW_STATS(state) {
      return state.modulesVisibility.includes('stats');
    },
    AI_RUN_NEEDED(state, getters) {
      return (
        getters.SIM_LEFT !== state.lastRun.left ||
        getters.SIM_RIGHT !== state.lastRun.right ||
        getters.SIM_RUN_TIMESTEP !== state.lastRun.time
      );
    },
    AI_RUN_TIMESTEP(state) {
      return state.lastRun.time || 0;
    },
  },
  mutations: {
    AI_CONFIG_SET(state, value) {
      state.config = value;
    },
    AI_LEFT_SET(state, value) {
      state.left = value;
    },
    AI_RIGHT_SET(state, value) {
      state.right = value;
    },
    AI_MODULE_VISIBILITY_SET(state, value) {
      state.modulesVisibility = value;
    },
    AI_INVALIDATE_RUN(state) {
      state.lastRun = RESET_RUN;
    },
  },
  actions: {
    async AI_FETCH_CONFIG({ commit, dispatch }, name) {
      const newConfig = await dispatch('WS_FETCH_CONFIG', name);
      commit('AI_CONFIG_SET', newConfig);
    },
    AI_ADD_ENTRY({ commit, state }) {
      if (!CALLBACK) {
        CALLBACK = () => commit('AI_INVALIDATE_RUN');
      }
      // FIXME should provide the definition at build time
      const modelSelector = new ModelSelector(state.config);
      modelSelector.onChange = CALLBACK;
      state.models = state.models.concat({
        modelSelector,
      });
      state.lastRun = RESET_RUN;
    },
    AI_REMOVE_ENTRY({ state }, index) {
      state.models.splice(index, 1);
    },
    async AI_RUN({ state, getters, commit, dispatch }) {
      const left = getters.SIM_LEFT;
      const right = getters.SIM_RIGHT;
      const time = getters.SIM_RUN_TIMESTEP;
      state.lastRun = { left, right, time };
      commit('AI_LEFT_SET', left);
      commit('AI_RIGHT_SET', right);
      const responses = await Promise.all(
        state.models.map(({ modelSelector }) =>
          dispatch('WS_PREDICT', {
            uri: modelSelector.getURI(),
            left,
            right,
            time,
          }),
        ),
      );
      const newModels = [];
      for (let i = 0; i < responses.length; i++) {
        newModels.push({ ...state.models[i], ...responses[i] });
      }
      state.models = newModels;
    },
  },
};
