import vtkWSLinkClient from 'vtk.js/Sources/IO/Core/WSLinkClient';
import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';
import SmartConnect from 'wslink/src/SmartConnect';

import protocols from 'sandtank-ml/src/protocols';

import { connectImageStream } from 'vtk.js/Sources/Rendering/Misc/RemoteView';

// ----------------------------------------------------------------------------
// Ensure we keep the same hostname regardless what the server advertise
// ----------------------------------------------------------------------------

// Process arguments from URL
const userParams = vtkURLExtract.extractURLParameters();

function configDecorator(config) {
  // We actually have a sessionURL in the config, we rewrite it
  if (config.sessionURL && !userParams.dev) {
    const sessionUrl = new URL(config.sessionURL);
    sessionUrl.host = window.location.host;
    return Object.assign({}, config, {
      sessionURL: sessionUrl.toString(),
    });
  }
  return config;
}

// Bind vtkWSLinkClient to our SmartConnect
vtkWSLinkClient.setSmartConnectClass(SmartConnect);

export default {
  state: {
    client: null,
    config: null,
    busy: false,
  },
  getters: {
    WS_CLIENT(state) {
      return state.client;
    },
    WS_CONFIG(state) {
      return state.config;
    },
    WS_BUSY(state) {
      return !!state.busy;
    },
  },
  mutations: {
    WS_CLIENT_SET(state, client) {
      state.client = client;
    },
    WS_CONFIG_SET(state, config) {
      state.config = config;
    },
    WS_BUSY_SET(state, busy) {
      state.busy = busy;
    },
  },
  actions: {
    async WS_CONNECT({ state, commit, dispatch }) {
      // Initiate network connection
      const config = { application: 'sandtank-ml' };

      // Custom setup for development (http:8080 / ws:1234)
      if (location.port === '8080') {
        // We suppose that we have dev server and that ParaView/VTK is running on port 1234
        config.sessionURL = `ws://${location.hostname}:1234/ws`;
      }
      if (location.port === '8081') {
        // We suppose that we have dev server and that ParaView/VTK is running on port 2345
        config.sessionURL = `ws://${location.hostname}:2345/ws`;
      }

      const { client } = state;
      if (client && client.isConnected()) {
        client.disconnect(-1);
      }
      let clientToConnect = client;
      if (!clientToConnect) {
        clientToConnect = vtkWSLinkClient.newInstance({
          protocols,
          configDecorator,
        });
      }

      // Connect to busy store
      clientToConnect.onBusyChange((count) => {
        commit('WS_BUSY_SET', count);
      });
      clientToConnect.beginBusy();

      // Error
      clientToConnect.onConnectionError((httpReq) => {
        const message =
          (httpReq && httpReq.response && httpReq.response.error) ||
          `Connection error`;
        console.error(message);
        console.log(httpReq);
      });

      // Close
      clientToConnect.onConnectionClose((httpReq) => {
        const message =
          (httpReq && httpReq.response && httpReq.response.error) ||
          `Connection close`;
        console.error(message);
        console.log(httpReq);
      });

      // Connect
      return clientToConnect
        .connect(config)
        .then((validClient) => {
          const session = validClient.getConnection().getSession();
          connectImageStream(session);
          commit('WS_CLIENT_SET', validClient);
          clientToConnect.endBusy();

          // Setup Pubsub endpoints
          validClient
            .getRemote()
            .Parflow.subscribeToParflowOutput(([results]) => {
              dispatch('SIM_MODELS_RESULTS', results);
            });

          dispatch('WS_INITIAL_RUN');
        })
        .catch((error) => {
          console.error(error);
        });
    },
    async WS_RUN_MODELS({ state }, run) {
      if (state.client) {
        await state.client
          .getRemote()
          .Parflow.runModels(run)
          .catch(console.error);
      }
    },
    async WS_FETCH_CONFIG({ state }, name) {
      return state.client
        .getRemote()
        .AI.fetchConfig(name)
        .catch(console.error);
    },
    async WS_INITIAL_RUN({ state, dispatch }) {
      if (state.client) {
        const initialRun = await state.client
          .getRemote()
          .Parflow.initialRun()
          .catch(console.error);
        if (initialRun) {
          dispatch('SIM_MODELS_RESULTS', initialRun);
        }
      }
    },
    async WS_RUN_RESULTS({ state }, time) {
      return state.client
        .getRemote()
        .Parflow.getResults(time)
        .catch(console.error);
    },
    WS_PREDICT({ state }, { uri, left, right, time }) {
      return state.client
        .getRemote()
        .AI.predict(uri, left, right, time)
        .catch(console.error);
    },
    WS_EXPLAIN({ state }, { uri, method, xy }) {
      return state.client
        .getRemote()
        .AI.explain(uri, method, xy)
        .catch(console.error);
    },
    WS_STATS({ state }, { uri }) {
      return state.client
        .getRemote()
        .AI.stats(uri)
        .catch(console.error);
    },
  },
};
