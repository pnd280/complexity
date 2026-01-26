import { InternalWebSocketManager } from "@/entrypoints/contexts/content-scripts/core-plugins/pplx-web-socket";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { internalWebSocketStore } from "@/entrypoints/contexts/content-scripts/stores/web-socket";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:webSocket": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:webSocket",
    dependencies: ["cache:pluginsEnableStates"],
    loader: async ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["webSocket"]) return;

      void InternalWebSocketManager.getInstance()
        .handShake()
        .then((socket) => {
          internalWebSocketStore.setState({
            common: socket,
          });
        });
    },
  });
}
