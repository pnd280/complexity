import { QueryCacheService } from "@/entrypoints/core-plugins/persistent-query-client/service-init.bg-worker";
import { CplxApiService } from "@/entrypoints/services/externals/cplx-api";
import { cplxApiQueries } from "@/entrypoints/services/externals/cplx-api/query-keys";
import { pplxApiQueries } from "@/entrypoints/services/externals/pplx-api/query-keys";
import PersistentQueryClient from "@/services/persistent-query-client";

export const persistentQueryClient = await (async () => {
  const persistentQueryClient = await PersistentQueryClient.create({
    id: "contentScript",
    db: QueryCacheService.Instance,
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
    staleTime: ms("1s"),
  });

  persistentQueryClient.queryClient.setQueryDefaults(
    cplxApiQueries.remoteResource.all(),
    {
      gcTime: Infinity,
      staleTime: ms("12h"),
    },
  );

  persistentQueryClient.queryClient.setQueryDefaults(
    cplxApiQueries.versionedRemoteResource.all(),
    {
      gcTime: Infinity,
      staleTime: ms("12h"),
    },
  );

  persistentQueryClient.queryClient.setQueryDefaults(
    pplxApiQueries.spaces.all(),
    {
      staleTime: ms("10s"),
    },
  );

  persistentQueryClient.queryClient.setQueryDefaults(
    pplxApiQueries.auth.all(),
    {
      staleTime: ms("5s"),
    },
  );

  persistentQueryClient.queryClient.setQueryDefaults(
    pplxApiQueries.auth.orgStatus.all(),
    {
      staleTime: ms("5s"),
    },
  );

  await persistentQueryClient.restore();

  return persistentQueryClient;
})();
