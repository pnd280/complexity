import type { QueryClient } from "@tanstack/react-query";
import type {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";

export type QueryCacheEntry = {
  key: string;
  clientData: PersistedClient;
  timestamp: number;
};

export type PersistQueryClientParams = {
  queryClient: QueryClient;
  persister: Persister;
  buster: string;
  excludeKeys: unknown[][];
  includeKeys: unknown[][];
};

export interface Db {
  add(query: QueryCacheEntry): Promise<string>;
  get(key: string): Promise<QueryCacheEntry | undefined>;
  getAll(): Promise<QueryCacheEntry[]>;
  update(key: string, query: QueryCacheEntry): Promise<string>;
  delete(key: string): Promise<void>;
}
