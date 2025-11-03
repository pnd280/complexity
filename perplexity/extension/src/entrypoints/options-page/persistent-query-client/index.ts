import { CplxApiService } from "@/services/externals/cplx-api";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import PersistentQueryClient from "@/services/infra/query-client";

export const persistentQueryClient = await (async () => {
  const persistentQueryClient = await PersistentQueryClient.create({
    id: "optionsPage",
    includeKeys: [cplxApiQueries.all()] as unknown as unknown[][],
    excludeKeys: [],
    busterFetchFn: CplxApiService.fetchQueryCacheBuster,
  });

  persistentQueryClient.queryClient.setQueryDefaults(cplxApiQueries.all(), {
    gcTime: Infinity,
    staleTime: ms("5s"),
  });

  await persistentQueryClient.restoreQueryClient();

  return persistentQueryClient;
})();
