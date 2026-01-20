import { internalSearchStatesObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/internal-search-states/store";
import { spaRouteChangeCompleteSubscribe } from "@/entrypoints/contexts/content-scripts/core-plugins/spa-router/utils";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
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
