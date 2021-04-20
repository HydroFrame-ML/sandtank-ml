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
      loading: 'SIM_IS_RUNNING',
      channels: 'SIM_CHANNELS',
      size: 'SIM_SIZE',
      inputRGB: 'TRAN_INPUT_RGB',
      inputConvert: 'TRAN_INPUT_CONVERT',
      outputRGB: 'TRAN_OUTPUT_RGB',
      outputConvert: 'TRAN_OUTPUT_CONVERT',
      leftSlider: 'SIM_LEFT',
      rightSlider: 'SIM_RIGHT',
    }),
  },
  methods: {
    ...mapActions({
      run: 'SIM_RUN_MODELS',
    }),
    ...mapMutations({
      setLeftSlider: 'SIM_LEFT_SET',
      setRightSlider: 'SIM_RIGHT_SET',
    }),
  },
};
