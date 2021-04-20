export default {
  state: {
    left: null,
    right: null,
    permeability: null,
    pressure: null,
    saturation: null,
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
    SIM_PERMEABILITY(state) {
      return state.permeability;
    },
    SIM_PRESSURE(state) {
      return state.pressure;
    },
    SIM_SATURATION(state) {
      return state.saturation;
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
    SIM_PERMEABILITY_SET(state, value) {
      state.permeability = value;
    },
    SIM_PRESSURE_SET(state, value) {
      state.pressure = value;
    },
    SIM_SATURATION_SET(state, value) {
      state.saturation = value;
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
    SIM_MODELS_RESULTS(
      { commit },
      { size, permeability, pressure, saturation, left, right },
    ) {
      commit('SIM_SIZE_SET', size);
      commit('SIM_PERMEABILITY_SET', permeability);
      commit('SIM_PRESSURE_SET', pressure);
      commit('SIM_SATURATION_SET', saturation);
      commit('SIM_LEFT_SET', left);
      commit('SIM_RIGHT_SET', right);
      commit('SIM_MODELS_RAN');
    },
  },
};
