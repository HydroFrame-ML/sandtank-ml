export default {
  name: 'ComputedImage',
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
  computed: {
    width() {
      return this.size[0];
    },
    height() {
      return this.size[1];
    },
  },
  watch: {
    size() {
      this.$nextTick(this.render);
    },
    values() {
      this.$nextTick(this.render);
    },
    scale() {
      this.$nextTick(this.render);
    },
    convert() {
      this.$nextTick(this.render);
    },
    config() {
      this.$nextTick(this.render);
    },
  },
  mounted() {
    this.$nextTick(this.render);
  },
  methods: {
    render() {
      const ctx = this.$el.getContext('2d');
      ctx.clearRect(0, 0, this.width, this.height);
      const rawPixels = ctx.createImageData(this.width, this.height);
      for (let j = 0; j < this.height; j++) {
        for (let i = 0; i < this.width; i++) {
          const idxSrc = i + j * this.width;
          const idxDst = i + (this.height - j - 1) * this.width;
          const value = this.convert(this.values[idxSrc]);
          if (this.rgb) {
            /* eslint-disable prefer-destructuring */
            rawPixels.data[idxDst * 4 + 0] = value[0];
            rawPixels.data[idxDst * 4 + 1] = value[1];
            rawPixels.data[idxDst * 4 + 2] = value[2];
          } else {
            rawPixels.data[idxDst * 4 + 0] = value;
            rawPixels.data[idxDst * 4 + 1] = value;
            rawPixels.data[idxDst * 4 + 2] = value;
          }
          rawPixels.data[idxDst * 4 + 3] = 255; // Opaque
        }
      }
      ctx.putImageData(rawPixels, 0, 0);

      ctx.drawImage(
        this.$el,
        0,
        0,
        this.width,
        this.height,
        0,
        0,
        this.width * this.scale,
        this.height * this.scale,
      );
    },
    currentRGB(e) {
      var pos = this.findPosition(this.$el);
      var x = Math.floor((e.pageX - pos.x) / this.scale);
      var y = Math.floor((e.pageY - pos.y) / this.scale);
      const valueIndex = x + (this.height - y) * this.width;
      this.$emit('currentValue', this.values[valueIndex]);
    },
    findPosition(el) {
      var curleft = 0,
        curtop = 0;
      if (el.offsetParent) {
        //eslint-disable-next-line
        do {
          curleft += el.offsetLeft;
          curtop += el.offsetTop;
        } while ((el = el.offsetParent));
        return { x: curleft, y: curtop };
      }
      return undefined;
    },
    mouseLeft() {
      this.$emit('currentValue', null);
    },
  },
};
