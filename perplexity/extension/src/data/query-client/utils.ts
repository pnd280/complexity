import type { Query, QueryClient } from "@tanstack/react-query";
import {
  persistQueryClientSave,
  type Persister,
} from "@tanstack/react-query-persist-client";
import type { PersistedClient } from "@tanstack/react-query-persist-client";
import { storage } from "@wxt-dev/storage";
import debounce from "lodash/debounce";

import { APP_CONFIG } from "@/app.config";
import { getQueryCacheService } from "@/data/query-client/indexed-db/service-init.bg-worker";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";
import { isSubArray } from "@/utils/utils";

export type QueryCacheEntry = {
  key: string;
  clientData: PersistedClient;
  timestamp: number;
};

export const softCacheBusterKey = "local:cdnCacheBuster";

export const persister = await createDexiePersister();

async function createDexiePersister(idbValidKey = "reactQuery") {
  const db = getQueryCacheService();

  return {
    persistClient: async (client: PersistedClient) => {
      try {
        await db.update(idbValidKey, {
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
        const item = await db.get(idbValidKey);

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
        await db.delete(idbValidKey);
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

    persistQueryClientSave({
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
] as unknown as any[][];

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
}

function shouldDehydrateQuery(query: Query) {
  const queryKey = query.queryKey;

  if (EXCLUDE_KEYS.some((exclude) => queryKey.includes(exclude))) {
    return false;
  }

  const shouldPersist = INCLUDE_KEYS.some(
    (query) => Array.isArray(queryKey) && isSubArray(query, queryKey),
  );

  return shouldPersist;
}

export async function invalidateQueryClientCache({
  newCacheBuster,
}: {
  newCacheBuster?: string;
} = {}) {
  storage.setItem(softCacheBusterKey, newCacheBuster ?? "invalidated");
  getQueryCacheService().delete("reactQuery");
}
