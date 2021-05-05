import ModelSelector from 'sandtank-ml/src/utils/ModelSelector';
import { histogram, range } from 'sandtank-ml/src/utils/histogram';

const RESET_RUN = { left: null, right: null, time: null };
let CALLBACK = null;

export default {
  state: {
    models: [],
    left: 0,
    right: 0,
    modulesVisibility: ['selection', 'prediction', 'diff', 'stats', 'hist'],
    lastRun: RESET_RUN,
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
    AI_SHOW_HIST(state) {
      return state.modulesVisibility.includes('hist');
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
      dispatch('AI_ADD_STATS');
    },
    AI_ADD_STATS({ state, getters }) {
      const ref = getters.SIM_PRESSURE.map(getters.TRAN_PRESS_TO_NORM);
      const isPressure = getters.TRAN_PRESS_USE_GRADIENT;

      for (const model of state.models) {
        model.stats = {};

        // Add delta
        if (isPressure) {
          model.stats.delta = model.values.map((p, idx) =>
            Math.abs(ref[idx] - p),
          );
        } else {
          const normCutoff = -0.25;
          model.stats.delta = model.values.map((p, idx) =>
            ref[idx] > normCutoff === p > normCutoff ? 0 : 1,
          );
        }

        // Add Histograms
        // Fill histogram bins
        const binCount = 100;
        const hist = histogram(model.stats.delta, { pretty: true });
        const labels = range(1 / binCount, 1 + 1 / binCount, 1 / binCount);
        const bins = Array(labels.length).fill(0);
        for (let i = 0; i < model.stats.delta.length; i++) {
          const value = model.stats.delta[i];
          const index = labels.indexOf(hist.fun(value));
          bins[index] = bins[index] + 1;
        }

        // Configure dataset
        model.stats.histData = {
          labels,
          datasets: [
            {
              data: bins,
              label: false,
              backgroundColor: 'rgb(20,20,20)',
              barPercentage: 1.0,
              categoryPercentage: 1.0,
            },
          ],
        };

        // Add Pie Data
        const errorCount = ([errors, accuracies], val) => {
          if (val) {
            errors++;
          } else {
            accuracies++;
          }
          return [errors, accuracies];
        };
        model.stats.pieData = {
          labels: ['Errors', 'Accuracies'],
          datasets: [
            {
              data: model.stats.delta.reduce(errorCount, [0, 0]),
              backgroundColor: ['rgb(20,20,20)', 'rgb(200,200,200)'],
            },
          ],
        };
      }
    },
  },
};
