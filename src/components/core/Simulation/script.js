import { mapGetters, mapMutations, mapActions } from 'vuex';
import ComputedImage from 'sandtank-ml/src/components/widgets/ComputedImage';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'Simulation',
  components: { ComputedImage },
  computed: {
    ...mapGetters({
      isPressure: 'TRAN_PRESS_USE_GRADIENT',
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
      useGradientConfig: 'UI_USE_GRADIENT',
      dirty: 'SIM_INPUT_DIRTY',
    }),
    normPressure() {
      return this.pressure.map(this.toNormPress);
    },
    fieldName() {
      return this.isPressure ? 'Pressure' : 'Saturation';
    },
  },
  methods: {
    ...mapActions({
      run: 'SIM_RUN_MODELS',
    }),
    ...mapMutations({
      setLeftSlider: 'SIM_LEFT_SET',
      setRightSlider: 'SIM_RIGHT_SET',
      setPressure: 'TRAN_PRESS_USE_GRADIENT_SET',
    }),
  },
};
