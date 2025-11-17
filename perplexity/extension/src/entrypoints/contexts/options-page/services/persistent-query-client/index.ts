import { QueryCacheService } from "@/entrypoints/core-plugins/persistent-query-client/service-init.bg-worker";
import { CplxApiService } from "@/entrypoints/services/externals/cplx-api";
import { cplxApiQueries } from "@/entrypoints/services/externals/cplx-api/query-keys";
import PersistentQueryClient from "@/services/persistent-query-client";

export const persistentQueryClient = await (async () => {
  const persistentQueryClient = await PersistentQueryClient.create({
    id: "optionsPage",
    db: QueryCacheService.Instance,
    includeKeys: [cplxApiQueries.all()] as unknown as unknown[][],
    excludeKeys: [],
    busterFetchFn: CplxApiService.fetchQueryCacheBuster,
  });

  persistentQueryClient.queryClient.setQueryDefaults(cplxApiQueries.all(), {
    gcTime: Infinity,
    staleTime: ms("5s"),
  });

  await persistentQueryClient.restore();

  return persistentQueryClient;
})();
