import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { internalWebSocketStore } from "@/plugins/__async-deps__/global-stores/web-socket";
import { InternalWebSocketManager } from "@/plugins/__core__/pplx-web-socket";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:webSocket": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:webSocket",
    dependencies: ["cache:corePlugins:enableStates"],
    loader: async ({
      "cache:corePlugins:enableStates": corePluginsEnableStates,
    }) => {
      if (!corePluginsEnableStates["webSocket"]) return;

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
