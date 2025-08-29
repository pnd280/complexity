import { defineRemoteResource } from "@/services/externals/cplx-api/remote-resources";
import { pplxLocalLanguageModels } from "@/services/externals/cplx-api/remote-resources/pplx-language-models/defaults";
import {
  LanguageModelsListSchema,
  type LanguageModelsList,
} from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";

export const pplxLanguageModelsResourceConfig = defineRemoteResource({
  resourcePath: "language-models.json",
  type: "json",
  fallback: pplxLocalLanguageModels as unknown as LanguageModelsList,
  zodSchema: LanguageModelsListSchema,
});
