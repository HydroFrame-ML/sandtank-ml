import ComputedImage from 'sandtank-ml/src/components/widgets/ComputedImage';

export default {
  name: 'ImageWithOverlay',
  compoents: { ComputedImage },
  data: () => ({
    tooltipStyle: '',
    labelRGB: '',
    labelValue: '',
  }),
  props: {
    config: {
      type: String,
      default: '',
    },
    scale: {
      type: Number,
      default: 10,
    },
    size: {
      type: Array,
      default: () => [10, 10],
    },
    values: {
      type: Array,
      default: () => [],
    },
    convert: {
      type: Function,
      default: (v) => v,
    },
    rgb: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    updateOverlay(e) {
      if (e === null) {
        this.labelRGB = '';
        this.tooltipStyle = 'display: none;';
      } else {
        const { value, x, y } = e;
        this.labelValue = value;
        const color = this.permeabilityToColor(this.labelValue);
        this.labelRGB = `rgb(${color[0]}, ${color[1]}, ${color[2]});`;
        this.tooltipStyle = `position: fixed; left: ${x}; top: ${y};`;
      }
    },
  },
};
