import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/__core__/_main-world/spa-router/utils";
import { internalSearchStatesObserverStore } from "@/plugins/__core__/dom-observers/internal-search-states/store";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:connectorsAlwaysOn": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:queryBox:connectorsAlwaysOn",
    dependencies: [
      "cache:pluginsEnableStates",
      "cache:extensionSettings",
      "corePlugin:domObservers:mainWorldActions",
    ],
    loader: async ({
      "cache:pluginsEnableStates": pluginsEnableStates,
      "cache:extensionSettings": extensionSettings,
    }) => {
      if (!pluginsEnableStates["connectorsAlwaysOn"]) return;

      const settings = extensionSettings.plugins["connectorsAlwaysOn"];
      const connectorsToEnable = settings.connectors;

      spaRouteChangeCompleteSubscribe(
        async (url) => {
          const location = whereAmI(url);

          // Only apply to home page, not spaces
          if (location !== "home") return;

          // Get current sources
          const currentState = internalSearchStatesObserverStore.getState();
          let currentSources = currentState.sources;

          // If sources is empty (Perplexity hasn't initialized yet), use web as default
          if (currentSources.length === 0) {
            currentSources = ["web"];
          }

          // Add all configured connectors that aren't already present
          const connectorsToAdd = connectorsToEnable.filter(
            (connector) => !currentSources.includes(connector),
          );

          if (connectorsToAdd.length > 0) {
            const updatedSources = [...currentSources, ...connectorsToAdd];
            internalSearchStatesObserverStore.getState().setInternalSearchStates({
              sources: updatedSources,
            });
            console.log(
              "[Complexity] Added connectors to sources:",
              connectorsToAdd,
              "-> Result:",
              updatedSources,
            );
          } else {
            console.log("[Complexity] All configured connectors already enabled");
          }
        },
        {
          immediate: true,
        },
      );
    },
  });
}
