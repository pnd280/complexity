import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { injectMainWorldScript } from "@/utils/dom-utils/generics";

import DomObserverActionsListener from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/_main-world/index?script&module";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:domObservers:mainWorldActions": Promise<void>;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:domObservers:mainWorldActions",
    dependencies: ["cache:domSelectors"],
    loader: async () => {
      void injectMainWorldScript({
        url: chrome.runtime.getURL(DomObserverActionsListener),
        head: true,
      });
    },
  });
}
