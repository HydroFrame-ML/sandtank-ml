import ModelSelector from 'sandtank-ml/src/utils/ModelSelector';
import stats from 'sandtank-ml/src/utils/stats';

const RESET_RUN = { left: null, right: null, time: null };
let CALLBACK = null;

export default {
  state: {
    models: [],
    left: 0,
    right: 0,
    modulesVisibility: [
      'selection',
      'prediction',
      'diff',
      'hist',
      'error',
      'stats',
    ],
    lastRun: RESET_RUN,
    isRunning: false,
  },
  getters: {
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
    AI_SHOW_HIST(state) {
      return state.modulesVisibility.includes('hist');
    },
    AI_SHOW_ERROR(state) {
      return state.modulesVisibility.includes('error');
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
    AI_IS_RUNNING(state) {
      return state.isRunning;
    },
  },
  mutations: {
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
    AI_IS_RUNNING_SET(state, value) {
      state.isRunning = value;
    },
  },
  actions: {
    AI_ADD_ENTRY({ commit, state, getters }, modelSelector) {
      if (!CALLBACK) {
        CALLBACK = () => commit('AI_INVALIDATE_RUN');
      }
      if (!modelSelector) {
        // FIXME should provide the definition at build time
        modelSelector = new ModelSelector(getters.UI_CONFIG);
      }
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
      commit('AI_IS_RUNNING_SET', true);
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
        const newModel = { ...state.models[i], ...responses[i] };
        if (!newModel.learningStats) {
          dispatch('AI_ADD_LEARNING_STATS', {
            uri: newModel.modelSelector.getURI(),
          });
        }
        newModels.push(newModel);
      }
      state.models = newModels;
      dispatch('AI_ADD_STATS');
      commit('AI_IS_RUNNING_SET', false);
    },
    AI_ADD_STATS({ state, getters }) {
      const ref = getters.SIM_PRESSURE.map(getters.TRAN_PRESS_TO_NORM);
      stats.decorate(state.models, ref);
    },
    async AI_ADD_LEARNING_STATS({ state, dispatch }, { uri }) {
      const learning = await dispatch('WS_STATS', { uri });
      for (const model of state.models) {
        if (uri === model.uri) {
          model.learningStats = learning;
        }
      }
    },
  },
};
