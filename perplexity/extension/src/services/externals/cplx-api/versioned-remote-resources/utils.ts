import semver from "semver";

import { APP_CONFIG } from "@/app.config";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import { VersionedRemoteResourceListingSchema } from "@/services/externals/cplx-api/versioned-remote-resources/types";
import type { VersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/types";
import type PersistentQueryClient from "@/services/infra/query-client";
import { errorWrapper } from "@/utils/wrappers/error-wrapper";

export async function getVersionedRemoteResource<T>(
  resourceConfig: VersionedRemoteResource<T>,
  persistentQueryClient: PersistentQueryClient,
): Promise<T> {
  if (APP_CONFIG.IS_DEV || APP_CONFIG.CPLX_CDN_URL == null)
    return resourceConfig.fallback;

  const entry = await getResourceEntry(resourceConfig, persistentQueryClient);

  if (entry == null) return resourceConfig.fallback;

  const [resource, error] = await errorWrapper(() =>
    persistentQueryClient.queryClient.fetchQuery({
      ...cplxApiQueries.versionedRemoteResource.detail({
        resourcePath: `${resourceConfig.name}/${entry}`,
        zodSchema: resourceConfig.zodSchema,
      }),
      retry: false,
    }),
  )();

  void persistentQueryClient.persistQueryClient();

  if (error) return resourceConfig.fallback;

  return resource;
}

async function getResourceEntry<T>(
  resourceConfig: VersionedRemoteResource<T>,
  persistentQueryClient: PersistentQueryClient,
): Promise<string | null> {
  const [listing, error] = await errorWrapper(
    async () =>
      await persistentQueryClient.queryClient.fetchQuery(
        cplxApiQueries.versionedRemoteResource.detail({
          resourcePath: "listing.json",
          zodSchema: VersionedRemoteResourceListingSchema,
        }),
      ),
  )();

  if (error) return null;

  const resourceListing = listing[resourceConfig.name];

  if (resourceListing == null) return null;

  for (const [fileName, range] of Object.entries(resourceListing)) {
    if (!semver.satisfies(APP_CONFIG.VERSION, range)) continue;

    return fileName;
  }

  return null;
}
