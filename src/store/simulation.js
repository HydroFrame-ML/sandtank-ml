let BUSY = false;
let PENDING_REQUEST = 0;

export default {
  state: {
    left: null,
    right: null,
    permeability: null,
    pressure: null,
    saturation: null,
    size: null,
    running: false,
    runTimeStep: 1,
    busy: false,
    lastRun: { left: null, right: null, runTimeStep: 1 },
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
    SIM_RUN_TIMESTEP(state) {
      return state.runTimeStep;
    },
    SIM_INPUT_DIRTY(state) {
      return (
        state.running ||
        state.left !== state.lastRun.left ||
        state.right !== state.lastRun.right ||
        state.runTimeStep !== state.lastRun.runTimeStep
      );
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
    SIM_RUN_TIMESTEP_SET(state, value) {
      state.runTimeStep = value;
    },
    SIM_SET_LAST_RUN(state) {
      const { left, right, runTimeStep } = state;
      state.lastRun = { left, right, runTimeStep };
    },
  },
  actions: {
    SIM_RUN_MODELS({ state, dispatch }) {
      state.running = true;
      const run = {
        left: state.left,
        right: state.right,
        time: state.runTimeStep,
      };
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
      commit('SIM_SET_LAST_RUN');
    },
    SIM_UPDATE_RUN_TIME({ commit, dispatch, state }, time) {
      commit('SIM_RUN_TIMESTEP_SET', Number(time));
      if (BUSY) {
        PENDING_REQUEST++;
        return;
      }

      BUSY = true;
      dispatch('WS_RUN_RESULTS', Number(time)).finally(() => {
        BUSY = false;
        if (PENDING_REQUEST) {
          PENDING_REQUEST = 0;
          dispatch('SIM_UPDATE_RUN_TIME', state.runTimeStep);
        }
      });
    },
  },
};
