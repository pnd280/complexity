import { cplxApiQueries } from "@/entrypoints/services/externals/cplx-api/query-keys";
import { getRemoteResource } from "@/entrypoints/services/externals/cplx-api/remote-resources/utils";
import { versionsRemoteResourceConfig } from "@/entrypoints/services/externals/cplx-api/remote-resources/versions/index.remote-resources";
import type PersistentQueryClient from "@/services/persistent-query-client";

export class CplxVersionsService {
  static query = cplxApiQueries.remoteResource.detail({
    resourcePath: versionsRemoteResourceConfig.resourcePath,
    zodSchema: versionsRemoteResourceConfig.zodSchema,
  });

  static async inlineQueryFn(persistentQueryClient: PersistentQueryClient) {
    return await getRemoteResource(
      versionsRemoteResourceConfig,
      persistentQueryClient,
    );
  }
}
