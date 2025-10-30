import { APP_CONFIG } from "@/app.config";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import type { RemoteResource } from "@/services/externals/cplx-api/remote-resources/types";
import type PersistentQueryClient from "@/services/infra/query-client";

export async function getRemoteResource<T>(
  resourceConfig: RemoteResource<T>,
  persistentQueryClient: PersistentQueryClient,
): Promise<T> {
  if (APP_CONFIG.IS_DEV || APP_CONFIG.CPLX_CDN_URL == null)
    return resourceConfig.fallback;

  const [resource, error] = await tryCatch(() =>
    persistentQueryClient.queryClient.fetchQuery({
      ...cplxApiQueries.remoteResource.detail({
        resourcePath: resourceConfig.resourcePath,
        zodSchema: resourceConfig.zodSchema,
      }),
      retry: false,
    }),
  );

  if (error) return resourceConfig.fallback;

  void persistentQueryClient.persistQueryClient();

  return resource;
}
