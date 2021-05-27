import { mapActions } from 'vuex';
import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';
import TopBar from 'sandtank-ml/src/components/core/TopBar';
import Sandtank from 'sandtank-ml/src/components/core/Sandtank';

// Process arguments from URL
const userParams = vtkURLExtract.extractURLParameters();

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'App',
  components: {
    TopBar,
    Sandtank,
  },
  methods: {
    ...mapActions({
      connect: 'WS_CONNECT',
      fetchConfig: 'UI_FETCH_CONFIG',
    }),
  },
  async mounted() {
    await this.connect();
    this.fetchConfig(userParams.name);
  },
};
