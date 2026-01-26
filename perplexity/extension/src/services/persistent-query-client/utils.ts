import type { Query } from "@tanstack/react-query";
import {
  type PersistedClient,
  type Persister,
} from "@tanstack/react-query-persist-client";
import { persistQueryClientSave } from "@tanstack/react-query-persist-client";
import debounce from "lodash/debounce";

import type { Db } from "@/services/persistent-query-client/types";
import type { PersistQueryClientParams } from "@/services/persistent-query-client/types";
import { isSubArray } from "@/utils/misc/utils";

export function createDexiePersister({
  db,
  idbKey,
}: {
  db: Db;
  idbKey: string;
}): Persister {
  return {
    persistClient: async (client: PersistedClient) => {
      try {
        await db.update(idbKey, {
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
        const item = await db.get(idbKey);

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
        await db.delete(idbKey);
      } catch (error) {
        console.error(
          `[CPLX:createDexiePersister:${idbKey}] Failed to remove query client:`,
          error,
        );
      }
    },
  };
}

export function getCacheBusterStorageKey<const T extends string>(
  id: T,
): `local:service:persistentQueryClient:queryCacheBuster:${T}` {
  return `local:service:persistentQueryClient:queryCacheBuster:${id}`;
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
  }: PersistQueryClientParams) => {
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
