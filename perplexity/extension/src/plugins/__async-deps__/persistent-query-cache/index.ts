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

  await persistentQueryClient.restoreQueryClient();

  return persistentQueryClient;
})();
