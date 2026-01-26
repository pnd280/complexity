import { cplxApiQueries } from "@/entrypoints/services/externals/cplx-api/query-keys";
import { pplxLocalLanguageModels } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/defaults";
import { LanguageModelIcons } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/icons";
import { pplxLanguageModelsResourceConfig } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/index.remote-resources";
import {
  type LanguageModel,
  type LanguageModelsList,
} from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import { getRemoteResource } from "@/entrypoints/services/externals/cplx-api/remote-resources/utils";
import type PersistentQueryClient from "@/services/persistent-query-client";

export class PplxLanguageModelsService {
  static get query() {
    return cplxApiQueries.remoteResource.detail({
      resourcePath: pplxLanguageModelsResourceConfig.resourcePath,
      zodSchema: pplxLanguageModelsResourceConfig.zodSchema,
    });
  }

  static inlineQueryFn(persistentQueryClient: PersistentQueryClient) {
    return getRemoteResource(
      pplxLanguageModelsResourceConfig,
      persistentQueryClient,
    );
  }

  static localModels: LanguageModelsList =
    pplxLocalLanguageModels as unknown as LanguageModelsList;

  static allModels: LanguageModelsList = PplxLanguageModelsService.localModels;

  static allModelsFlat: LanguageModel[] = Object.values(
    PplxLanguageModelsService.allModels,
  ).flat();

  static icons = LanguageModelIcons;
}
