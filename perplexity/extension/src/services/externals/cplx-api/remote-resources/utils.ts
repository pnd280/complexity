import { APP_CONFIG } from "@/app.config";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import type { RemoteResource } from "@/services/externals/cplx-api/remote-resources/types";
import { queryClient } from "@/services/infra/query-client";
import { persistQueryClient } from "@/services/infra/query-client/utils";
import { errorWrapper } from "@/utils/error-wrapper";

export async function getRemoteResource<T>(
  resourceConfig: RemoteResource<T>,
): Promise<T> {
  if (APP_CONFIG.IS_DEV) return resourceConfig.fallback;

  if (APP_CONFIG.CPLX_CDN_URL == null) return resourceConfig.fallback;

  const [resource, error] = await errorWrapper(() =>
    queryClient.fetchQuery({
      ...cplxApiQueries.remoteResource.detail({
        resourcePath: resourceConfig.resourcePath,
        zodSchema: resourceConfig.zodSchema,
      }),
      retry: false,
    }),
  )();

  if (error) return resourceConfig.fallback;

  persistQueryClient({ queryClient });

  return resource;
}
