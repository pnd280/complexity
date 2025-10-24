import { QueryClient } from "@tanstack/react-query";
import {
  persistQueryClientRestore,
  type Persister,
} from "@tanstack/react-query-persist-client";
import { storage } from "@wxt-dev/storage";
import debounce from "lodash/debounce";

import { APP_CONFIG } from "@/app.config";
import { QueryCacheService } from "@/services/infra/query-client/indexed-db/service-init.bg-worker";
import {
  createDexiePersister,
  debouncedPersistQueryClient,
} from "@/services/infra/query-client/utils";
import { waitUntil } from "@/utils/misc/utils";
import { errorWrapper } from "@/utils/wrappers/error-wrapper";

export default class PersistentQueryClient {
  id: string;
  queryClient: QueryClient;
  persister: Persister;
  includeKeys: unknown[][];
  excludeKeys: unknown[][];
  buster: string;
  sessionInvalidated: boolean = false;
  busterFetchFn: () => Promise<string>;

  private constructor(
    config: Pick<
      typeof PersistentQueryClient.prototype,
      "id" | "includeKeys" | "excludeKeys" | "busterFetchFn" | "buster"
    >,
  ) {
    this.id = config.id;
    this.queryClient = new QueryClient();
    this.persister = createDexiePersister(config.id);
    this.includeKeys = config.includeKeys;
    this.excludeKeys = config.excludeKeys;
    this.buster = config.buster;
    this.busterFetchFn = config.busterFetchFn;

    this.initInvalidator();
  }

  static async create(
    config: Pick<
      typeof PersistentQueryClient.prototype,
      "id" | "includeKeys" | "excludeKeys" | "busterFetchFn"
    >,
  ) {
    await waitUntil({
      condition: QueryCacheService.Instance.isInitialized,
      timeout: 30000,
      interval: 50,
    });

    let buster = await storage.getItem<string>(
      `local:queryCacheBuster:${config.id}`,
    );

    if (buster == null) {
      const [remoteBuster] = await errorWrapper(() => config.busterFetchFn())();
      buster = remoteBuster ?? APP_CONFIG.VERSION;
      void storage.setItem(`local:queryCacheBuster:${config.id}`, buster);
    }

    return new PersistentQueryClient({
      ...config,
      buster,
    });
  }

  persistQueryClient = async (): Promise<void> => {
    if (this.sessionInvalidated) {
      console.log(
        `[CPLX:PersistentQueryClient:${this.id}] Session invalidated, skipping persist`,
      );
      return;
    }

    try {
      await debouncedPersistQueryClient({
        queryClient: this.queryClient,
        persister: this.persister,
        buster: this.buster,
        excludeKeys: this.excludeKeys,
        includeKeys: this.includeKeys,
      });
    } catch (error) {
      console.error(
        `[CPLX:PersistentQueryClient:${this.id}] Error persisting Query Client:`,
        error,
      );
    }
  };

  restoreQueryClient = async () => {
    try {
      await persistQueryClientRestore({
        queryClient: this.queryClient,
        persister: this.persister,
        buster: this.buster,
        maxAge: 1000 * 60 * 60 * 24,
      });
    } catch (error) {
      console.error(
        `[CPLX:PersistentQueryClient:${this.id}] Error restoring Query Client:`,
        error,
      );
    }
  };

  wipeQueryCache = async (): Promise<void> => {
    void storage.removeItem(`local:queryCacheBuster:${this.id}`);
    void this.persister.removeClient();
  };

  private initInvalidator() {
    const remoteInvalidatorHandler = debounce(
      async () => {
        if (this.sessionInvalidated) return;

        if (document.visibilityState === "visible") {
          const [remoteBuster] = await errorWrapper(this.busterFetchFn)();

          if (remoteBuster != null && remoteBuster !== this.buster) {
            console.log(
              `[CPLX:PersistentQueryClient:${this.id}] Invalidate query cache. Reason: remote buster changed.`,
            );

            this.sessionInvalidated = true;
            this.buster = remoteBuster;
            void this.wipeQueryCache();
            void storage.setItem(
              `local:queryCacheBuster:${this.id}`,
              remoteBuster,
            );
          }
        }
      },
      5000,
      {
        leading: true,
        trailing: true,
        maxWait: 5000,
      },
    );

    document.addEventListener("visibilitychange", remoteInvalidatorHandler);
    void remoteInvalidatorHandler();

    storage.watch(`local:queryCacheBuster:${this.id}`, (value) => {
      if (this.sessionInvalidated || value != null) return;

      console.log(
        `[CPLX:PersistentQueryClient:${this.id}] Invalidate query cache. Reason: cache wiped.`,
      );

      this.sessionInvalidated = true;
    });
  }
}
