import { mapActions, mapGetters, mapMutations } from 'vuex';
import logo from 'sandtank-ml/src/assets/logo.png';
import Simulation from 'sandtank-ml/src/components/core/Simulation';
import Comparison from 'sandtank-ml/src/components/core/Comparison';
import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';

// Process arguments from URL
const userParams = vtkURLExtract.extractURLParameters();

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
      autoRun: false,
      gradientColor: true,
    };
  },
  watch: {
    autoRun(v) {
      if (v) {
        this.runAI();
      }
    },
    gradientColor(v) {
      this.setUseGradientColor(v);
    },
  },
  computed: {
    ...mapGetters({
      busy: 'WS_BUSY',
      aiModels: 'AI_MODELS',
      timeRange: 'SIM_TIME_RANGE',
      simulationTime: 'SIM_RUN_TIMESTEP',
      showAutoRun: 'SIM_AUTO_RUN_ENABLE',
      visibility: 'AI_MODULE_VISIBILITY',
    }),
    visibleModules: {
      get() {
        return this.visibility;
      },
      set(v) {
        this.updateVisibility(v);
      },
    },
  },
  methods: {
    ...mapMutations({
      setUseGradientColor: 'TRAN_PRESS_USE_GRADIENT_SET',
      updateVisibility: 'AI_MODULE_VISIBILITY_SET',
    }),
    ...mapActions({
      connect: 'WS_CONNECT',
      fetchConfig: 'AI_FETCH_CONFIG',
      addAI: 'AI_ADD_ENTRY',
      runAI: 'AI_RUN',
      updateSimulationTime: 'SIM_UPDATE_RUN_TIME',
      removeAI: 'AI_REMOVE_ENTRY',
    }),
    autoRunModels() {
      if (this.autoRun) {
        this.runAI();
      }
    },
  },
  async mounted() {
    await this.connect();
    this.fetchConfig(userParams.name);
  },
};
