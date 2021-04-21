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
  },
  data: () => ({
    size: [102, 50],
  }),
  components: { ComputedImage, Selector },
  computed: {
    ...mapGetters({
      pressureToColor: 'TRAN_PRESSURE',
      aiToPress: 'TRAN_AI_TO_PRESS',
    }),
    pressure() {
      return this.model.values.map(this.aiToPress);
    },
  },
  methods: {
    ...mapActions({}),
    ...mapMutations({}),
  },
};
