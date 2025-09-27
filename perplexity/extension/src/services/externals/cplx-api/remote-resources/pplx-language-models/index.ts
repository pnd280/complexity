import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import { pplxLocalLanguageModels } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/defaults";
import { LanguageModelIcons } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/icons";
import { pplxLanguageModelsResourceConfig } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/index.remote-resources";
import {
  type LanguageModel,
  type LanguageModelsList,
} from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import { getRemoteResource } from "@/services/externals/cplx-api/remote-resources/utils";

export class PplxLanguageModelsService {
  static get query() {
    return cplxApiQueries.remoteResource.detail({
      resourcePath: pplxLanguageModelsResourceConfig.resourcePath,
      zodSchema: pplxLanguageModelsResourceConfig.zodSchema,
    });
  }

  static inlineQueryFn() {
    return getRemoteResource(pplxLanguageModelsResourceConfig);
  }

  static localModels: LanguageModelsList =
    pplxLocalLanguageModels as unknown as LanguageModelsList;

  static allModels: LanguageModelsList = PplxLanguageModelsService.localModels;

  static allModelsFlat: LanguageModel[] = Object.values(
    PplxLanguageModelsService.allModels,
  ).flat();

  static icons = LanguageModelIcons;
}
