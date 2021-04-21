export default {
  state: {
    models: [
      {
        uri:
          'RegressionPressure://models/RegressionPressureEngine/press-full-lr4-ndp-e20',
      },
    ],
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
    async AI_RUN({ state, getters, commit, dispatch }) {
      const left = getters.SIM_LEFT;
      const right = getters.SIM_RIGHT;
      commit('AI_LEFT_SET', left);
      commit('AI_RIGHT_SET', right);
      const responses = await Promise.all(
        state.models.map(({ uri }) =>
          dispatch('WS_PREDICT', { uri, left, right }),
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
