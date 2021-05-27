import ModelSelector from 'sandtank-ml/src/utils/ModelSelector';

export default {
  state: {
    config: {},
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
        show: true,
        defaultModels: [],
      };
    },
    UI_WALKTHROUGH_STEPS(state) {
      const { ui } = state.config || {};
      if (ui && ui.walkthrough && ui.walkthrough.steps) {
        return ui.walkthrough.steps;
      }
      return {};
    },
    UI_USE_PRESSURE(state) {
      const { ui } = state.config || {};
      if (ui && ui.usePressure) {
        return ui.usePressure;
      }
      return {
        show: false,
        value: true,
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
        showOverlay: true,
        showLegend: true,
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
    UI_USE_WATER_LABELS(state) {
      const { ui } = state.config || {};
      if (ui && ui.useWaterLabels) {
        return ui.useWaterLabels;
      }
      return {
        showOverlay: true,
        showLegend: true,
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
    UI_SKIP_INITIAL(state) {
      return state.skipInitial;
    },
  },
  mutations: {
    UI_CONFIG_SET(state, value) {
      state.config = value;
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
      commit('WT_SET_STEPS', getters.UI_WALKTHROUGH_STEPS);
      commit('TRAN_USE_PRESSURE_SET', getters.UI_USE_PRESSURE.value);
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
