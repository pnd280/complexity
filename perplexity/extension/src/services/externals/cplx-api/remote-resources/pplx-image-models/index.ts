import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import { pplxLocalImageModels } from "@/services/externals/cplx-api/remote-resources/pplx-image-models/defaults";
import { imageModelIcons } from "@/services/externals/cplx-api/remote-resources/pplx-image-models/icons";
import { pplxImageModelsResourceConfig } from "@/services/externals/cplx-api/remote-resources/pplx-image-models/index.remote-resources";
import type { ImageModel } from "@/services/externals/cplx-api/remote-resources/pplx-image-models/types";
import { getRemoteResource } from "@/services/externals/cplx-api/remote-resources/utils";
import type PersistentQueryClient from "@/services/infra/query-client";

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
