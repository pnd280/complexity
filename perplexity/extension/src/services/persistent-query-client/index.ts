import { QueryClient } from "@tanstack/react-query";
import {
  persistQueryClientRestore,
  type Persister,
} from "@tanstack/react-query-persist-client";
import { storage } from "@wxt-dev/storage";
import debounce from "lodash/debounce";

import { APP_CONFIG } from "@/app.config";
import type { Db } from "@/services/persistent-query-client/types";
import {
  createDexiePersister,
  debouncedPersistQueryClient,
  getCacheBusterStorageKey,
} from "@/services/persistent-query-client/utils";

export default class PersistentQueryClient {
  db: Db;
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
      "db" | "id" | "includeKeys" | "excludeKeys" | "busterFetchFn" | "buster"
    >,
  ) {
    this.db = config.db;
    this.id = config.id;
    this.queryClient = new QueryClient();
    this.persister = createDexiePersister({ db: config.db, idbKey: config.id });
    this.includeKeys = config.includeKeys;
    this.excludeKeys = config.excludeKeys;
    this.buster = config.buster;
    this.busterFetchFn = config.busterFetchFn;

    this.initInvalidator();
  }

  static async create(
    config: Pick<
      typeof PersistentQueryClient.prototype,
      "db" | "id" | "includeKeys" | "excludeKeys" | "busterFetchFn"
    >,
  ) {
    let buster = await storage.getItem<string>(
      getCacheBusterStorageKey(config.id),
    );

    if (buster == null) {
      const [remoteBuster] = await tryCatch(() => config.busterFetchFn());
      buster = remoteBuster ?? APP_CONFIG.VERSION;
      void storage.setItem(getCacheBusterStorageKey(config.id), buster);
    }

    return new PersistentQueryClient({
      ...config,
      buster,
    });
  }

  persist = async (): Promise<void> => {
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

  restore = async () => {
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

  wipe = async (): Promise<void> => {
    await PersistentQueryClient.wipeQueryCache({
      db: this.db,
      id: this.id,
      persister: this.persister,
    });
  };

  public static wipeQueryCache = async ({
    db,
    id,
    persister,
  }: {
    db: Db;
    id: string;
    persister?: Persister;
  }) => {
    await storage.removeItem(getCacheBusterStorageKey(id));
    await (
      persister ?? createDexiePersister({ db, idbKey: id })
    ).removeClient();
  };

  private initInvalidator() {
    const remoteInvalidatorHandler = debounce(
      async () => {
        if (this.sessionInvalidated) return;

        if (document.visibilityState === "visible") {
          const [remoteBuster] = await tryCatch(this.busterFetchFn);

          if (remoteBuster != null && remoteBuster !== this.buster) {
            console.log(
              `[CPLX:PersistentQueryClient:${this.id}] Invalidate query cache. Reason: remote buster changed.`,
            );

            this.sessionInvalidated = true;
            this.buster = remoteBuster;
            void this.wipe();
            void storage.setItem(
              getCacheBusterStorageKey(this.id),
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

    storage.watch(getCacheBusterStorageKey(this.id), (value) => {
      if (this.sessionInvalidated || value != null) return;

      console.log(
        `[CPLX:PersistentQueryClient:${this.id}] Invalidate query cache. Reason: cache wiped.`,
      );

      this.sessionInvalidated = true;
    });
  }
}
