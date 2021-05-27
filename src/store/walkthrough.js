export default {
  state: {
    steps: null,
    stepIndex: 0,
  },
  getters: {
    WT_STEP_IS(store) {
      return (value) =>
        store.steps &&
        store.steps[store.stepIndex] &&
        store.steps[store.stepIndex].name === value;
    },
    WT_GUIDANCE(store) {
      return (
        store.steps &&
        store.steps[store.stepIndex] &&
        store.steps[store.stepIndex].guidance
      );
    },
    WT_NEXT_STEP_EXISTS(store) {
      return store.steps && !!store.steps[store.stepIndex + 1];
    },
    WT_LAST_STEP_EXISTS(store) {
      return store.steps && !!store.steps[store.stepIndex - 1];
    },
  },
  mutations: {
    WT_SET_STEPS(store, steps) {
      store.steps = steps;
    },
    WT_STEP_FORWARD(store) {
      if (store.steps[store.stepIndex + 1]) {
        store.stepIndex += 1;
      }
    },
    WT_STEP_BACKWARD(store) {
      if (store.steps[store.stepIndex - 1]) {
        store.stepIndex -= 1;
      }
    },
  },
};
