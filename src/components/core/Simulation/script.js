import { mapGetters, mapMutations, mapActions } from 'vuex';
import ImageWithOverlay from 'sandtank-ml/src/components/widgets/ImageWithOverlay';
import ComputedImage from 'sandtank-ml/src/components/widgets/ComputedImage';
import ComputedLegend from 'sandtank-ml/src/components/widgets/ComputedLegend';
import WalkthroughStep from 'sandtank-ml/src/components/widgets/WalkthroughStep';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'Simulation',
  components: {
    ImageWithOverlay,
    ComputedImage,
    WalkthroughStep,
    ComputedLegend,
  },
  computed: {
    ...mapGetters({
      isPressure: 'TRAN_USE_PRESSURE',
      loading: 'SIM_IS_RUNNING',
      leftSlider: 'SIM_LEFT',
      rightSlider: 'SIM_RIGHT',
      size: 'SIM_SIZE',
      permeability: 'SIM_PERMEABILITY',
      pressure: 'SIM_PRESSURE',
      permeabilityToColor: 'TRAN_PERMABILITY',
      normPressureToColor: 'TRAN_NORM_PRESSURE_TO_COLOR',
      toNormPress: 'TRAN_PRESS_TO_NORM',
      simulationTime: 'SIM_RUN_TIMESTEP',
      simulationLoading: 'SIM_IS_RUNNING',
      usePressureConfig: 'UI_USE_PRESSURE',
      usePermeabilityLabels: 'UI_USE_PERMEABILITY_LABELS',
      useWaterLabels: 'UI_USE_WATER_LABELS',
      needRunSimulation: 'SIM_RUN_NEEDED',
      fieldName: 'TRAN_FIELD_NAME',
      showLegend: 'UI_SHOW_LEGENDS',
    }),
    normPressure() {
      return this.pressure.map(this.toNormPress);
    },
    waterLabelValues() {
      return this.isPressure
        ? this.useWaterLabels.pressureValues
        : this.useWaterLabels.saturationValues;
    },
  },
  methods: {
    ...mapActions({
      run: 'SIM_RUN_MODELS',
    }),
    ...mapMutations({
      setLeftSlider: 'SIM_LEFT_SET',
      setRightSlider: 'SIM_RIGHT_SET',
      setPressure: 'TRAN_USE_PRESSURE_SET',
    }),
  },
};
