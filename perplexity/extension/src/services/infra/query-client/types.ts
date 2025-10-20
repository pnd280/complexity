import type { PersistedClient } from "@tanstack/react-query-persist-client";

export type QueryCacheEntry = {
  key: string;
  clientData: PersistedClient;
  timestamp: number;
};
