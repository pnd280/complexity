import { cplxApiQueries } from "@/entrypoints/services/externals/cplx-api/query-keys";
import { pplxLocalImageModels } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-image-models/defaults";
import { imageModelIcons } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-image-models/icons";
import { pplxImageModelsResourceConfig } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-image-models/index.remote-resources";
import type { ImageModel } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-image-models/types";
import { getRemoteResource } from "@/entrypoints/services/externals/cplx-api/remote-resources/utils";
import type PersistentQueryClient from "@/services/persistent-query-client";

export class PplxImageModelsService {
  static get query() {
    return cplxApiQueries.remoteResource.detail({
      resourcePath: pplxImageModelsResourceConfig.resourcePath,
      zodSchema: pplxImageModelsResourceConfig.zodSchema,
    });
  }

  static inlineQueryFn(persistentQueryClient: PersistentQueryClient) {
    return getRemoteResource(
      pplxImageModelsResourceConfig,
      persistentQueryClient,
    );
  }

  static localModels = pplxLocalImageModels;

  static allModels: ImageModel[] = [...PplxImageModelsService.localModels];

  static icons = imageModelIcons;
}
