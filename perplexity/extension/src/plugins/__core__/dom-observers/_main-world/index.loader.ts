import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { injectMainWorldScript } from "@/utils/dom-utils/generics";

import DomObserverActionsListener from "@/plugins/__core__/dom-observers/_main-world/index?script&module";

declare module "@/plugins/__async-deps__/async-loaders" {
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
