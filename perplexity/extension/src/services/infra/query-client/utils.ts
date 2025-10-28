import type { Query, QueryClient } from "@tanstack/react-query";
import {
  persistQueryClientSave,
  type PersistedClient,
  type Persister,
} from "@tanstack/react-query-persist-client";
import debounce from "lodash/debounce";

import { QueryCacheService } from "@/services/infra/query-client/indexed-db/service-init.bg-worker";
import { isSubArray } from "@/utils/misc/utils";

export function createDexiePersister(idbKey: string): Persister {
  const Db = QueryCacheService.Instance;

  return {
    persistClient: async (client: PersistedClient) => {
      try {
        await Db.update(idbKey, {
          key: idbKey,
          clientData: client,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error(
          `[CPLX:createDexiePersister:${idbKey}] Failed to persist query client:`,
          error,
        );
      }
    },
    restoreClient: async () => {
      try {
        const item = await Db.get(idbKey);

        if (!item?.clientData) {
          return undefined;
        }

        return item.clientData;
      } catch (error) {
        console.error(
          `[CPLX:createDexiePersister:${idbKey}] Failed to restore query client:`,
          error,
        );
        return undefined;
      }
    },
    removeClient: async () => {
      try {
        await Db.delete(idbKey);
      } catch (error) {
        console.error(
          `[CPLX:createDexiePersister:${idbKey}] Failed to remove query client:`,
          error,
        );
      }
    },
  };
}

function shouldDehydrateQuery(
  query: Query,
  {
    excludeKeys,
    includeKeys,
  }: {
    excludeKeys: unknown[][];
    includeKeys: unknown[][];
  },
): boolean {
  const queryKey = query.queryKey;

  // Only persist queries that are truly cacheable
  if (query.state.status !== "success") return false;

  if (excludeKeys.some((exclude) => queryKey.includes(exclude))) {
    return false;
  }

  const shouldPersist = includeKeys.some(
    (query) => Array.isArray(queryKey) && isSubArray(query, queryKey),
  );

  return shouldPersist;
}

export const debouncedPersistQueryClient = debounce(
  async ({
    queryClient,
    persister,
    buster,
    excludeKeys,
    includeKeys,
  }: {
    queryClient: QueryClient;
    persister: Persister;
    buster: string;
    excludeKeys: unknown[][];
    includeKeys: unknown[][];
  }) => {
    void persistQueryClientSave({
      queryClient,
      persister,
      buster,
      dehydrateOptions: {
        shouldDehydrateQuery: (query) =>
          shouldDehydrateQuery(query, { excludeKeys, includeKeys }),
        serializeData: (data) => {
          // Only persist the first page of infinite queries
          if (
            data != null &&
            typeof data === "object" &&
            "pages" in data &&
            "pageParams" in data &&
            Array.isArray(data.pages) &&
            Array.isArray(data.pageParams)
          ) {
            return {
              pages: [data.pages[0]],
              pageParams: [data.pageParams[0]],
            };
          }
          return data;
        },
      },
    });
  },
  300,
);
