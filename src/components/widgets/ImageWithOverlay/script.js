import ComputedImage from 'sandtank-ml/src/components/widgets/ComputedImage';

export default {
  name: 'ImageWithOverlay',
  components: { ComputedImage },
  data: () => ({
    overlayStyle: '',
    valueColor: '',
    label: '',
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
    labels: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    updateOverlay(e) {
      if (e) {
        const { value, clientX, clientY } = e;
        const color = this.convert(value);
        if (this.rgb) {
          this.valueColor = `backgroundColor: rgb(${color[0]}, ${color[1]}, ${color[2]});`;
        } else {
          this.valueColor = `backgroundColor: rgb(${color}, ${color}, ${color});`;
        }
        this.label = this.labels[value] || value;
        this.overlayStyle = `display: block; left: ${clientX +
          10}px; top: ${clientY - 10}px;`;
      } else {
        this.overlayStyle = 'display: none;';
      }
    },
  },
};
