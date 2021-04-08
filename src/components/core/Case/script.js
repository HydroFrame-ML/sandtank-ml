import { mapGetters, mapActions } from "vuex";
import ComputedImage from "compare-sandtank-ai/src/components/widgets/ComputedImage";

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: "Case",
  components: { ComputedImage },
  data: () => ({ leftSlider: 23, rightSlider: 68 }),
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({})
  }
};
