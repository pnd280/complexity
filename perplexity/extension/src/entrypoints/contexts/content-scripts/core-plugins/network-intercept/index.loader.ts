import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { injectMainWorldScript } from "@/utils/dom-utils/generics";

import networkInterceptPlugin from "@/entrypoints/contexts/content-scripts/core-plugins/network-intercept/index?script&module";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:mainWorld:networkIntercept": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:mainWorld:networkIntercept",
    dependencies: ["cache:pluginsEnableStatesV2"],
    loader: async ({ "cache:pluginsEnableStatesV2": pluginsEnableStates }) => {
      if (!pluginsEnableStates["networkIntercept"]) return;

      void injectMainWorldScript({
        url: chrome.runtime.getURL(networkInterceptPlugin),
        head: true,
      });
    },
  });
}
