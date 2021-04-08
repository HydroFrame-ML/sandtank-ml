import { mapGetters, mapActions } from "vuex";
import logo from "compare-sandtank-ai/src/assets/logo.png";
import RemoteRenderingView from "compare-sandtank-ai/src/components/widgets/RemoteRenderingView";
import Comparisons from "compare-sandtank-ai/src/components/core/Comparisons";
import Candidates from "compare-sandtank-ai/src/components/core/Candidates";
import Conditions from "compare-sandtank-ai/src/components/core/Conditions";

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: "App",
  components: {
    RemoteRenderingView,
    Comparisons,
    Candidates,
    Conditions
  },
  data() {
    return {
      logo
    };
  },
  computed: {
    ...mapGetters({
      client: "WS_CLIENT",
      busy: "WS_BUSY",
      resolution: "CONE_RESOLUTION"
    })
  },
  methods: {
    ...mapActions({
      setResolution: "CONE_RESOLUTION_UPDATE",
      resetCamera: "WS_RESET_CAMERA",
      connect: "WS_CONNECT"
    })
  },
  mounted() {
    this.connect();
  }
};
