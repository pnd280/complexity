import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { PplxLanguageModelsService } from "@/services/externals/cplx-api/remote-resources/pplx-language-models";
import type { LanguageModelsList } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "cache:languageModels": LanguageModelsList;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "cache:languageModels",
    dependencies: ["cache:pluginsStates"],
    loader: async ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["queryBox:languageModelSelector"])
        return PplxLanguageModelsService.localModels;

      const data = await PplxLanguageModelsService.inlineQueryFn();

      PplxLanguageModelsService.allModels = data;

      return data;
    },
  });
}
