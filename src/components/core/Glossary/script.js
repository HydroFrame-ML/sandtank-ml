import { mapGetters } from 'vuex';
import sandy from 'sandtank-ml/src/assets/sandy.png';

export default {
  name: 'Glossary',
  data() {
    return {
      sandy,
    };
  },
  computed: {
    ...mapGetters({ glossaryUrl: 'UI_GLOSSARY_URL' }),
  },
  mounted() {
    const frame = this.$refs.glossaryFrame;

    function resizeFrame() {
      frame.style.height =
        frame.contentWindow.document.body.scrollHeight + 5 + 'px';
    }

    frame.onload = resizeFrame;
    window.onresize = resizeFrame;
  },
};
