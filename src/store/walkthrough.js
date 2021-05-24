export default {
  state: {
    steps: [
      {
        name: 'changeSlider',
        guidance: 'First, change the water coming into the simulation',
      },
      { name: 'runSimulation', guidance: 'Next, run the simulation.' },
      {
        name: 'runAI',
        guidance: 'Now, click this to run the ai and notice the differences!',
      },
    ],
    stepIndex: 0,
  },
  getters: {
    WT_STEP_IS(store) {
      return (value) =>
        store.steps[store.stepIndex] &&
        store.steps[store.stepIndex].name === value;
    },
    WT_GUIDANCE(store) {
      return (
        store.steps[store.stepIndex] && store.steps[store.stepIndex].guidance
      );
    },
  },
  mutations: {
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
