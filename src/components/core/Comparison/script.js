import { mapGetters, mapMutations, mapActions } from 'vuex';
import ComputedImage from 'compare-sandtank-ai/src/components/widgets/ComputedImage';
import Selector from 'compare-sandtank-ai/src/components/core/Selector';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'Comparison',
  data: () => ({
    size: [102, 50],
  }),
  components: { ComputedImage, Selector },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    ...mapMutations({}),
  },
};
