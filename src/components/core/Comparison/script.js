import { mapGetters, mapMutations, mapActions } from 'vuex';
import ComputedImage from 'sandtank-ml/src/components/widgets/ComputedImage';
import Selector from 'sandtank-ml/src/components/core/Selector';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'Comparison',
  props: {
    model: {
      type: Object,
      default: null,
    },
    id: {},
  },
  data: () => ({
    size: [102, 50],
  }),
  components: { ComputedImage, Selector },
  computed: {
    ...mapGetters({
      pressureToColor: 'TRAN_PRESSURE',
      aiToPress: 'TRAN_AI_TO_PRESS',
      deltaToColor: 'TRAN_DIFF_COLOR',
      computedPressure: 'SIM_PRESSURE',
    }),
    pressure() {
      return this.model.values.map(this.aiToPress);
    },
    delta() {
      const out = new Float32Array(102 * 50);
      const press = this.pressure;
      const ref = this.computedPressure;
      for (let j = 0; j < 50; j++) {
        for (let i = 0; i < 102; i++) {
          const dstIdx = i + 102 * j;
          const srcIdx = i - 1 + 100 * j;
          if (i == 0 || i == 101) {
            out[dstIdx] = 0;
          } else {
            out[dstIdx] = ref[srcIdx] - press[dstIdx];
          }
        }
      }
      return out;
    },
  },
  methods: {
    ...mapActions({}),
    ...mapMutations({}),
  },
};
