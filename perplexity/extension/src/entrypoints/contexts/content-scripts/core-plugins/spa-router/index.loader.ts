import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { injectMainWorldScript } from "@/utils/dom-utils/generics";

import spaRouterPlugin from "@/entrypoints/contexts/content-scripts/core-plugins/spa-router/index?script&module";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:mainWorld:spaRouter": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:mainWorld:spaRouter",
    dependencies: [
      "cache:pluginsEnableStates",
      "cache:domSelectors",
      "corePlugin:mainWorld:spaRouter:listeners",
    ],
    loader: async ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["spaRouter"]) return;

      void injectMainWorldScript({
        url: chrome.runtime.getURL(spaRouterPlugin),
        head: true,
      });
    },
  });
}
