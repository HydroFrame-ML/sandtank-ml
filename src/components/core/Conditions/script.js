import { mapGetters, mapMutations, mapActions } from "vuex";
import ComputedImage from "compare-sandtank-ai/src/components/widgets/ComputedImage";

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: "Conditions",
  components: { ComputedImage },
  data: () => ({ leftSlider: 23, rightSlider: 68 }),
  computed: {
    ...mapGetters({
      loading: "COND_IS_RUNNING"
    })
  },
  methods: {
    ...mapActions({ run: "COND_RUN_MODELS" }),
    ...mapMutations({
      setLeftSlider: "COND_LEFT_SET",
      setRightSlider: "COND_RIGHT_SET"
    })
  }
};
