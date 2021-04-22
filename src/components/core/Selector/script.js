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
    id: {},
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      removeAI: 'AI_REMOVE_ENTRY',
    }),
    ...mapMutations({}),
  },
};
