import type { Query, QueryClient } from "@tanstack/react-query";
import {
  persistQueryClientSave,
  type Persister,
} from "@tanstack/react-query-persist-client";
import type { PersistedClient } from "@tanstack/react-query-persist-client";
import debounce from "lodash/debounce";

import { APP_CONFIG } from "@/app.config";
import { getQueryCacheProxyService } from "@/data/query-client/indexed-db/proxy";
import { getQueryCacheService } from "@/data/query-client/indexed-db/proxy-register.bg-worker";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";
import { isBackgroundScript, isSubArray } from "@/utils/utils";

export type QueryCacheEntry = {
  key: string;
  clientData: PersistedClient;
  timestamp: number;
};

export const persister = await createDexiePersister();

async function createDexiePersister(idbValidKey = "reactQuery") {
  const db = isBackgroundScript()
    ? getQueryCacheService()
    : getQueryCacheProxyService();

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

export const persistRemoteResources = debounce(
  async ({ queryClient }: { queryClient: QueryClient }) => {
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

function shouldDehydrateQuery(query: Query) {
  const queryKey = query.queryKey;

  const excludes = [cplxApiQueries.cacheBuster.detail().queryKey];

  if (excludes.some((exclude) => queryKey.includes(exclude))) {
    return false;
  }

  const includes = [
    cplxApiQueries.all(),
    pplxApiQueries.spaces.all(),
    pplxApiQueries.threads.infinite.detail({
      initialPageParam: 0,
      searchValue: "",
    }).queryKey,
  ] as unknown as any[][];

  const shouldPersist = includes.some(
    (query) => Array.isArray(queryKey) && isSubArray(query, queryKey),
  );

  return shouldPersist;
}

export async function removeCachedRemoteResources({
  queryClient,
}: {
  queryClient: QueryClient;
}) {
  queryClient.removeQueries({
    queryKey: cplxApiQueries.all(),
  });

  // queryClient.removeQueries({
  //   queryKey: cplxApiQueries.remoteResource.all(),
  // });

  // queryClient.removeQueries({
  //   queryKey: cplxApiQueries.versionedRemoteResource.all(),
  // });

  persistRemoteResources({ queryClient });
}
