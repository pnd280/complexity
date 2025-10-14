import type { Query, QueryClient } from "@tanstack/react-query";
import {
  persistQueryClientSave,
  type Persister,
} from "@tanstack/react-query-persist-client";
import type { PersistedClient } from "@tanstack/react-query-persist-client";
import { storage } from "@wxt-dev/storage";
import debounce from "lodash/debounce";

import { APP_CONFIG } from "@/app.config";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";
import { QueryCacheService } from "@/services/infra/query-client/indexed-db/service-init.bg-worker";
import { isSubArray, waitUntil } from "@/utils/misc/utils";

export type QueryCacheEntry = {
  key: string;
  clientData: PersistedClient;
  timestamp: number;
};

export const softCacheBusterKey = "local:cdnCacheBuster";

export const persister = await createDexiePersister();

async function createDexiePersister(idbValidKey = "reactQuery") {
  const Db = QueryCacheService.Instance;

  const startTime = performance.now();

  await waitUntil({
    condition: Db.isInitialized,
    timeout: 30000,
    interval: 50,
  });

  const endTime = performance.now();

  console.log(`[CPLX] DexiePersister initialized in ${endTime - startTime}ms`);

  return {
    persistClient: async (client: PersistedClient) => {
      try {
        await Db.update(idbValidKey, {
          key: idbValidKey,
          clientData: client,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error("Failed to persist query client:", error);
      }
    },
    restoreClient: async () => {
      try {
        const item = await Db.get(idbValidKey);

        if (!item?.clientData) {
          return undefined;
        }

        return item.clientData;
      } catch (error) {
        console.error("Failed to restore query client:", error);
        return undefined;
      }
    },
    removeClient: async () => {
      try {
        await Db.delete(idbValidKey);
      } catch (error) {
        console.error("Failed to remove query client:", error);
      }
    },
  } satisfies Persister;
}

let isFreshSession = true;

export const persistQueryClient = debounce(
  async ({ queryClient }: { queryClient: QueryClient }) => {
    const isForcefullyInvalidated = await storage.getItem(softCacheBusterKey);

    if (!isFreshSession && isForcefullyInvalidated === "invalidated") {
      console.log("[CPLX] Cache forcefully invalidated. Wont persist.");
      return;
    }

    isFreshSession = false;

    void persistQueryClientSave({
      queryClient,
      persister,
      buster: APP_CONFIG.VERSION,
      dehydrateOptions: {
        shouldDehydrateQuery,
      },
    });
  },
  300,
);

const EXCLUDE_KEYS = [cplxApiQueries.cacheBuster.detail().queryKey];

const INCLUDE_KEYS = [
  cplxApiQueries.all(),
  pplxApiQueries.spaces.all(),
  pplxApiQueries.threads.infinite.detail({
    initialPageParam: 0,
    searchValue: "",
  }).queryKey,
  pplxApiQueries.auth.all(),
];

export function setQueriesDefaults(queryClient: QueryClient) {
  queryClient.setQueryDefaults(cplxApiQueries.all(), {
    gcTime: Infinity,
    staleTime: 1000,
  });

  queryClient.setQueryDefaults(cplxApiQueries.remoteResource.all(), {
    gcTime: Infinity,
    staleTime: 1000 * 60 * 60 * 12,
  });

  queryClient.setQueryDefaults(cplxApiQueries.versionedRemoteResource.all(), {
    gcTime: Infinity,
    staleTime: 1000 * 60 * 60 * 12,
  });

  queryClient.setQueryDefaults(pplxApiQueries.spaces.all(), {
    staleTime: 10000,
  });

  queryClient.setQueryDefaults(pplxApiQueries.auth.all(), {
    staleTime: 5000,
  });
}

function shouldDehydrateQuery(query: Query) {
  const queryKey = query.queryKey;

  if (EXCLUDE_KEYS.some((exclude) => queryKey.includes(exclude))) {
    return false;
  }

  const shouldPersist = INCLUDE_KEYS.some(
    (query) =>
      Array.isArray(queryKey) &&
      isSubArray(query as unknown as unknown[], queryKey),
  );

  return shouldPersist;
}

export async function invalidateQueryClientCache({
  newCacheBuster,
}: {
  newCacheBuster?: string;
} = {}) {
  void storage.setItem(softCacheBusterKey, newCacheBuster ?? "invalidated");
  void QueryCacheService.Instance.delete("reactQuery");
}
