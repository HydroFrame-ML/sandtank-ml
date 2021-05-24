import { mapGetters } from 'vuex';

export default {
  name: 'WalkthroughStep',
  props: { stepName: { type: String, required: true } },
  computed: {
    ...mapGetters({
      stepIs: 'WT_STEP_IS',
    }),
  },
};
