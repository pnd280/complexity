import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { injectMainWorldScript } from "@/utils/dom-utils/generics";

import spaRouterPlugin from "@/plugins/__core__/_main-world/spa-router/index?script&module";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:mainWorld:spaRouter": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:mainWorld:spaRouter",
    dependencies: [
      "cache:corePlugins:enableStates",
      "cache:domSelectors",
      "corePlugin:mainWorld:spaRouter:listeners",
    ],
    loader: async ({
      "cache:corePlugins:enableStates": corePluginsEnableStates,
    }) => {
      if (!corePluginsEnableStates["spaRouter"]) return;

      void injectMainWorldScript({
        url: chrome.runtime.getURL(spaRouterPlugin),
        head: true,
      });
    },
  });
}
