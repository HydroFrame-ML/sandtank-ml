import { mapGetters, mapActions } from "vuex";
import logo from "compare-sandtank-ai/src/assets/logo.png";
import Simulation from "compare-sandtank-ai/src/components/core/Simulation";

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: "App",
  components: {
    Simulation
  },
  data() {
    return {
      logo
    };
  },
  computed: {
    ...mapGetters({
      client: "WS_CLIENT",
      busy: "WS_BUSY"
    })
  },
  methods: {
    ...mapActions({
      connect: "WS_CONNECT"
    })
  },
  mounted() {
    this.connect();
  }
};
