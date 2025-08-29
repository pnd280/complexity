import { defineProxyService } from "@webext-core/proxy-service";

import type { QueryCacheEntry } from "@/data/query-client/utils";
import { db } from "@/services/infra/indexed-db";

class QueryCacheService {
  async add(query: QueryCacheEntry): Promise<string> {
    return await db.queryCache.add(query);
  }

  async get(key: string): Promise<QueryCacheEntry | undefined> {
    return await db.queryCache.get(key);
  }

  async getAll(): Promise<QueryCacheEntry[]> {
    return await db.queryCache.toArray();
  }

  async update(key: string, query: QueryCacheEntry): Promise<string> {
    await db.queryCache.put(query);
    return key;
  }

  async delete(key: string): Promise<void> {
    await db.queryCache.delete(key);
  }
}

export const [registerService, getQueryCacheService] = defineProxyService(
  "QueryCacheService",
  () => new QueryCacheService(),
);
