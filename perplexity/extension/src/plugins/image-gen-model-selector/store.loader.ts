import { QueryObserver } from "@tanstack/react-query";

import { queryClient } from "@/data/query-client";
import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { imageGenModelSelectorStore } from "@/plugins/image-gen-model-selector/store";
import { isImageModelCode } from "@/services/externals/cplx-api/remote-resources/pplx-image-models/types";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:imageGenModelSelector:initStore": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "plugin:imageGenModelSelector:initStore",
    dependencies: ["cache:pluginsStates"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["imageGenModelSelector"]) return;

      initImageGenModelSelectorStore();
    },
  });
}

async function initImageGenModelSelectorStore() {
  const unsubscribe = new QueryObserver(
    queryClient,
    pplxApiQueries.userSettings.detail(true),
  ).subscribe((data) => {
    if (data.data) {
      imageGenModelSelectorStore.setState((state) => {
        state.selectedImageGenModel = isImageModelCode(
          data.data.default_image_generation_model,
        )
          ? data.data.default_image_generation_model
          : "default";
      });

      unsubscribe();
    }
  });
}
