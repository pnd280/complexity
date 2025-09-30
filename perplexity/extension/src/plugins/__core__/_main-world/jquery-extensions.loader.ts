import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { injectMainWorldScript } from "@/utils/dom-utils/generics";

import jqueryExtensions from "@/plugins/__async-deps__/misc/jquery-extensions.lib-loader?script&module";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "mainWorld:jqueryExtensions": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "mainWorld:jqueryExtensions",
    dependencies: [],
    loader: async () => {
      injectMainWorldScript({
        url: chrome.runtime.getURL(jqueryExtensions),
        head: true,
        inject: true,
      });
    },
  });
}
