import { mapGetters } from 'vuex';

export default {
  name: 'Selector',
  props: {
    definition: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ...mapGetters({
      addRemoveAI: 'UI_ADD_REMOVE_AI',
    }),
    columSize() {
      let count = 0;
      const names = this.definition.getKeyNames();
      for (let i = 0; i < names.length; i++) {
        if (this.definition.getItems(names[i]).length > 1) {
          count++;
        }
      }
      if (count < 4) {
        return 12;
      }
      return 6;
    },
  },
};
