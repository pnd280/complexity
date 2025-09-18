import semver from "semver";

import { APP_CONFIG } from "@/app.config";
import { queryClient } from "@/data/query-client";
import { persistQueryClient } from "@/data/query-client/utils";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import { VersionedRemoteResourceListingSchema } from "@/services/externals/cplx-api/versioned-remote-resources/types";
import type { VersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/types";
import { errorWrapper } from "@/utils/error-wrapper";

export async function getVersionedRemoteResource<T>(
  resourceConfig: VersionedRemoteResource<T>,
): Promise<T> {
  if (APP_CONFIG.IS_DEV) return resourceConfig.fallback;

  if (APP_CONFIG.CPLX_CDN_URL == null) return resourceConfig.fallback;

  const entry = await getResourceEntry(resourceConfig);

  if (entry == null) return resourceConfig.fallback;

  const [resource, error] = await errorWrapper(() =>
    queryClient.fetchQuery({
      ...cplxApiQueries.versionedRemoteResource.detail({
        resourcePath: `${resourceConfig.name}/${entry}`,
        zodSchema: resourceConfig.zodSchema,
      }),
      retry: false,
    }),
  )();

  persistQueryClient({ queryClient });

  if (error) return resourceConfig.fallback;

  return resource;
}

async function getResourceEntry<T>(
  resourceConfig: VersionedRemoteResource<T>,
): Promise<string | null> {
  const [listing, error] = await errorWrapper(
    async () =>
      await queryClient.fetchQuery(
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
