import TopBar from 'sandtank-ml/src/components/core/TopBar';

import logo from 'sandtank-ml/src/assets/logo.png';
import sandy from 'sandtank-ml/src/assets/sandy.png';

export default {
  name: 'Glossary',
  components: {
    TopBar,
  },
  data() {
    return {
      sandy,
      logo,
    };
  },
};
