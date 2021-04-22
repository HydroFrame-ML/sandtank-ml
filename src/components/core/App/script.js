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
      simulationTime: 'SIM_RUN_TIMESTEP',
    }),
  },
  methods: {
    ...mapActions({
      connect: 'WS_CONNECT',
      addAI: 'AI_ADD_ENTRY',
      runAI: 'AI_RUN',
      updateSimulationTime: 'SIM_UPDATE_RUN_TIME',
    }),
  },
  mounted() {
    this.connect();
  },
};
