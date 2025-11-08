import { QueryObserver } from "@tanstack/react-query";

import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-client";
import { pluginGuardsStore } from "@/plugins/__async-deps__/plugins-guard/store";
import { imageGenModelSelectorStore } from "@/plugins/image-gen-model-selector/store";
import { isImageModelCode } from "@/services/externals/cplx-api/remote-resources/pplx-image-models/types";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:imageGenModelSelector:initStore": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:imageGenModelSelector:initStore",
    dependencies: ["cache:pluginsEnableStates"],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
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
