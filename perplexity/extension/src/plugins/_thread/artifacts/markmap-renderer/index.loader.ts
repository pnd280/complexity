import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { injectMainWorldScript } from "@/utils/dom-utils/generics";

import markmapRendererPlugin from "@/plugins/_thread/artifacts/markmap-renderer/index?script&module";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:mainWorld:markmapRenderer": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:mainWorld:markmapRenderer",
    dependencies: ["cache:pluginsEnableStates", "cache:domSelectors"],
    loader: async ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["thread:artifacts"]) return;

      void injectMainWorldScript({
        url: chrome.runtime.getURL(markmapRendererPlugin),
        head: true,
      });
    },
  });
}
