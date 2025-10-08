import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { injectMainWorldScript } from "@/utils/dom-utils/generics";

import mermaidRendererPlugin from "@/plugins/thread-artifacts/mermaid-renderer/index?script&module";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:mainWorld:mermaidRenderer": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:mainWorld:mermaidRenderer",
    dependencies: ["cache:pluginsEnableStates", "cache:domSelectors"],
    loader: async ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["thread:artifacts"]) return;

      void injectMainWorldScript({
        url: chrome.runtime.getURL(mermaidRendererPlugin),
        head: true,
      });
    },
  });
}
