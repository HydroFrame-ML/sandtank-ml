import { mapActions, mapGetters, mapMutations } from 'vuex';
import sandy from 'sandtank-ml/src/assets/sandy.png';
import Simulation from 'sandtank-ml/src/components/core/Simulation';
import Comparison from 'sandtank-ml/src/components/core/Comparison';
import WalkthroughStep from 'sandtank-ml/src/components/widgets/WalkthroughStep';
import TopBar from 'sandtank-ml/src/components/core/TopBar';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'App',
  components: {
    TopBar,
    Simulation,
    Comparison,
    WalkthroughStep,
  },
  data() {
    return {
      sandy,
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
      stepIs: 'WT_STEP_IS',
      moduleConfig: 'UI_MODULE_SELECTOR',
      isModuleAvailable: 'UI_MODULE_AVAILABLE',
      diffScalingConfig: 'UI_DIFF_SCALING',
      needRunSimulation: 'SIM_RUN_NEEDED',
      needRunAI: 'AI_RUN_NEEDED',
      aiLoading: 'AI_IS_RUNNING',
      addRemoveAI: 'UI_ADD_REMOVE_AI',
      guidance: 'WT_GUIDANCE',
      lastExists: 'WT_LAST_STEP_EXISTS',
      nextExists: 'WT_NEXT_STEP_EXISTS',
      useLegendButton: 'UI_USE_LEGEND',
      showLegends: 'UI_SHOW_LEGENDS',
      guidanceVisible: 'UI_SHOW_GUIDANCE',
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
      forward: 'WT_STEP_FORWARD',
      back: 'WT_STEP_BACKWARD',
      setShowLegends: 'UI_SHOW_LEGEND_SET',
    }),
    ...mapActions({
      runSimulation: 'SIM_RUN_MODELS',
      addAI: 'AI_ADD_ENTRY',
      runAI: 'AI_RUN',
      updateSimulationTime: 'SIM_UPDATE_RUN_TIME',
      removeAI: 'AI_REMOVE_ENTRY',
    }),
  },
};
