import { mapGetters, mapMutations, mapActions } from 'vuex';
import ComputedImage from 'sandtank-ml/src/components/widgets/ComputedImage';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'Simulation',
  components: { ComputedImage },
  data: () => ({ labelRGB: '', labelValue: null }),
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
      usePermeabilityLabels: 'UI_USE_PERMEABILITY_LABELS',
      needRunSimulation: 'SIM_RUN_NEEDED',
      fieldName: 'TRAN_FIELD_NAME',
    }),
    normPressure() {
      return this.pressure.map(this.toNormPress);
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
    setCurrentRGB(value) {
      this.labelValue = value;
      if (value === null) {
        this.labelRGB = '';
      } else {
        const color = this.permeabilityToColor(value);
        this.labelRGB = `rgb(${color[0]}, ${color[1]}, ${color[2]});`;
      }
    },
  },
};
