import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-client";
import { PplxLanguageModelsService } from "@/services/externals/cplx-api/remote-resources/pplx-language-models";
import type { LanguageModelsList } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

declare module "@/plugins/__async-deps__/async-loaders" {
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
