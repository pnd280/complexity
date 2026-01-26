import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { PplxLanguageModelsService } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models";
import type { LanguageModelsList } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "cache:languageModels": LanguageModelsList;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "cache:languageModels",
    dependencies: ["cache:pluginsEnableStates"],
    loader: async ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["queryBox:languageModelSelector"])
        return PplxLanguageModelsService.localModels;

      const data = await PplxLanguageModelsService.inlineQueryFn(
        persistentQueryClient,
      );

      PplxLanguageModelsService.allModels = data;

      return data;
    },
  });
}
