import { mapActions, mapGetters } from 'vuex';
import logo from 'sandtank-ml/src/assets/logo.png';
import Simulation from 'sandtank-ml/src/components/core/Simulation';
import Comparison from 'sandtank-ml/src/components/core/Comparison';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'App',
  components: {
    Simulation,
    Comparison,
  },
  data() {
    return {
      logo,
    };
  },
  computed: {
    ...mapGetters({
      aiModels: 'AI_MODELS',
    }),
  },
  methods: {
    ...mapActions({
      connect: 'WS_CONNECT',
      runAI: 'AI_RUN',
    }),
  },
  mounted() {
    this.connect();
  },
};
