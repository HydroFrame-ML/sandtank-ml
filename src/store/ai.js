import ModelSelector from 'sandtank-ml/src/utils/ModelSelector';

export default {
  state: {
    models: [],
    left: 0,
    right: 0,
  },
  getters: {
    AI_MODELS(state) {
      return state.models;
    },
  },
  mutations: {
    AI_LEFT_SET(state, value) {
      state.left = value;
    },
    AI_RIGHT_SET(state, value) {
      state.right = value;
    },
  },
  actions: {
    AI_ADD_ENTRY({ state }) {
      // FIXME should provide the definition at build time
      state.models = state.models.concat({
        modelSelector: new ModelSelector(),
      });
    },
    AI_REMOVE_ENTRY({ state }, index) {
      console.log(index);
      state.models.splice(index, 1);
    },
    async AI_RUN({ state, getters, commit, dispatch }) {
      const left = getters.SIM_LEFT;
      const right = getters.SIM_RIGHT;
      commit('AI_LEFT_SET', left);
      commit('AI_RIGHT_SET', right);
      const responses = await Promise.all(
        state.models.map(({ modelSelector }) =>
          dispatch('WS_PREDICT', { uri: modelSelector.getURI(), left, right }),
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
