import { db } from "@/services/infra/indexed-db";
import type { QueryCacheEntry } from "@/services/infra/query-client/utils";

export const backgroundProxyServiceName = "queryCacheService";

export class QueryCacheServiceImpl {
  static async add(query: QueryCacheEntry): Promise<string> {
    return await db.queryCache.add(query);
  }

  static async get(key: string): Promise<QueryCacheEntry | undefined> {
    return await db.queryCache.get(key);
  }

  static async getAll(): Promise<QueryCacheEntry[]> {
    return await db.queryCache.toArray();
  }

  static async update(key: string, query: QueryCacheEntry): Promise<string> {
    await db.queryCache.put(query);
    return key;
  }

  static async delete(key: string): Promise<void> {
    await db.queryCache.delete(key);
  }
}

export type QueryCacheService = typeof QueryCacheServiceImpl;
