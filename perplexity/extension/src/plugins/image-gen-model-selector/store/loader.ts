import { QueryObserver } from "@tanstack/react-query";

import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { pluginGuardsStore } from "@/entrypoints/contexts/content-scripts/services/ui-guard/store";
import { isImageModelCode } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-image-models/types";
import { pplxApiQueries } from "@/entrypoints/services/externals/pplx-api/query-keys";
import { imageGenModelSelectorStore } from "@/plugins/image-gen-model-selector/store";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:imageGenModelSelector:initStore": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:imageGenModelSelector:initStore",
    dependencies: ["cache:pluginsEnableStatesV2"],
    loader: ({ "cache:pluginsEnableStatesV2": pluginsEnableStates }) => {
      if (!pluginsEnableStates["imageGenModelSelector"]) return;

      initImageGenModelSelectorStore();
    },
  });
}

function initImageGenModelSelectorStore() {
  const unsubscribeLoginGuard = pluginGuardsStore.subscribe(
    (store) => store.isLoggedIn,
    (isLoggedIn) => {
      if (isLoggedIn === false) return;

      setTimeout(() => {
        unsubscribeLoginGuard();
      }, 0);

      const unsubscribeQuery = new QueryObserver(
        persistentQueryClient.queryClient,
        pplxApiQueries.userSettings.detail(true),
      ).subscribe((data) => {
        if (data.data) {
          setTimeout(() => {
            unsubscribeQuery();
          }, 0);

          imageGenModelSelectorStore.setState((state) => {
            state.model = isImageModelCode(
              data.data.default_image_generation_model,
            )
              ? data.data.default_image_generation_model
              : "default";
          });
        }
      });
    },
    {
      fireImmediately: true,
    },
  );
}
