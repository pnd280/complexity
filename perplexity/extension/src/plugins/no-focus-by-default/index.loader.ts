import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/__core__/_main-world/spa-router/utils";
import { internalSearchStatesObserverStore } from "@/plugins/__core__/dom-observers/internal-search-states/store";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:noFocusByDefault": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:queryBox:noFocusByDefault",
    dependencies: [
      "cache:pluginsEnableStates",
      "corePlugin:domObservers:mainWorldActions",
    ],
    loader: async ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["noFocusByDefault"]) return;

      spaRouteChangeCompleteSubscribe(
        async (url) => {
          const location = whereAmI(url);

          if (location !== "home") return;

          internalSearchStatesObserverStore.getState().setInternalSearchStates({
            sources: [],
          });
        },
        {
          immediate: true,
        },
      );
    },
  });
}
