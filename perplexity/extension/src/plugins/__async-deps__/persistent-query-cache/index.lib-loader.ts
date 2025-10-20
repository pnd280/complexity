import { persistQueryClientRestore } from "@tanstack/react-query-persist-client";
import { storage } from "@wxt-dev/storage";

import { APP_CONFIG } from "@/app.config";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";
import PersistentQueryClient from "@/services/infra/query-client";
import { createDexiePersister } from "@/services/infra/query-client/utils";

const softCacheBusterKey = "local:reactQuery:contentScript";

export const persistentQueryClient = await (async () => {
  const persistentQueryClient = new PersistentQueryClient({
    idbKey: "reactQuery:contentScript",
    persister: await createDexiePersister("reactQuery:contentScript"),
    softCacheBusterKey,
    includeKeys: [
      cplxApiQueries.all(),
      pplxApiQueries.spaces.all(),
      pplxApiQueries.threads.infinite.detail({
        initialPageParam: 0,
        searchValue: "",
      }).queryKey,
      pplxApiQueries.auth.all(),
    ] as unknown as string[],
    excludeKeys: [
      cplxApiQueries.cacheBuster.detail().queryKey,
    ] as unknown as string[],
  });

  const softCacheBuster = await storage.getItem<string>(softCacheBusterKey);

  if (softCacheBuster) {
    persistentQueryClient.currentSeshSoftCacheBuster = softCacheBuster;
  }

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

  try {
    await persistQueryClientRestore({
      queryClient: persistentQueryClient.queryClient,
      persister: persistentQueryClient.persister,
      buster: APP_CONFIG.VERSION,
      maxAge: 1000 * 60 * 60 * 24,
    });
  } catch (error) {
    console.error(
      "[CPLX:PersistentQueryClient:contentScript] Error restoring Query Client:",
      error,
    );
  }

  return persistentQueryClient;
})();
