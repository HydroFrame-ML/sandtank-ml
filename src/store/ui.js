import ModelSelector from 'sandtank-ml/src/utils/ModelSelector';

export default {
  state: {
    config: {},
    globalMax: true,
    trainingLoss: true,
    skipInitial: true,
  },
  getters: {
    UI_CONFIG(state) {
      return state.config;
    },
    UI_MODULE_AVAILABLE(state, getters) {
      const { values } = getters.UI_MODULE_SELECTOR;
      return (name) => values.includes(name);
    },
    UI_TIME_RANGE(state) {
      const { ui } = state.config || {};
      return (ui && ui.time) || [0, 0];
    },
    UI_ADD_REMOVE_AI(state) {
      const { ui } = state.config || {};
      if (ui && ui.addRemoveAI) {
        return ui.addRemoveAI;
      }
      return {
        show: false,
        defaultModels: [],
      };
    },
    UI_USE_GRADIENT(state) {
      const { ui } = state.config || {};
      if (ui && ui.useGradient) {
        return ui.useGradient;
      }
      return {
        show: false,
        value: true,
      };
    },
    UI_USE_HIST_GLOBAL_MAX(state) {
      const { ui } = state.config || {};
      if (ui && ui.useHistGlobalMax) {
        return ui.useHistGlobalMax;
      }
      return {
        show: false,
        value: false,
      };
    },
    UI_USE_TRAINING_LOSS(state) {
      const { ui } = state.config || {};
      if (ui && ui.useTrainingLoss) {
        return ui.useTrainingLoss;
      }
      return {
        show: true,
        value: true,
      };
    },
    UI_USE_PERMEABILITY_LABELS(state) {
      const { ui } = state.config || {};
      if (ui && ui.usePermeabilityLabels) {
        return ui.usePermeabilityLabels;
      }
      return {
        show: false,
        values: {},
      };
    },
    UI_USE_DIFF_LABELS(state) {
      const { ui } = state.config || {};
      if (ui && ui.useDiffLabels) {
        return ui.useDiffLabels;
      }
      return {
        show: false,
        values: {},
      };
    },
    UI_USE_SKIP_INITIAL(state) {
      const { ui } = state.config || {};
      if (ui && ui.useSkipInitial) {
        return ui.useSkipInitial;
      }
      return {
        show: true,
        value: true,
      };
    },
    UI_MODULE_SELECTOR(state) {
      const { ui } = state.config || {};
      if (ui && ui.moduleSelector) {
        return ui.moduleSelector;
      }
      return {
        show: false,
        values: ['selection', 'prediction', 'diff', 'hist', 'error', 'stats'],
      };
    },
    UI_DIFF_SCALING(state) {
      const { ui } = state.config || {};
      if (ui && ui.diffScaling) {
        return ui.diffScaling;
      }
      return {
        show: false,
        value: 0.5,
        min: 0.1,
        step: 0.1,
        max: 1,
      };
    },
    UI_GLOBAL_MAX(state) {
      return state.globalMax;
    },
    UI_SKIP_INITIAL(state) {
      return state.skipInitial;
    },
  },
  mutations: {
    UI_CONFIG_SET(state, value) {
      state.config = value;
    },
    UI_GLOBAL_MAX_SET(state, max) {
      state.globalMax = max;
    },
    UI_SKIP_INITIAL_SET(state, value) {
      state.skipInitial = value;
    },
  },
  actions: {
    async UI_FETCH_CONFIG({ commit, dispatch, getters }, name) {
      const newConfig = await dispatch('WS_FETCH_CONFIG', name);
      commit('UI_CONFIG_SET', newConfig);

      //Set values from new config
      commit('TRAN_PRESS_USE_GRADIENT_SET', getters.UI_USE_GRADIENT.value);
      commit('UI_GLOBAL_MAX_SET', getters.UI_USE_HIST_GLOBAL_MAX.value);
      commit('UI_SKIP_INITIAL_SET', getters.UI_USE_SKIP_INITIAL.value);
      commit('AI_MODULE_VISIBILITY_SET', getters.UI_MODULE_SELECTOR.values);
      for (const model of getters.UI_ADD_REMOVE_AI.defaultModels) {
        const modelSelector = new ModelSelector(newConfig);
        modelSelector.values = Object.assign(modelSelector.values, model);
        dispatch('AI_ADD_ENTRY', modelSelector);
      }
    },
  },
};
