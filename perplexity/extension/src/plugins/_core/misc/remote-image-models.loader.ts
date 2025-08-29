import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { PplxImageModelsService } from "@/services/externals/cplx-api/remote-resources/pplx-image-models";
import type { ImageModel } from "@/services/externals/cplx-api/remote-resources/pplx-image-models/types";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "cache:imageModels": ImageModel[];
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "cache:imageModels",
    dependencies: ["cache:pluginsStates"],
    loader: async ({ "cache:pluginsStates": pluginsStates }) => {
      const localModels =
        PplxImageModelsService.localModels as unknown as ImageModel[];

      if (!pluginsStates["imageGenModelSelector"]) return localModels;

      const data = await PplxImageModelsService.inlineQueryFn();

      PplxImageModelsService.allModels = data;

      return data;
    },
  });
}
