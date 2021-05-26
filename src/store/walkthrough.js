export default {
  state: {
    steps: [
      {
        name: 'start',
        guidance: 'If you like, I can guide you through using Sandtank ML.',
      },
      {
        name: 'simulationPermeability',
        guidance:
          'We will be simulating how water flows through the different soils in this sandtank. Think of an ant farm! The different colors here are different kinds of soil.',
      },
      {
        name: 'simulationWater',
        guidance:
          'This is our output. Our simulation thinks water will be in these places',
      },
      {
        name: 'changeSlider',
        guidance:
          'First, change the water coming into the simulation. These dials set how high the water starts out on each side of the sandtank.',
      },
      { name: 'runSimulation', guidance: 'Next, run the simulation.' },
      {
        name: 'wait',
        guidance: "The simulation will run. Continue when it's finished!",
      },
      {
        name: 'runAI',
        guidance: 'Now, click this to run the ai and notice the differences!',
      },
      {
        name: 'done',
        guidance: 'What did you notice? Play with the values and explore!',
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
    WT_NEXT_STEP_EXISTS(store) {
      return !!store.steps[store.stepIndex + 1];
    },
    WT_LAST_STEP_EXISTS(store) {
      return !!store.steps[store.stepIndex - 1];
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
