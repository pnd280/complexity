import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { injectMainWorldScript } from "@/utils/dom-utils/generics";

import vdomActionsListener from "@/plugins/_thread/better-rewrite-dropdown/_main-world/index?script&module";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:thread:betterRewriteDropdowns:mainWorldActions": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:thread:betterRewriteDropdowns:mainWorldActions",
    dependencies: ["cache:pluginsEnableStatesV2", "cache:domSelectors"],
    loader: ({ "cache:pluginsEnableStatesV2": pluginsEnableStates }) => {
      if (!pluginsEnableStates["thread:betterRewriteDropdowns"]) return;

      void injectMainWorldScript({
        url: chrome.runtime.getURL(vdomActionsListener),
        head: true,
      });
    },
  });
}
