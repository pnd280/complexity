import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { injectMainWorldScript } from "@/utils/dom-utils/generics";

import DomObserverActionsListener from "@/plugins/__core__/dom-observers/_main-world/index?script&module";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:domObservers:mainWorldActions": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:domObservers:mainWorldActions",
    dependencies: ["cache:corePlugins:enableStates", "cache:domSelectors"],
    loader: ({ "cache:corePlugins:enableStates": _enableStates }) => {
      injectMainWorldScript({
        url: chrome.runtime.getURL(DomObserverActionsListener),
        head: true,
      });
    },
  });
}
