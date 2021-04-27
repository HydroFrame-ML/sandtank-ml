export default {
  getters: {
    UI_TIME_RANGE(state, getters) {
      const { ui } = getters.AI_CONFIG || {};
      return (ui && ui.time) || [0, 10];
    },
    UI_AUTO_RUN(state, getters) {
      const { ui } = getters.AI_CONFIG || {};
      if (ui && ui.autoRun) {
        return ui.autoRun;
      }
      return {
        show: true,
        value: false,
      };
    },
    UI_USE_GRADIENT(state, getters) {
      const { ui } = getters.AI_CONFIG || {};
      if (ui && ui.useGradient) {
        return ui.useGradient;
      }
      return {
        show: true,
        value: true,
      };
    },
    UI_MODULE_SELECTOR(state, getters) {
      const { ui } = getters.AI_CONFIG || {};
      if (ui && ui.moduleSelector) {
        return ui.moduleSelector;
      }
      return {
        show: true,
        values: ['selection', 'prediction', 'diff', 'stats'],
      };
    },
    UI_MODULE_AVAILABLE(state, getters) {
      const { values } = getters.UI_MODULE_SELECTOR;
      return (name) => values.includes(name);
    },
    UI_DIFF_SCALING(state, getters) {
      const { ui } = getters.AI_CONFIG || {};
      if (ui && ui.diffScaling) {
        return ui.diffScaling;
      }
      return {
        show: true,
        value: 0.5,
        min: 0.1,
        step: 0.1,
        max: 1,
      };
    },
  },
};
