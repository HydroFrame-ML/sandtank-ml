import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'WalkthroughStep',
  data: () => ({
    untouched: true,
  }),
  props: {
    stepName: { required: true },
    advanceOnClick: { type: Boolean, default: false },
    hideHighlight: { type: Boolean, default: false },
  },
  computed: {
    ...mapGetters({
      currentStepMatches: 'WT_STEP_IS',
    }),
    currentStep() {
      if (Array.isArray(this.stepName)) {
        return this.stepName.some(this.currentStepMatches);
      }
      return this.currentStepMatches(this.stepName);
    },
  },
  methods: {
    ...mapMutations({
      forward: 'WT_STEP_FORWARD',
    }),
    moveForwardIfAuto() {
      if (this.advanceOnClick && this.currentStep) {
        this.forward();
      }
    },
    endAnimation() {
      this.untouched = false;
    },
  },
  watch: {
    currentStep() {
      this.untouched = true;
    },
  },
};
