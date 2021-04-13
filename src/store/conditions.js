export default {
  state: {
    left: 9,
    right: 29,
    channels: [],
    size: [102, 50],
    running: false
  },
  getters: {
    COND_LEFT(state) {
      return state.left;
    },
    COND_RIGHT(state) {
      return state.right;
    },
    COND_CHANNELS(state) {
      return state.channels;
    },
    COND_SIZE(state) {
      return state.size;
    },
    COND_IS_RUNNING(state) {
      return state.running;
    }
  },
  mutations: {
    COND_LEFT_SET(state, left) {
      state.left = left;
    },
    COND_RIGHT_SET(state, right) {
      state.right = right;
    },
    COND_CHANNELS_SET(state, channels) {
      state.channels = channels;
    },
    COND_SIZE_SET(state, size) {
      state.size = size;
    },
    COND_MODELS_RAN(state) {
      state.running = false;
    }
  },
  actions: {
    COND_RUN_MODELS({ state, dispatch }) {
      state.running = true;
      const run = { left: state.left, right: state.right };
      dispatch("WS_RUN_MODELS", run);
    },
    COND_MODELS_RESULTS({ commit }, [{ inputs }]) {
      const { channels, size } = inputs;
      commit("COND_CHANNELS_SET", channels[0]);
      commit("COND_SIZE_SET", size);

      commit("COND_MODELS_RAN");
    }
  }
};
