import type { Query } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import {
  persistQueryClientSave,
  type Persister,
} from "@tanstack/react-query-persist-client";
import { storage } from "@wxt-dev/storage";
import debounce from "lodash/debounce";

import { APP_CONFIG } from "@/app.config";
import { isSubArray } from "@/utils/misc/utils";

export default class PersistentQueryClient {
  queryClient: QueryClient;
  persister: Persister;
  idbKey: string;
  softCacheBusterKey: `local:${string}`;
  includeKeys: string[];
  excludeKeys: string[];

  currentSeshSoftCacheBuster: string | null | undefined = undefined;

  constructor({
    idbKey,
    persister,
    softCacheBusterKey,
    includeKeys,
    excludeKeys,
  }: {
    idbKey: string;
    persister: Persister;
    softCacheBusterKey: `local:${string}`;
    includeKeys: string[];
    excludeKeys: string[];
  }) {
    this.queryClient = new QueryClient();
    this.persister = persister;
    this.idbKey = idbKey;
    this.softCacheBusterKey = softCacheBusterKey;
    this.includeKeys = includeKeys;
    this.excludeKeys = excludeKeys;
  }

  private setCurrentSeshSoftCacheBuster = (softCacheBuster: string): void => {
    this.currentSeshSoftCacheBuster = softCacheBuster;
  };

  private shouldDehydrateQuery = (query: Query): boolean => {
    const queryKey = query.queryKey;

    if (this.excludeKeys.some((exclude) => queryKey.includes(exclude))) {
      return false;
    }

    const shouldPersist = this.includeKeys.some(
      (query) =>
        Array.isArray(queryKey) &&
        isSubArray(query as unknown as unknown[], queryKey as unknown[]),
    );

    return shouldPersist;
  };

  private debouncedPersistQueryClient = debounce(async () => {
    const softCacheBuster = await storage.getItem<string>(
      this.softCacheBusterKey,
    );

    if (
      this.currentSeshSoftCacheBuster !== undefined &&
      this.currentSeshSoftCacheBuster !== softCacheBuster
    ) {
      console.log(
        `[CPLX:PersistentQueryClient:${this.idbKey}] Cache was invalidated in this session. Won't persist.`,
      );
      return;
    }

    if (this.currentSeshSoftCacheBuster === undefined) {
      this.currentSeshSoftCacheBuster = softCacheBuster;
    }

    void persistQueryClientSave({
      queryClient: this.queryClient,
      persister: this.persister,
      buster: APP_CONFIG.VERSION,
      dehydrateOptions: {
        shouldDehydrateQuery: this.shouldDehydrateQuery,
      },
    });
  }, 300);

  persistQueryClient = async (): Promise<void> => {
    void this.debouncedPersistQueryClient();
  };

  wipeQueryCache = async (): Promise<void> => {
    void this.persister.removeClient();
  };
}
