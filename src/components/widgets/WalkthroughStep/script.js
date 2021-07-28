import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'WalkthroughStep',
  data: () => ({
    untouched: true,
  }),
  props: {
    stepName: { type: String, required: true },
    advanceOnClick: { type: Boolean, default: false },
  },
  computed: {
    ...mapGetters({
      stepIs: 'WT_STEP_IS',
    }),
    currentStep() {
      return this.stepIs(this.stepName);
    },
  },
  methods: {
    ...mapMutations({
      forward: 'WT_STEP_FORWARD',
    }),
    moveForwardIfAuto() {
      if (this.advanceOnClick && this.stepIs(this.stepName)) {
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
