import vtkWSLinkClient from "vtk.js/Sources/IO/Core/WSLinkClient";
import SmartConnect from "wslink/src/SmartConnect";

import protocols from "compare-sandtank-ai/src/protocols";

import { connectImageStream } from "vtk.js/Sources/Rendering/Misc/RemoteView";

// Bind vtkWSLinkClient to our SmartConnect
vtkWSLinkClient.setSmartConnectClass(SmartConnect);

export default {
  state: {
    client: null,
    config: null,
    busy: false
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
    }
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
    }
  },
  actions: {
    WS_CONNECT({ state, commit, dispatch }) {
      // Initiate network connection
      const config = { application: "compareSandtank" };

      // Custom setup for development (http:8080 / ws:1234)
      if (location.port === "8080") {
        // We suppose that we have dev server and that ParaView/VTK is running on port 1234
        config.sessionURL = `ws://${location.hostname}:1234/ws`;
      }

      const { client } = state;
      if (client && client.isConnected()) {
        client.disconnect(-1);
      }
      let clientToConnect = client;
      if (!clientToConnect) {
        clientToConnect = vtkWSLinkClient.newInstance({ protocols });
      }

      // Connect to busy store
      clientToConnect.onBusyChange(count => {
        commit("WS_BUSY_SET", count);
      });
      clientToConnect.beginBusy();

      // Error
      clientToConnect.onConnectionError(httpReq => {
        const message =
          (httpReq && httpReq.response && httpReq.response.error) ||
          `Connection error`;
        console.error(message);
        console.log(httpReq);
      });

      // Close
      clientToConnect.onConnectionClose(httpReq => {
        const message =
          (httpReq && httpReq.response && httpReq.response.error) ||
          `Connection close`;
        console.error(message);
        console.log(httpReq);
      });

      // Connect
      clientToConnect
        .connect(config)
        .then(validClient => {
          const session = validClient.getConnection().getSession();
          connectImageStream(session);
          commit("WS_CLIENT_SET", validClient);
          clientToConnect.endBusy();

          // Setup Pubsub endpoints
          session.subscribe("parflow.results", inputs => {
            dispatch("COND_MODELS_RESULTS", inputs);
          });
        })
        .catch(error => {
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
    }
  }
};
