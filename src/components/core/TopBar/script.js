import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'TopBar',
  data() {
    return {
      links: [
        { name: 'Welcome', link: '/welcome' },
        { name: 'Sandtank ML', link: '/' },
        { name: 'Glossary', link: '/glossary' },
        { name: 'Resources', link: '/resources' },
      ],
    };
  },
  computed: {
    ...mapGetters({
      busy: 'WS_BUSY',
      guidanceVisible: 'UI_SHOW_GUIDANCE',
    }),
  },
  methods: {
    ...mapMutations({
      setGuidanceVisibility: 'UI_SHOW_GUIDANCE_SET',
    }),
    toggleGuidance() {
      this.setGuidanceVisibility(!this.guidanceVisible);
    },
  },
};
