import { persistQueryClientRestore } from "@tanstack/react-query-persist-client";
import { storage } from "@wxt-dev/storage";

import { APP_CONFIG } from "@/app.config";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import PersistentQueryClient from "@/services/infra/query-client";
import { createDexiePersister } from "@/services/infra/query-client/utils";

const softCacheBusterKey = "local:reactQuery:optionsPage";

export const persistentQueryClient = await (async () => {
  const persistentQueryClient = new PersistentQueryClient({
    idbKey: "reactQuery:optionsPage",
    persister: await createDexiePersister("reactQuery:optionsPage"),
    softCacheBusterKey,
    includeKeys: [cplxApiQueries.all()] as unknown as string[],
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
    staleTime: 5000,
  });

  try {
    await persistQueryClientRestore({
      queryClient: persistentQueryClient.queryClient,
      persister: persistentQueryClient.persister,
      buster: APP_CONFIG.VERSION,
      maxAge: 1000 * 60 * 60 * 24,
    });
  } catch (error) {
    console.error(
      "[CPLX:PersistentQueryClient:optionsPage] Error restoring Query Client:",
      error,
    );
  }

  void persistentQueryClient.queryClient.ensureQueryData(
    cplxApiQueries.psa.detail(),
  );

  return persistentQueryClient;
})();
