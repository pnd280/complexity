import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-client";
import { PplxImageModelsService } from "@/services/externals/cplx-api/remote-resources/pplx-image-models";
import type { ImageModel } from "@/services/externals/cplx-api/remote-resources/pplx-image-models/types";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "cache:imageModels": ImageModel[];
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "cache:imageModels",
    dependencies: ["cache:pluginsEnableStates"],
    loader: async ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      const localModels =
        PplxImageModelsService.localModels as unknown as ImageModel[];

      if (!pluginsEnableStates["imageGenModelSelector"]) return localModels;

      const data = await PplxImageModelsService.inlineQueryFn(
        persistentQueryClient,
      );

      PplxImageModelsService.allModels = data;

      return data;
    },
  });
}
