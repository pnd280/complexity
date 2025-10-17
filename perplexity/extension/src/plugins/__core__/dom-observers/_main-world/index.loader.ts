import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { DomObserversMainWorldActions } from "@/plugins/__core__/dom-observers/_main-world";
import { injectMainWorldScript } from "@/utils/dom-utils/generics";
import { waitUntil } from "@/utils/misc/utils";

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

      await waitUntil({
        condition: DomObserversMainWorldActions.Instance.isInitialized,
        timeout: 5000,
        interval: 50,
      });
    },
  });
}
