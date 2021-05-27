export default {
  name: 'ComputedImage',
  props: {
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
  computed: {
    height() {
      return this.size[1];
    },
    legend() {
      const legend = [];
      const entries = {};

      // Find ranges of values that make up entries
      for (var value of this.values) {
        const pixel = this.convert(value);
        const pxKey = String(pixel);
        const approx = value >= 10 ? value : value.toPrecision(1);

        if (!entries[pxKey]) {
          entries[pxKey] = {
            min: null,
            max: null,
            pixel,
          };
        }
        if (entries[pxKey].max === null || approx > entries[pxKey].max) {
          entries[pxKey].max = approx;
        }
        if (entries[pxKey].min === null || approx < entries[pxKey].min) {
          entries[pxKey].min = approx;
        }
      }

      // Make label and color reference for each entry
      for (var key in entries) {
        const { min, max, pixel } = entries[key];
        let label = min !== max ? `[${min}, ${max}]` : max;
        label = this.labels[label] || label;
        let color;
        if (this.rgb) {
          color = `backgroundColor: rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]});`;
        } else {
          color = `backgroundColor: rgb(${pixel}, ${pixel}, ${pixel});`;
        }
        legend.push({ label, color, max });
      }

      legend.sort((first, second) => first.max - second.max);
      return legend;
    },
  },
};
