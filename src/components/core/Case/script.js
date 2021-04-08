import { mapGetters, mapActions } from "vuex";
import ComputedImage from "compare-sandtank-ai/src/components/widgets/ComputedImage";

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: "Case",
  components: { ComputedImage },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({})
  }
};
