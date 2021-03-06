import ComputedImage from 'sandtank-ml/src/components/widgets/ComputedImage';

export default {
  name: 'ImageWithOverlay',
  components: { ComputedImage },
  data: () => ({
    overlayStyle: '',
    overlayColor: '',
    overlayLabel: '',
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
    overlayKind: {
      type: String,
      default: 'none',
    },
    labels: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    updateOverlay(e) {
      if (this.overlayKind === 'labels' || this.overlayKind === 'values') {
        if (e) {
          const { value, clientX, clientY } = e;

          // Set color
          const color = this.convert(value);
          if (this.rgb) {
            this.overlayColor = `backgroundColor: rgb(${color[0]}, ${color[1]}, ${color[2]});`;
          } else {
            this.overlayColor = `backgroundColor: rgb(${color}, ${color}, ${color});`;
          }

          this.overlayLabel = value >= 10 ? value : value.toPrecision(1);

          // Set text
          if (this.overlayKind === 'labels' && this.labels[this.overlayLabel]) {
            this.overlayLabel = this.labels[this.overlayLabel];
          }

          // Set position
          this.overlayStyle = `display: block; left: ${clientX +
            10}px; top: ${clientY - 10}px;`;
        } else {
          this.overlayStyle = 'display: none;';
        }
      }
    },
  },
  mounted() {
    // Set div size to match canvas
    const [width, height] = this.size;
    this.$el.style.width = width * this.scale + 'px';
    this.$el.style.height = height * this.scale + 'px';
  },
};
