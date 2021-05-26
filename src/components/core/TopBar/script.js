import { mapGetters } from 'vuex';

export default {
  name: 'TopBar',
  data() {
    return {
      links: [
        { name: 'Welcome', link: '/welcome' },
        { name: 'Sandtank ML', link: '/' },
        { name: 'Glossary', link: '/glossary' },
      ],
    };
  },
  computed: {
    ...mapGetters({ busy: 'WS_BUSY' }),
  },
};
