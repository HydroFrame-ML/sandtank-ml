export default {
  state: {
    left: null,
    right: null,
    channels: null,
    size: null,
    running: false,
  },
  getters: {
    SIM_LEFT(state) {
      return state.left;
    },
    SIM_RIGHT(state) {
      return state.right;
    },
    SIM_CHANNELS(state) {
      return state.channels;
    },
    SIM_SIZE(state) {
      return state.size;
    },
    SIM_IS_RUNNING(state) {
      return state.running;
    },
  },
  mutations: {
    SIM_LEFT_SET(state, left) {
      state.left = left;
    },
    SIM_RIGHT_SET(state, right) {
      state.right = right;
    },
    SIM_CHANNELS_SET(state, channels) {
      state.channels = channels;
    },
    SIM_SIZE_SET(state, size) {
      state.size = size;
    },
    SIM_MODELS_RAN(state) {
      state.running = false;
    },
  },
  actions: {
    SIM_RUN_MODELS({ state, dispatch }) {
      state.running = true;
      const run = { left: state.left, right: state.right };
      dispatch('WS_RUN_MODELS', run);
    },
    SIM_MODELS_RESULTS({ commit }, { outputs, inputs, left, right }) {
      const { channels, size } = inputs;
      commit('SIM_CHANNELS_SET', channels[0]);
      commit('SIM_SIZE_SET', size);
      console.log('outputs', outputs);
      console.log('inputs', inputs);

      if (left) {
        commit('SIM_LEFT_SET', left);
      }
      if (right) {
        commit('SIM_RIGHT_SET', right);
      }

      commit('SIM_MODELS_RAN');
    },
  },
};
