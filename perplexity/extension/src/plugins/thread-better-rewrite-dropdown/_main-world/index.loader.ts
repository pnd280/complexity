import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { injectMainWorldScript } from "@/utils/dom-utils/generics";

import vdomActionsListener from "@/plugins/thread-better-rewrite-dropdown/_main-world/index?script&module";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:thread:betterRewriteDropdowns:mainWorldActions": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:thread:betterRewriteDropdowns:mainWorldActions",
    dependencies: ["cache:pluginsEnableStates", "cache:domSelectors"],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["thread:betterRewriteDropdowns"]) return;

      injectMainWorldScript({
        url: chrome.runtime.getURL(vdomActionsListener),
        head: true,
      });
    },
  });
}
