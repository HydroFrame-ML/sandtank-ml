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
      gradientColor: true,
    };
  },
  watch: {
    gradientColor(v) {
      this.setUseGradientColor(v);
    },
    usePressureConfig({ value }) {
      this.gradientColor = value;
    },
    diffScalingConfig({ value }) {
      this.setDiffScale(value);
    },
  },
  computed: {
    ...mapGetters({
      busy: 'WS_BUSY',
      aiModels: 'AI_MODELS',
      timeRange: 'UI_TIME_RANGE',
      simulationLoading: 'SIM_IS_RUNNING',
      simulationTime: 'SIM_RUN_TIMESTEP',
      usePressureConfig: 'UI_USE_PRESSURE',
      visibility: 'AI_MODULE_VISIBILITY',
      diffScale: 'TRAN_DIFF_SCALE',
      isPressure: 'TRAN_USE_PRESSURE',
      moduleConfig: 'UI_MODULE_SELECTOR',
      isModuleAvailable: 'UI_MODULE_AVAILABLE',
      diffScalingConfig: 'UI_DIFF_SCALING',
      needRunSimulation: 'SIM_RUN_NEEDED',
      needRunAI: 'AI_RUN_NEEDED',
      aiLoading: 'AI_IS_RUNNING',
      addRemoveAI: 'UI_ADD_REMOVE_AI',
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
      setUseGradientColor: 'TRAN_USE_PRESSURE_SET',
      updateVisibility: 'AI_MODULE_VISIBILITY_SET',
      setDiffScale: 'TRAN_DIFF_SCALE_SET',
    }),
    ...mapActions({
      connect: 'WS_CONNECT',
      runSimulation: 'SIM_RUN_MODELS',
      fetchConfig: 'UI_FETCH_CONFIG',
      addAI: 'AI_ADD_ENTRY',
      runAI: 'AI_RUN',
      updateSimulationTime: 'SIM_UPDATE_RUN_TIME',
      removeAI: 'AI_REMOVE_ENTRY',
    }),
  },
  async mounted() {
    await this.connect();
    this.fetchConfig(userParams.name);
  },
};
