import { mapGetters, mapMutations, mapActions } from 'vuex';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'Selector',
  props: {
    definition: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    ...mapMutations({}),
  },
};
