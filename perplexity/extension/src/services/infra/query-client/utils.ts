import type {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";

import { QueryCacheService } from "@/services/infra/query-client/indexed-db/service-init.bg-worker";
import { waitUntil } from "@/utils/misc/utils";

export async function createDexiePersister(idbKey: string): Promise<Persister> {
  const Db = QueryCacheService.Instance;

  await waitUntil({
    condition: Db.isInitialized,
    timeout: 30000,
    interval: 50,
  });

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
