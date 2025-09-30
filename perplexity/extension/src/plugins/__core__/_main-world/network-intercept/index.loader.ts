import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { injectMainWorldScript } from "@/utils/dom-utils/generics";

import networkInterceptPlugin from "@/plugins/__core__/_main-world/network-intercept/index?script&module";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:mainWorld:networkIntercept": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:mainWorld:networkIntercept",
    dependencies: ["cache:corePlugins:enableStates"],
    loader: async ({
      "cache:corePlugins:enableStates": corePluginsEnableStates,
    }) => {
      if (!corePluginsEnableStates["networkIntercept"]) return;

      injectMainWorldScript({
        url: chrome.runtime.getURL(networkInterceptPlugin),
        head: true,
      });
    },
  });
}
