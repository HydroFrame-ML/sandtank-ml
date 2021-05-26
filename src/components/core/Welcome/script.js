import logo from 'sandtank-ml/src/assets/logo.png';
import sandy from 'sandtank-ml/src/assets/sandy.png';

import TopBar from 'sandtank-ml/src/components/core/TopBar';

export default {
  name: 'Welcome',
  components: {
    TopBar,
  },
  data() {
    return { sandy, logo };
  },
};
