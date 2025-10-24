import { CplxApiService } from "@/services/externals/cplx-api";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";
import PersistentQueryClient from "@/services/infra/query-client";

export const persistentQueryClient = await (async () => {
  const persistentQueryClient = await PersistentQueryClient.create({
    id: "contentScript",
    includeKeys: [
      cplxApiQueries.all(),
      pplxApiQueries.spaces.all(),
      pplxApiQueries.threads.infinite.all(),
      pplxApiQueries.auth.all(),
      pplxApiQueries.auth.orgStatus.all(),
    ] as unknown as unknown[][],
    excludeKeys: [],
    busterFetchFn: CplxApiService.fetchQueryCacheBuster,
  });

  persistentQueryClient.queryClient.setQueryDefaults(cplxApiQueries.all(), {
    gcTime: Infinity,
    staleTime: 1000,
  });

  persistentQueryClient.queryClient.setQueryDefaults(
    cplxApiQueries.remoteResource.all(),
    {
      gcTime: Infinity,
      staleTime: 1000 * 60 * 60 * 12,
    },
  );

  persistentQueryClient.queryClient.setQueryDefaults(
    cplxApiQueries.versionedRemoteResource.all(),
    {
      gcTime: Infinity,
      staleTime: 1000 * 60 * 60 * 12,
    },
  );

  persistentQueryClient.queryClient.setQueryDefaults(
    pplxApiQueries.spaces.all(),
    {
      staleTime: 10000,
    },
  );

  persistentQueryClient.queryClient.setQueryDefaults(
    pplxApiQueries.auth.all(),
    {
      staleTime: 5000,
    },
  );

  persistentQueryClient.queryClient.setQueryDefaults(
    pplxApiQueries.auth.orgStatus.all(),
    {
      staleTime: 5000,
    },
  );

  await persistentQueryClient.restoreQueryClient();

  return persistentQueryClient;
})();
