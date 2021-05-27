import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'WalkthroughStep',
  props: {
    stepName: { type: String, required: true },
    advanceOnClick: { type: Boolean, default: false },
  },
  computed: {
    ...mapGetters({
      stepIs: 'WT_STEP_IS',
    }),
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
  },
};
