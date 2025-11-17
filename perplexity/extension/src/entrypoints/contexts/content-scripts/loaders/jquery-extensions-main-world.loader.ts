import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { injectMainWorldScript } from "@/utils/dom-utils/generics";

import jqueryExtensions from "@/entrypoints/contexts/content-scripts/loaders/jquery-extensions.lib-loader?script&module";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "mainWorld:jqueryExtensions": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "mainWorld:jqueryExtensions",
    dependencies: [],
    loader: async () => {
      void injectMainWorldScript({
        url: chrome.runtime.getURL(jqueryExtensions),
        head: true,
        inject: true,
      });
    },
  });
}
